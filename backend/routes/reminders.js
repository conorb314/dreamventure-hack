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