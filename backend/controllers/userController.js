const User = require('../models/User');
const { FriendRequest, Friendship } = require('../models/Friend');
const { validationResult } = require('express-validator');

// @desc    Search users by username or email
// @route   GET /api/users/search?q=searchterm
// @access  Private
const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    const currentUserId = req.userId;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    // Search users by username or email (case-insensitive)
    const users = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, // Exclude current user
        {
          $or: [
            { username: { $regex: q, $options: 'i' } },
            { email: { $regex: q, $options: 'i' } }
          ]
        }
      ]
    }).select('username email createdAt').limit(10);

    // Get friend status for each user
    const usersWithStatus = await Promise.all(
      users.map(async (user) => {
        // Check if they are friends
        const friendship = await Friendship.findOne({
          $or: [
            { user1: currentUserId, user2: user._id },
            { user1: user._id, user2: currentUserId }
          ]
        });

        if (friendship) {
          return { ...user.toObject(), friendStatus: 'friends' };
        }

        // Check for pending requests
        const pendingRequest = await FriendRequest.findOne({
          $or: [
            { from: currentUserId, to: user._id, status: 'pending' },
            { from: user._id, to: currentUserId, status: 'pending' }
          ]
        });

        if (pendingRequest) {
          const status = pendingRequest.from.toString() === currentUserId.toString() 
            ? 'request_sent' 
            : 'request_received';
          
          return { ...user.toObject(), friendStatus: status };
        }

        return { ...user.toObject(), friendStatus: 'not_friends' };
      })
    );

    res.status(200).json({
      success: true,
      users: usersWithStatus
    });

  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile/:userId
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.userId;

    const user = await User.findById(userId).select('-password -tokens');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get friend status
    let friendStatus = 'not_friends';
    
    if (userId === currentUserId.toString()) {
      friendStatus = 'self';
    } else {
      // Check if they are friends
      const friendship = await Friendship.findOne({
        $or: [
          { user1: currentUserId, user2: userId },
          { user1: userId, user2: currentUserId }
        ]
      });

      if (friendship) {
        friendStatus = 'friends';
      } else {
        // Check for pending requests
        const pendingRequest = await FriendRequest.findOne({
          $or: [
            { from: currentUserId, to: userId, status: 'pending' },
            { from: userId, to: currentUserId, status: 'pending' }
          ]
        });

        if (pendingRequest) {
          friendStatus = pendingRequest.from.toString() === currentUserId.toString() 
            ? 'request_sent' 
            : 'request_received';
        }
      }
    }

    // Get friends count
    const friendsCount = await Friendship.countDocuments({
      $or: [{ user1: userId }, { user2: userId }]
    });

    res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),
        friendStatus,
        friendsCount
      }
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const userId = req.userId;
    const { username, email } = req.body;

    // Check if username or email already exists (excluding current user)
    if (username || email) {
      const existingUser = await User.findOne({
        $and: [
          { _id: { $ne: userId } },
          {
            $or: [
              ...(username ? [{ username }] : []),
              ...(email ? [{ email }] : [])
            ]
          }
        ]
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username or email already exists'
        });
      }
    }

    // Update user
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password -tokens');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  searchUsers,
  getUserProfile,
  updateProfile
};
