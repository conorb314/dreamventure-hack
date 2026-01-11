// routes/goals.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { authenticateToken } = require('../middleware/auth');
const dataStore = require('../utils/dataStore');
const openaiService = require('../services/openai.service');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// POST /goals
router.post('/', [
  body('title').trim().notEmpty(),
  body('description').optional().trim(),
  body('targetDate').optional().isISO8601()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: { message: 'Validation failed', errors: errors.array() } });
  }

  const { title, description, targetDate } = req.body;
  
  const goal = dataStore.create('goals', uuidv4(), {
    userId: req.user.userId,
    title,
    description: description || '',
    targetDate: targetDate || null,
    status: 'active',
    progress: 0,
    updatedAt: new Date().toISOString()
  });

  res.status(201).json(goal);
});

// GET /goals
router.get('/', (req, res) => {
  const goals = dataStore.findGoalsByUser(req.user.userId);
  res.json(goals);
});

// GET /goals/:goalId
router.get('/:goalId', (req, res) => {
  const goal = dataStore.findById('goals', req.params.goalId);
  
  if (!goal) {
    return res.status(404).json({ error: { message: 'Goal not found' } });
  }
  
  if (goal.userId !== req.user.userId) {
    return res.status(403).json({ error: { message: 'Access denied' } });
  }

  res.json(goal);
});

// PUT /goals/:goalId
router.put('/:goalId', [
  body('title').optional().trim().notEmpty(),
  body('description').optional().trim(),
  body('targetDate').optional().isISO8601(),
  body('status').optional().isIn(['active', 'completed', 'paused', 'abandoned'])
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: { message: 'Validation failed', errors: errors.array() } });
  }

  const goal = dataStore.findById('goals', req.params.goalId);
  
  if (!goal) {
    return res.status(404).json({ error: { message: 'Goal not found' } });
  }
  
  if (goal.userId !== req.user.userId) {
    return res.status(403).json({ error: { message: 'Access denied' } });
  }

  const updates = {};
  ['title', 'description', 'targetDate', 'status', 'progress'].forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const updated = dataStore.update('goals', req.params.goalId, updates);
  res.json(updated);
});

// DELETE /goals/:goalId
router.delete('/:goalId', (req, res) => {
  const goal = dataStore.findById('goals', req.params.goalId);
  
  if (!goal) {
    return res.status(404).json({ error: { message: 'Goal not found' } });
  }
  
  if (goal.userId !== req.user.userId) {
    return res.status(403).json({ error: { message: 'Access denied' } });
  }

  // Delete associated steps and progress
  const steps = dataStore.findStepsByGoal(req.params.goalId);
  steps.forEach(step => dataStore.delete('steps', step.id));
  
  const progress = dataStore.findProgressByGoal(req.params.goalId);
  progress.forEach(p => dataStore.delete('progress', p.id));

  dataStore.delete('goals', req.params.goalId);
  res.status(204).send();
});

// POST /goals/:goalId/generate-steps
router.post('/:goalId/generate-steps', [
  body('intensity').optional().isIn(['low', 'medium', 'high']),
  body('timeframe').optional().trim()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: { message: 'Validation failed', errors: errors.array() } });
  }

  const goal = dataStore.findById('goals', req.params.goalId);
  
  if (!goal) {
    return res.status(404).json({ error: { message: 'Goal not found' } });
  }
  
  if (goal.userId !== req.user.userId) {
    return res.status(403).json({ error: { message: 'Access denied' } });
  }

  try {
    const { intensity = 'medium', timeframe = '3 months' } = req.body;
    
    const steps = await openaiService.generateGoalSteps(
      goal.title,
      goal.description,
      intensity,
      timeframe
    );

    // Save generated steps
    const savedSteps = steps.map(step => 
      dataStore.create('steps', uuidv4(), {
        goalId: goal.id,
        userId: req.user.userId,
        title: step.title,
        description: step.description || '',
        week: step.week,
        completed: false,
        updatedAt: new Date().toISOString()
      })
    );

    res.json({ steps: savedSteps });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
});

// GET /goals/:goalId/stats
router.get('/:goalId/stats', (req, res) => {
  const goal = dataStore.findById('goals', req.params.goalId);
  
  if (!goal || goal.userId !== req.user.userId) {
    return res.status(404).json({ error: { message: 'Goal not found' } });
  }

  const steps = dataStore.findStepsByGoal(req.params.goalId);
  const progress = dataStore.findProgressByGoal(req.params.goalId);
  const streak = dataStore.calculateStreak(req.params.goalId);

  const completedSteps = steps.filter(s => s.completed).length;
  const totalSteps = steps.length;

  const stats = {
    goalId: goal.id,
    overallProgress: goal.progress,
    completedSteps,
    totalSteps,
    completionPercentage: totalSteps > 0 ? (completedSteps / totalSteps * 100).toFixed(1) : 0,
    totalCheckIns: progress.length,
    currentStreak: streak,
    daysToTarget: goal.targetDate ? Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24)) : null
  };

  res.json(stats);
});

// GET /goals/:goalId/timeline
router.get('/:goalId/timeline', (req, res) => {
  const goal = dataStore.findById('goals', req.params.goalId);
  
  if (!goal || goal.userId !== req.user.userId) {
    return res.status(404).json({ error: { message: 'Goal not found' } });
  }

  const steps = dataStore.findStepsByGoal(req.params.goalId);
  const progress = dataStore.findProgressByGoal(req.params.goalId);

  const timeline = [
    { type: 'goal_created', date: goal.createdAt, data: { title: goal.title } },
    ...steps.map(s => ({ 
      type: s.completed ? 'step_completed' : 'step_created', 
      date: s.completed ? s.updatedAt : s.createdAt, 
      data: { stepTitle: s.title } 
    })),
    ...progress.map(p => ({ 
      type: 'progress_logged', 
      date: p.createdAt, 
      data: { notes: p.notes, value: p.value } 
    }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  res.json({ timeline });
});

module.exports = router;