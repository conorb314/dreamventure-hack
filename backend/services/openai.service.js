// services/openai.service.js
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class OpenAIService {
  async generateGoalSteps(goalTitle, goalDescription, intensity = 'medium', timeframe = 'flexible') {
    try {
      const prompt = `You are a goal-setting and habit formation expert. Break down the following goal into actionable steps.

Goal: ${goalTitle}
Description: ${goalDescription}
Intensity: ${intensity}

Generate a realistic, progressive plan with 8-12 steps. Each step should:
- Build on previous steps
- Be specific and measurable
- Match the ${intensity} intensity level
- Be achievable milestones

IMPORTANT: 
- Only include a "week" field if the goal naturally fits a weekly timeline (like "learn Spanish in 3 months")
- For open-ended goals (like "get better at photography"), omit the "week" field entirely
- Focus on logical progression rather than strict timing
- Steps should represent meaningful progress points, not arbitrary time markers

Return ONLY a JSON array with this exact format:
[
  {
    "title": "Step description",
    "week": 1,  // ONLY include this if the goal has a natural weekly timeline
    "description": "Detailed explanation"
  }
]

Example WITHOUT weeks (for ongoing goals):
[
  {
    "title": "Learn basic camera settings",
    "description": "Understand aperture, shutter speed, and ISO"
  },
  {
    "title": "Practice daily for 30 minutes",
    "description": "Take photos in different lighting conditions"
  }
]

Example WITH weeks (for time-bound goals):
[
  {
    "title": "Master basic greetings and introductions",
    "week": 1,
    "description": "Learn hello, goodbye, my name is, etc."
  }
]`;

      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert goal-setting coach. Always respond with valid JSON only, no markdown or extra text. Adapt your timeline recommendations to the nature of the goal - use weeks only when appropriate.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      });

      let content = completion.choices[0].message.content.trim();
      
      // Remove markdown code blocks if present
      content = content.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
      
      // Try to find JSON array in the content
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      
      if (!jsonMatch) {
        console.error('No JSON array found in response:', content);
        throw new Error('Invalid response format from OpenAI');
      }
      
      const steps = parseOpenAIJSON(jsonMatch[0]);     
        
      // Validate the response structure
      if (!Array.isArray(steps) || steps.length === 0) {
        throw new Error('Invalid steps array returned');
      }
      
      return steps;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      console.error('Error details:', error.message);
      throw new Error('Failed to generate goal steps: ' + error.message);
    }
  }

  async provideCoaching(goalData, userMessage, progressHistory = []) {
    try {
      const context = `
Goal: ${goalData.title}
Current Progress: ${(goalData.progress * 100).toFixed(0)}%
Status: ${goalData.status}
Target Date: ${goalData.targetDate || 'No specific deadline'}
Recent Progress: ${progressHistory.slice(0, 5).map(p => `- ${p.notes || 'Completed step'}`).join('\n')}
`;

      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a supportive, motivating goal coach. Provide personalized, actionable advice. Be encouraging but realistic. Keep responses concise and focused.'
          },
          {
            role: 'user',
            content: `Context:\n${context}\n\nUser Question: ${userMessage}`
          }
        ],
        temperature: 0.8,
        max_tokens: 500
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI Coaching Error:', error);
      throw new Error('Failed to generate coaching advice: ' + error.message);
    }
  }

  async analyzeProgress(goalData, steps, progressEntries) {
    try {
      const completedSteps = steps.filter(s => s.completed).length;
      const totalSteps = steps.length;
      const recentActivity = progressEntries.slice(0, 7);

      const prompt = `Analyze this goal progress and provide insights:

Goal: ${goalData.title}
Completed Steps: ${completedSteps}/${totalSteps}
Overall Progress: ${(goalData.progress * 100).toFixed(0)}%
Recent Activity (last 7 entries): ${recentActivity.length} check-ins
Target Date: ${goalData.targetDate || 'Open-ended goal'}

Provide a brief analysis with:
1. Current trajectory (on track, behind, ahead, or steady progress for open-ended goals)
2. One specific recommendation
3. One encouraging observation

Keep it concise (3-4 sentences).`;

      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a data-driven goal analyst. Be concise and actionable.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.6,
        max_tokens: 300
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI Analysis Error:', error);
      throw new Error('Failed to analyze progress: ' + error.message);
    }
  }
}

const parseOpenAIJSON = (text) => {
  text = text.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '');

  // Remove trailing commas before closing array/object
  text = text.replace(/,(\s*[\]}])/g, '$1');

  // Remove duplicated opening braces (like "{{")
  text = text.replace(/{{/g, '{');

  // Remove duplicated closing braces (like "}}")
  text = text.replace(/}}/g, '}');

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Failed to parse JSON from OpenAI:", text);
    throw new Error("Invalid JSON format from OpenAI");
  }
};

module.exports = new OpenAIService();