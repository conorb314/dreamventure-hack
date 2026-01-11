// routes/progress.js
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

// routes/habits.js
const habitRouter = express.Router();
habitRouter.use(authenticateToken);

habitRouter.post('/', [
  body('name').trim().notEmpty(),
  body('frequency').isIn(['daily', 'weekly', 'custom']),
  body('goalId').optional()
], (req, res) => {
  const { name, frequency, goalId } = req.body;

  const habit = dataStore.create('habits', uuidv4(), {
    userId: req.user.userId,
    name,
    frequency,
    goalId: goalId || null,
    active: true,
    streak: 0
  });

  res.status(201).json(habit);
});

habitRouter.get('/', (req, res) => {
  const habits = dataStore.findAll('habits', { userId: req.user.userId });
  res.json(habits);
});

habitRouter.put('/:habitId', (req, res) => {
  const habit = dataStore.findById('habits', req.params.habitId);
  if (!habit || habit.userId !== req.user.userId) {
    return res.status(404).json({ error: { message: 'Habit not found' } });
  }

  const updates = {};
  ['name', 'frequency', 'active'].forEach(field => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const updated = dataStore.update('habits', req.params.habitId, updates);
  res.json(updated);
});

habitRouter.delete('/:habitId', (req, res) => {
  const habit = dataStore.findById('habits', req.params.habitId);
  if (!habit || habit.userId !== req.user.userId) {
    return res.status(404).json({ error: { message: 'Habit not found' } });
  }

  dataStore.delete('habits', req.params.habitId);
  res.status(204).send();
});

// routes/reminders.js
const reminderRouter = express.Router();
reminderRouter.use(authenticateToken);

reminderRouter.post('/', [
  body('goalId').optional(),
  body('habitId').optional(),
  body('message').trim().notEmpty(),
  body('scheduledTime').isISO8601()
], (req, res) => {
  const { goalId, habitId, message, scheduledTime } = req.body;

  const reminder = dataStore.create('reminders', uuidv4(), {
    userId: req.user.userId,
    goalId: goalId || null,
    habitId: habitId || null,
    message,
    scheduledTime,
    sent: false
  });

  res.status(201).json(reminder);
});

reminderRouter.get('/', (req, res) => {
  const reminders = dataStore.findAll('reminders', { userId: req.user.userId });
  res.json(reminders);
});

reminderRouter.delete('/:reminderId', (req, res) => {
  const reminder = dataStore.findById('reminders', req.params.reminderId);
  if (!reminder || reminder.userId !== req.user.userId) {
    return res.status(404).json({ error: { message: 'Reminder not found' } });
  }

  dataStore.delete('reminders', req.params.reminderId);
  res.status(204).send();
});

// routes/templates.js
const templateRouter = express.Router();

templateRouter.get('/', (req, res) => {
  const templates = dataStore.findAll('templates');
  res.json(templates);
});

templateRouter.post('/:id/use', authenticateToken, (req, res) => {
  const template = dataStore.findById('templates', req.params.id);
  if (!template) {
    return res.status(404).json({ error: { message: 'Template not found' } });
  }

  const goal = dataStore.create('goals', uuidv4(), {
    userId: req.user.userId,
    title: template.title,
    description: template.description,
    status: 'active',
    progress: 0
  });

  const steps = template.steps.map(s => 
    dataStore.create('steps', uuidv4(), {
      goalId: goal.id,
      userId: req.user.userId,
      title: s.title,
      week: s.week,
      completed: false
    })
  );

  res.status(201).json({ goal, steps });
});

// routes/settings.js
const settingsRouter = express.Router();
settingsRouter.use(authenticateToken);

settingsRouter.get('/', (req, res) => {
  const settings = dataStore.findById('settings', req.user.userId) || {
    userId: req.user.userId,
    preferredPacing: 'medium',
    reminderTime: '09:00',
    emailNotifications: true,
    pushNotifications: true
  };
  res.json(settings);
});

settingsRouter.put('/', (req, res) => {
  const existing = dataStore.findById('settings', req.user.userId);
  
  if (existing) {
    const updated = dataStore.update('settings', req.user.userId, req.body);
    res.json(updated);
  } else {
    const created = dataStore.create('settings', req.user.userId, req.body);
    res.json(created);
  }
});

// routes/streaks.js
const streakRouter = express.Router();
streakRouter.use(authenticateToken);

streakRouter.get('/', (req, res) => {
  const goals = dataStore.findGoalsByUser(req.user.userId);
  
  const streaks = goals.map(goal => ({
    goalId: goal.id,
    goalTitle: goal.title,
    currentStreak: dataStore.calculateStreak(goal.id)
  }));

  res.json(streaks);
});

streakRouter.get('/:goalId/streak', (req, res) => {
  const goal = dataStore.findById('goals', req.params.goalId);
  if (!goal || goal.userId !== req.user.userId) {
    return res.status(404).json({ error: { message: 'Goal not found' } });
  }

  const streak = dataStore.calculateStreak(req.params.goalId);
  res.json({ goalId: goal.id, currentStreak: streak });
});

module.exports = {
  progress: progressRouter,
  habits: habitRouter,
  reminders: reminderRouter,
  templates: templateRouter,
  settings: settingsRouter,
  streaks: streakRouter
};