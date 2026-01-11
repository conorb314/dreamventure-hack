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
