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