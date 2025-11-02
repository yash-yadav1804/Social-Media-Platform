import React, { useState, useEffect } from 'react';
import { Container, Alert, Row, Col, Card } from 'react-bootstrap';
import CreatePost from '../components/posts/CreatePost';
import PostList from '../components/posts/PostList';
import UserDiscovery from '../components/friends/UserDiscovery';
import { postService } from '../services/postService';
import { useAuth } from '../utils/AuthContext';

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postService.getPosts();
      if (response.success) {
        setPosts(response.posts);
      }
    } catch (err) {
      setError('Failed to load posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(posts.map(post => 
      post._id === updatedPost._id ? updatedPost : post
    ));
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter(post => post._id !== postId));
  };

  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh' }}>
      <Container className="py-4">
        <Row>
          {/* Main Feed */}
          <Col lg={8} className="mb-4">
            {/* Welcome Header */}
            <Card className="mb-4" style={{ borderRadius: '15px', border: '1px solid #dbdbdb' }}>
              <Card.Body className="p-4 text-center">
                <h3 className="mb-2" style={{ 
                  background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold'
                }}>
                  Welcome back, {user?.username}!
                </h3>
                <p className="text-muted mb-0">Share your moments and connect with friends</p>
              </Card.Body>
            </Card>

            {error && <Alert variant="danger">{error}</Alert>}
            
            <CreatePost onPostCreated={handlePostCreated} />
            
            <PostList 
              posts={posts} 
              loading={loading} 
              onPostUpdated={handlePostUpdated}
              onPostDeleted={handlePostDeleted}
            />
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            <div style={{ position: 'sticky', top: '20px' }}>
              <UserDiscovery />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FeedPage;
