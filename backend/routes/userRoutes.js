const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

// @route   GET /api/users/search
// @desc    Search users by username or email
// @access  Private
router.get('/search', auth, userController.searchUsers);

// @route   GET /api/users/profile/:userId
// @desc    Get user profile
// @access  Private
router.get('/profile/:userId', auth, userController.getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', 
  [
    check('username', 'Username is required').optional().not().isEmpty(),
    check('email', 'Please include a valid email').optional().isEmail()
  ],
  auth, 
  userController.updateProfile
);

module.exports = router;
