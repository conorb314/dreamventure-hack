const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { authenticateToken } = require('../middleware/auth');
const dataStore = require('../utils/dataStore');

const progressRouter = express.Router();
progressRouter.use(authenticateToken);

progressRouter.post('/', [
  body('goalId').notEmpty(),
  body('value').optional().isNumeric(),
  body('notes').optional().trim()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: { message: 'Validation failed', errors: errors.array() } });
  }

  const { goalId, stepId, value, notes } = req.body;
  
  const goal = dataStore.findById('goals', goalId);
  if (!goal || goal.userId !== req.user.userId) {
    return res.status(404).json({ error: { message: 'Goal not found' } });
  }

  const progress = dataStore.create('progress', uuidv4(), {
    goalId,
    stepId: stepId || null,
    userId: req.user.userId,
    value: value || 1,
    notes: notes || '',
    date: new Date().toISOString()
  });

  res.status(201).json(progress);
});

progressRouter.get('/', (req, res) => {
  const { goalId } = req.query;
  
  if (goalId) {
    const goal = dataStore.findById('goals', goalId);
    if (!goal || goal.userId !== req.user.userId) {
      return res.status(404).json({ error: { message: 'Goal not found' } });
    }
    return res.json(dataStore.findProgressByGoal(goalId));
  }

  const allProgress = dataStore.findAll('progress', { userId: req.user.userId });
  res.json(allProgress);
});