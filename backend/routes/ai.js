// routes/ai.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const dataStore = require('../utils/dataStore');
const openaiService = require('../services/openai.service');

const router = express.Router();
router.use(authenticateToken);

// POST /ai/coach
router.post('/coach', [
  body('goalId').notEmpty(),
  body('message').trim().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: { message: 'Validation failed', errors: errors.array() } });
  }

  const { goalId, message } = req.body;
  
  const goal = dataStore.findById('goals', goalId);
  if (!goal || goal.userId !== req.user.userId) {
    return res.status(404).json({ error: { message: 'Goal not found' } });
  }

  try {
    const progressHistory = dataStore.findProgressByGoal(goalId).slice(0, 10);
    const advice = await openaiService.provideCoaching(goal, message, progressHistory);

    res.json({
      goalId,
      userMessage: message,
      coachResponse: advice,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
});

// GET /ai/analyze/:goalId
router.get('/analyze/:goalId', async (req, res) => {
  const goal = dataStore.findById('goals', req.params.goalId);
  if (!goal || goal.userId !== req.user.userId) {
    return res.status(404).json({ error: { message: 'Goal not found' } });
  }

  try {
    const steps = dataStore.findStepsByGoal(req.params.goalId);
    const progressEntries = dataStore.findProgressByGoal(req.params.goalId);
    
    const analysis = await openaiService.analyzeProgress(goal, steps, progressEntries);

    res.json({
      goalId: goal.id,
      analysis,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
});

module.exports = router;