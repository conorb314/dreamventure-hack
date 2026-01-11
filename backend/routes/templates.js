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