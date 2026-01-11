// routes/forum.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const dataStore = require('../utils/dataStore');

const router = express.Router();
router.use(authenticateToken);

// Get forum posts with sorting
router.get('/posts', async (req, res) => {
  const { sortBy = 'recent' } = req.query;
  const userId = req.user.userId;

  let posts = dataStore.findAll('forumPosts');

  // Add comment count and user vote
  posts = posts.map(post => {
    const comments = dataStore.findAll('forumComments', { postId: post.id });
    const vote = dataStore.findAll('forumVotes', { postId: post.id, userId })[0];

    return {
      ...post,
      commentCount: comments.length,
      userVote: vote ? vote.voteType : null
    };
  });

  // Sorting
  if (sortBy === 'top') {
    posts.sort((a, b) => (b.likes - b.dislikes) - (a.likes - a.dislikes));
  } else {
    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  res.json(posts);
});

// Create a new forum post
router.post('/posts', [
  body('title').trim().notEmpty(),
  body('content').trim().notEmpty()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: { message: 'Validation failed', errors: errors.array() } });

  const post = dataStore.create('forumPosts', uuidv4(), {
    userId: req.user.userId,
    title: req.body.title,
    content: req.body.content,
    likes: 0,
    dislikes: 0,
    createdAt: new Date().toISOString()
  });

  res.status(201).json(post);
});

// Get comments for a post
router.get('/posts/:postId/comments', (req, res) => {
  const { postId } = req.params;
  const comments = dataStore.findAll('forumComments', { postId });
  res.json(comments);
});

// Add a comment to a post
router.post('/posts/:postId/comments', [
  body('content').trim().notEmpty()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: { message: 'Validation failed', errors: errors.array() } });

  const { postId } = req.params;
  const post = dataStore.findById('forumPosts', postId);
  if (!post) return res.status(404).json({ error: { message: 'Post not found' } });

  const comment = dataStore.create('forumComments', uuidv4(), {
    postId,
    userId: req.user.userId,
    content: req.body.content,
    createdAt: new Date().toISOString()
  });

  // Notification for post author
  if (post.userId !== req.user.userId) {
    const commenter = dataStore.findById('users', req.user.userId);
    dataStore.create('forumNotifications', uuidv4(), {
      userId: post.userId,
      postId,
      postTitle: post.title,
      commenterName: commenter.name,
      read: false,
      createdAt: new Date().toISOString()
    });
  }

  res.status(201).json(comment);
});

// Vote on a post
router.post('/posts/:postId/vote', [
  body('voteType').isIn(['like', 'dislike'])
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: { message: 'Invalid vote type', errors: errors.array() } });

  const { postId } = req.params;
  const post = dataStore.findById('forumPosts', postId);
  if (!post) return res.status(404).json({ error: { message: 'Post not found' } });

  const { voteType } = req.body;
  const existingVote = dataStore.findAll('forumVotes', { postId, userId: req.user.userId })[0];

  if (existingVote) {
    if (existingVote.voteType === voteType) {
      // Remove vote
      dataStore.delete('forumVotes', existingVote.id);
      post[voteType === 'like' ? 'likes' : 'dislikes']--;
    } else {
      // Change vote
      dataStore.update('forumVotes', existingVote.id, { voteType });
      const addColumn = voteType === 'like' ? 'likes' : 'dislikes';
      const subColumn = voteType === 'like' ? 'dislikes' : 'likes';
      post[addColumn]++;
      post[subColumn]--;
    }
  } else {
    // New vote
    dataStore.create('forumVotes', uuidv4(), { postId, userId: req.user.userId, voteType, createdAt: new Date().toISOString() });
    post[voteType === 'like' ? 'likes' : 'dislikes']++;
  }

  dataStore.update('forumPosts', post.id, post);
  res.json({ success: true });
});

// Get user notifications
router.get('/notifications', (req, res) => {
  const notifications = dataStore.findAll('forumNotifications', { userId: req.user.userId });
  notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(notifications);
});

// Mark notification as read
router.patch('/notifications/:notificationId/read', (req, res) => {
  const notif = dataStore.findById('forumNotifications', req.params.notificationId);
  if (!notif || notif.userId !== req.user.userId) return res.status(404).json({ error: { message: 'Notification not found' } });

  dataStore.update('forumNotifications', notif.id, { read: true });
  res.json({ success: true });
});

module.exports = router;
