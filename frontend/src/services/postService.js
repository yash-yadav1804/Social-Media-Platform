import api from './api';

export const postService = {
  // Get all posts
  getPosts: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/posts?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single post
  getPost: async (postId) => {
    try {
      const response = await api.get(`/posts/${postId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create post
  createPost: async (postData) => {
    try {
      const response = await api.post('/posts', postData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update post
  updatePost: async (postId, postData) => {
    try {
      const response = await api.put(`/posts/${postId}`, postData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete post
  deletePost: async (postId) => {
    try {
      const response = await api.delete(`/posts/${postId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Like/Unlike post
  likePost: async (postId) => {
    try {
      const response = await api.post(`/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add comment
  addComment: async (postId, text) => {
    try {
      const response = await api.post(`/posts/${postId}/comments`, { text });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete comment
  deleteComment: async (postId, commentId) => {
    try {
      const response = await api.delete(`/posts/${postId}/comment/${commentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
