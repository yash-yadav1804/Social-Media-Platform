const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const friendController = require('../controllers/friendController');

// @route   POST /api/friends/request/:userId
// @desc    Send friend request
// @access  Private
router.post('/request/:userId', auth, friendController.sendFriendRequest);

// @route   GET /api/friends/requests
// @desc    Get friend requests (received)
// @access  Private
router.get('/requests', auth, friendController.getFriendRequests);

// @route   PUT /api/friends/accept/:requestId
// @desc    Accept friend request
// @access  Private
router.put('/accept/:requestId', auth, friendController.acceptFriendRequest);

// @route   PUT /api/friends/decline/:requestId
// @desc    Decline friend request
// @access  Private
router.put('/decline/:requestId', auth, friendController.declineFriendRequest);

// @route   GET /api/friends
// @desc    Get friends list
// @access  Private
router.get('/', auth, friendController.getFriends);

// @route   DELETE /api/friends/:friendId
// @desc    Remove friend
// @access  Private
router.delete('/:friendId', auth, friendController.removeFriend);

// @route   GET /api/friends/status/:userId
// @desc    Get friend status with a user
// @access  Private
router.get('/status/:userId', auth, friendController.getFriendStatus);

module.exports = router;
