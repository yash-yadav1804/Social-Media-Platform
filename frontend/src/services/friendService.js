import api from './api';

export const friendService = {
  // Send friend request
  sendFriendRequest: async (userId) => {
    try {
      const response = await api.post(`/friends/request/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Accept friend request
  acceptFriendRequest: async (requestId) => {
    try {
      const response = await api.put(`/friends/accept/${requestId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Decline friend request
  declineFriendRequest: async (requestId) => {
    try {
      const response = await api.put(`/friends/decline/${requestId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get friend requests
  getFriendRequests: async () => {
    try {
      const response = await api.get('/friends/requests');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get friends list
  getFriends: async () => {
    try {
      const response = await api.get('/friends');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Remove friend
  removeFriend: async (friendId) => {
    try {
      const response = await api.delete(`/friends/${friendId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search users
  searchUsers: async (query) => {
    try {
      const response = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get friend status with a user
  getFriendStatus: async (userId) => {
    try {
      const response = await api.get(`/friends/status/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
