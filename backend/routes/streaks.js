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