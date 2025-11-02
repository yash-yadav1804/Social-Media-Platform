import React, { useState } from 'react';
import { Card, Form, Button, Dropdown } from 'react-bootstrap';
import { useAuth } from '../../utils/AuthContext';
import { postService } from '../../services/postService';

const PostCard = ({ post, onPostUpdated, onPostDeleted }) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const isLiked = user && post.likes.includes(user._id);
  const isOwner = user && post.userId._id === user._id;

  const handleLike = async () => {
    try {
      const response = await postService.likePost(post._id);
      if (response.success && onPostUpdated) {
        onPostUpdated(response.post);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const response = await postService.addComment(post._id, commentText);
      if (response.success && onPostUpdated) {
        onPostUpdated(response.post);
        setCommentText('');
        setShowComments(true);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // TODO: Implement actual save functionality with backend API
    console.log(isSaved ? 'Post unsaved' : 'Post saved');
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await postService.deletePost(post._id);
        if (response.success && onPostDeleted) {
          onPostDeleted(post._id);
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post. Please try again.');
      }
    }
  };

  const handleArchive = () => {
    // TODO: Implement archive functionality
    console.log('Archiving post:', post._id);
  };

  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log('Editing post:', post._id);
  };

  const formatDate = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now - postDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return postDate.toLocaleDateString();
  };

  return (
    <Card className="post-card mb-4" style={{ borderRadius: '15px', border: '1px solid #dbdbdb', maxWidth: '600px', margin: '0 auto 1rem auto' }}>
      {/* Header */}
      <div className="d-flex align-items-center p-3 border-bottom" style={{ borderColor: '#dbdbdb !important' }}>
        <div 
          className="rounded-circle d-flex align-items-center justify-content-center me-3"
          style={{ 
            width: '40px', 
            height: '40px', 
            background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
            color: 'white',
            fontWeight: 'bold'
          }}
        >
          {post.userId?.username?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="flex-grow-1">
          <h6 className="mb-0" style={{ fontWeight: '600', fontSize: '14px' }}>
            {post.userId?.username || 'Unknown User'}
          </h6>
          <small className="text-muted">{formatDate(post.createdAt)}</small>
        </div>
        <Dropdown align="end">
          <Dropdown.Toggle 
            variant="link" 
            className="p-0 text-muted border-0 bg-transparent"
            style={{ boxShadow: 'none' }}
          >
            <i className="bi bi-three-dots"></i>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {isOwner && (
              <>
                <Dropdown.Item onClick={handleEdit}>
                  <i className="bi bi-pencil me-2"></i>Edit
                </Dropdown.Item>
                <Dropdown.Item onClick={handleDelete} className="text-danger">
                  <i className="bi bi-trash me-2"></i>Delete
                </Dropdown.Item>
                <Dropdown.Item onClick={handleArchive}>
                  <i className="bi bi-archive me-2"></i>Archive
                </Dropdown.Item>
                <Dropdown.Divider />
              </>
            )}
            <Dropdown.Item>
              <i className="bi bi-flag me-2"></i>Report
            </Dropdown.Item>
            <Dropdown.Item>
              <i className="bi bi-link-45deg me-2"></i>Copy Link
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Image */}
      {post.image && (
        <div style={{ position: 'relative', paddingBottom: '100%', overflow: 'hidden' }}>
          <img 
            src={post.image} 
            alt="Post" 
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      )}

      {/* Actions */}
      <div className="p-3 pb-1">
        <div className="d-flex align-items-center mb-2">
          <button 
            className="btn btn-link p-0 me-3 text-decoration-none"
            onClick={handleLike}
            style={{ color: isLiked ? '#ed4956' : '#262626' }}
          >
            <i className={`bi bi-heart${isLiked ? '-fill' : ''}`} style={{ fontSize: '24px' }}></i>
          </button>
          <button 
            className="btn btn-link p-0 me-3 text-decoration-none text-dark"
            onClick={() => setShowComments(!showComments)}
          >
            <i className="bi bi-chat" style={{ fontSize: '24px' }}></i>
          </button>
          <button className="btn btn-link p-0 me-3 text-decoration-none text-dark">
            <i className="bi bi-send" style={{ fontSize: '24px' }}></i>
          </button>
          <div className="ms-auto">
            <button 
              className="btn btn-link p-0 text-decoration-none"
              onClick={handleSave}
              style={{ color: isSaved ? '#262626' : '#262626' }}
            >
              <i className={`bi bi-bookmark${isSaved ? '-fill' : ''}`} style={{ fontSize: '24px' }}></i>
            </button>
          </div>
        </div>
        
        {/* Likes count */}
        {post.likes.length > 0 && (
          <div className="mb-1">
            <strong style={{ fontSize: '14px' }}>{post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}</strong>
          </div>
        )}

        {/* Content */}
        {post.content && (
          <div className="mb-2" style={{ fontSize: '14px' }}>
            <strong className="me-2">{post.userId?.username}</strong>
            {post.content}
          </div>
        )}

        {/* Comments preview */}
        {post.comments.length > 0 && !showComments && (
          <button 
            className="btn btn-link p-0 text-muted text-decoration-none mb-2"
            onClick={() => setShowComments(true)}
            style={{ fontSize: '14px' }}
          >
            View all {post.comments.length} comments
          </button>
        )}
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="px-3 pb-2">
          <div className="border-top pt-2" style={{ borderColor: '#dbdbdb !important' }}>
            {post.comments.map((comment) => (
              <div key={comment._id} className="mb-2" style={{ fontSize: '14px' }}>
                <strong className="me-2">{comment.username}</strong>
                <span>{comment.text}</span>
                <div className="text-muted" style={{ fontSize: '12px' }}>
                  {formatDate(comment.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add comment */}
      <div className="p-3 pt-2 border-top" style={{ borderColor: '#dbdbdb !important' }}>
        <Form onSubmit={handleComment}>
          <div className="d-flex align-items-center">
            <i className="bi bi-emoji-smile me-3 text-muted" style={{ fontSize: '24px', cursor: 'pointer' }}></i>
            <Form.Control
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="border-0 flex-grow-1"
              style={{ 
                fontSize: '14px',
                boxShadow: 'none',
                backgroundColor: 'transparent'
              }}
            />
            {commentText.trim() && (
              <Button 
                variant="link" 
                type="submit" 
                className="p-0 text-decoration-none"
                style={{ color: '#0095f6', fontWeight: '600', fontSize: '14px' }}
              >
                Post
              </Button>
            )}
          </div>
        </Form>
      </div>
    </Card>
  );
};

export default PostCard;
