// backend/routes/postRoutes.js
const express = require('express');
const router = express.Router();
const { 
  createPost, 
  getAllPosts, 
  likePost, 
  addComment,
  deletePost
} = require('../controllers/postController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Create post with optional image
router.post('/', auth, upload.single('image'), createPost);

// Get all posts
router.get('/', auth, getAllPosts);

// Like a post
router.post('/:id/like', auth, likePost);

// Add comment to post
router.post('/:id/comments', auth, addComment);

// Delete post
router.delete('/:id', auth, deletePost);

module.exports = router;