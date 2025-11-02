import React from 'react';
import { Spinner } from 'react-bootstrap';
import PostCard from './PostCard';

const PostList = ({ posts, loading, onPostUpdated, onPostDeleted }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-inbox" style={{ fontSize: '3rem', color: '#ccc' }}></i>
        <p className="text-muted mt-3">No posts yet. Be the first to share!</p>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard 
          key={post._id} 
          post={post} 
          onPostUpdated={onPostUpdated}
          onPostDeleted={onPostDeleted}
        />
      ))}
    </div>
  );
};

export default PostList;
