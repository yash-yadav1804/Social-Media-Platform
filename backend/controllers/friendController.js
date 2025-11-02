const { FriendRequest, Friendship } = require('../models/Friend');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Send friend request
// @route   POST /api/friends/request/:userId
// @access  Private
const sendFriendRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const fromUserId = req.userId;

    // Check if trying to send request to self
    if (userId === fromUserId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send friend request to yourself'
      });
    }

    // Check if target user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if friendship already exists
    const existingFriendship = await Friendship.findOne({
      $or: [
        { user1: fromUserId, user2: userId },
        { user1: userId, user2: fromUserId }
      ]
    });

    if (existingFriendship) {
      return res.status(400).json({
        success: false,
        message: 'You are already friends with this user'
      });
    }

    // Check if friend request already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { from: fromUserId, to: userId },
        { from: userId, to: fromUserId }
      ]
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'Friend request already exists'
      });
    }

    // Create friend request
    const friendRequest = new FriendRequest({
      from: fromUserId,
      to: userId
    });

    await friendRequest.save();
    await friendRequest.populate('from', 'username email');

    res.status(201).json({
      success: true,
      message: 'Friend request sent successfully',
      request: friendRequest
    });

  } catch (error) {
    console.error('Send friend request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get friend requests (received)
// @route   GET /api/friends/requests
// @access  Private
const getFriendRequests = async (req, res) => {
  try {
    const userId = req.userId;

    const requests = await FriendRequest.find({
      to: userId,
      status: 'pending'
    }).populate('from', 'username email').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      requests
    });

  } catch (error) {
    console.error('Get friend requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Accept friend request
// @route   PUT /api/friends/accept/:requestId
// @access  Private
const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.userId;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({
        success: false,
        message: 'Friend request not found'
      });
    }

    // Check if the request is for the current user
    if (friendRequest.to.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to accept this request'
      });
    }

    if (friendRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Friend request already processed'
      });
    }

    // Update request status
    friendRequest.status = 'accepted';
    await friendRequest.save();

    // Create friendship
    const friendship = new Friendship({
      user1: friendRequest.from,
      user2: friendRequest.to
    });

    await friendship.save();

    res.status(200).json({
      success: true,
      message: 'Friend request accepted',
      friendship
    });

  } catch (error) {
    console.error('Accept friend request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Decline friend request
// @route   PUT /api/friends/decline/:requestId
// @access  Private
const declineFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.userId;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({
        success: false,
        message: 'Friend request not found'
      });
    }

    // Check if the request is for the current user
    if (friendRequest.to.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to decline this request'
      });
    }

    if (friendRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Friend request already processed'
      });
    }

    // Update request status
    friendRequest.status = 'declined';
    await friendRequest.save();

    res.status(200).json({
      success: true,
      message: 'Friend request declined'
    });

  } catch (error) {
    console.error('Decline friend request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get friends list
// @route   GET /api/friends
// @access  Private
const getFriends = async (req, res) => {
  try {
    const userId = req.userId;

    const friendships = await Friendship.find({
      $or: [{ user1: userId }, { user2: userId }]
    }).populate('user1', 'username email')
      .populate('user2', 'username email')
      .sort({ createdAt: -1 });

    // Extract friend data (the other user in the friendship)
    const friends = friendships.map(friendship => {
      return friendship.user1._id.toString() === userId.toString() 
        ? friendship.user2 
        : friendship.user1;
    });

    res.status(200).json({
      success: true,
      friends
    });

  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Remove friend
// @route   DELETE /api/friends/:friendId
// @access  Private
const removeFriend = async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.userId;

    const friendship = await Friendship.findOneAndDelete({
      $or: [
        { user1: userId, user2: friendId },
        { user1: friendId, user2: userId }
      ]
    });

    if (!friendship) {
      return res.status(404).json({
        success: false,
        message: 'Friendship not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Friend removed successfully'
    });

  } catch (error) {
    console.error('Remove friend error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get friend status with a user
// @route   GET /api/friends/status/:userId
// @access  Private
const getFriendStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.userId;

    // Check if they are friends
    const friendship = await Friendship.findOne({
      $or: [
        { user1: currentUserId, user2: userId },
        { user1: userId, user2: currentUserId }
      ]
    });

    if (friendship) {
      return res.status(200).json({
        success: true,
        status: 'friends'
      });
    }

    // Check for pending requests
    const pendingRequest = await FriendRequest.findOne({
      $or: [
        { from: currentUserId, to: userId, status: 'pending' },
        { from: userId, to: currentUserId, status: 'pending' }
      ]
    });

    if (pendingRequest) {
      const status = pendingRequest.from.toString() === currentUserId.toString() 
        ? 'request_sent' 
        : 'request_received';
      
      return res.status(200).json({
        success: true,
        status
      });
    }

    res.status(200).json({
      success: true,
      status: 'not_friends'
    });

  } catch (error) {
    console.error('Get friend status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  getFriends,
  removeFriend,
  getFriendStatus
};
