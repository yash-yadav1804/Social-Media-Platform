const mongoose = require('mongoose');

const friendRequestSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to prevent duplicate friend requests
friendRequestSchema.index({ from: 1, to: 1 }, { unique: true });

// Update updatedAt on save
friendRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const friendshipSchema = new mongoose.Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to prevent duplicate friendships and enable fast lookups
friendshipSchema.index({ user1: 1, user2: 1 }, { unique: true });
friendshipSchema.index({ user1: 1 });
friendshipSchema.index({ user2: 1 });

const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);
const Friendship = mongoose.model('Friendship', friendshipSchema);

module.exports = {
  FriendRequest,
  Friendship
};
