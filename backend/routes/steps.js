// routes/steps.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { authenticateToken } = require('../middleware/auth');
const dataStore = require('../utils/dataStore');

const router = express.Router();
router.use(authenticateToken);

// POST /goals/:goalId/steps
router.post('/:goalId/steps', [
  body('title').trim().notEmpty(),
  body('description').optional().trim(),
  body('week').optional().isInt()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: { message: 'Validation failed', errors: errors.array() } });
  }

  const goal = dataStore.findById('goals', req.params.goalId);
  if (!goal || goal.userId !== req.user.userId) {
    return res.status(404).json({ error: { message: 'Goal not found' } });
  }

  const { title, description, week } = req.body;
  
  const step = dataStore.create('steps', uuidv4(), {
    goalId: req.params.goalId,
    userId: req.user.userId,
    title,
    description: description || '',
    week: week || null,
    completed: false,
    updatedAt: new Date().toISOString()
  });

  res.status(201).json(step);
});

// GET /goals/:goalId/steps
router.get('/:goalId/steps', (req, res) => {
  const goal = dataStore.findById('goals', req.params.goalId);
  if (!goal || goal.userId !== req.user.userId) {
    return res.status(404).json({ error: { message: 'Goal not found' } });
  }

  const steps = dataStore.findStepsByGoal(req.params.goalId);
  res.json(steps);
});

// PUT /steps/:stepId
router.put('/:stepId', [
  body('title').optional().trim().notEmpty(),
  body('description').optional().trim(),
  body('completed').optional().isBoolean()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: { message: 'Validation failed', errors: errors.array() } });
  }

  const step = dataStore.findById('steps', req.params.stepId);
  if (!step || step.userId !== req.user.userId) {
    return res.status(404).json({ error: { message: 'Step not found' } });
  }

  const updates = {};
  ['title', 'description', 'completed', 'week'].forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const updated = dataStore.update('steps', req.params.stepId, updates);

  // Update goal progress
  if (updates.completed !== undefined) {
    const allSteps = dataStore.findStepsByGoal(step.goalId);
    const completedCount = allSteps.filter(s => s.completed).length;
    const progress = allSteps.length > 0 ? completedCount / allSteps.length : 0;
    dataStore.update('goals', step.goalId, { progress });
  }

  res.json(updated);
});

// PATCH /steps/:stepId/progress
router.patch('/:stepId/progress', [
  body('completed').isBoolean()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: { message: 'Validation failed', errors: errors.array() } });
  }

  const step = dataStore.findById('steps', req.params.stepId);
  if (!step || step.userId !== req.user.userId) {
    return res.status(404).json({ error: { message: 'Step not found' } });
  }

  const updated = dataStore.update('steps', req.params.stepId, { 
    completed: req.body.completed 
  });

  // Update goal progress
  const allSteps = dataStore.findStepsByGoal(step.goalId);
  const completedCount = allSteps.filter(s => s.completed).length;
  const progress = allSteps.length > 0 ? completedCount / allSteps.length : 0;
  dataStore.update('goals', step.goalId, { progress });

  res.json(updated);
});

// DELETE /steps/:stepId
router.delete('/:stepId', (req, res) => {
  const step = dataStore.findById('steps', req.params.stepId);
  if (!step || step.userId !== req.user.userId) {
    return res.status(404).json({ error: { message: 'Step not found' } });
  }

  dataStore.delete('steps', req.params.stepId);

  // Update goal progress
  const allSteps = dataStore.findStepsByGoal(step.goalId);
  const completedCount = allSteps.filter(s => s.completed).length;
  const progress = allSteps.length > 0 ? completedCount / allSteps.length : 0;
  dataStore.update('goals', step.goalId, { progress });

  res.status(204).send();
});

module.exports = router;