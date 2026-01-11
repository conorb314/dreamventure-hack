// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { authenticateToken } = require('../middleware/auth');
const dataStore = require('../utils/dataStore');

const router = express.Router();

// Generate tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );

  return { accessToken, refreshToken };
};

// POST /auth/register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: { message: 'Validation failed', errors: errors.array() } });
  }

  const { email, password, name } = req.body;

  if (dataStore.findByEmail(email)) {
    return res.status(409).json({ error: { message: 'Email already registered' } });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = dataStore.create('users', uuidv4(), {
    email,
    password: hashedPassword,
    name
  });

  const tokens = generateTokens(user);

  res.status(201).json({
    user: { id: user.id, email: user.email, name: user.name },
    ...tokens
  });
});

// POST /auth/login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: { message: 'Validation failed', errors: errors.array() } });
  }

  const { email, password } = req.body;
  const user = dataStore.findByEmail(email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: { message: 'Invalid credentials' } });
  }

  const tokens = generateTokens(user);

  res.json({
    user: { id: user.id, email: user.email, name: user.name },
    ...tokens
  });
});

// POST /auth/refresh
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: { message: 'Refresh token required' } });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: { message: 'Invalid refresh token' } });
    }

    const user = dataStore.findById('users', decoded.userId);
    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    const tokens = generateTokens(user);
    res.json(tokens);
  });
});

// GET /auth/me
router.get('/me', authenticateToken, (req, res) => {
  const user = dataStore.findById('users', req.user.userId);
  
  if (!user) {
    return res.status(404).json({ error: { message: 'User not found' } });
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt
  });
});

// POST /auth/logout
router.post('/logout', authenticateToken, (req, res) => {
  // In a real app, you'd invalidate the refresh token in the database
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;