import React, { useState, useRef } from 'react';
import { Card, Form, Button, Alert, Image, Row, Col } from 'react-bootstrap';
import { postService } from '../../services/postService';
import { useAuth } from '../../utils/AuthContext';

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB');
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!content.trim() && !imageFile) {
      setError('Please add some content or an image');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('content', content);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await postService.createPost(formData);
      
      if (response.success) {
        setContent('');
        setImageFile(null);
        setImagePreview('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        if (onPostCreated) {
          onPostCreated(response.post);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="create-post-card mb-4" style={{ borderRadius: '15px', border: '1px solid #dbdbdb' }}>
      <Card.Body className="p-4">
        <Row className="align-items-center mb-3">
          <Col xs="auto">
            <div 
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{ 
                width: '40px', 
                height: '40px', 
                background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
          </Col>
          <Col>
            <h6 className="mb-0" style={{ fontWeight: '600' }}>Create a new post</h6>
            <small className="text-muted">Share a moment with your friends</small>
          </Col>
        </Row>

        {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ 
                border: 'none', 
                borderBottom: '1px solid #dbdbdb',
                borderRadius: '0',
                fontSize: '16px',
                resize: 'none'
              }}
            />
          </Form.Group>

          {imagePreview && (
            <div className="mb-3 position-relative">
              <Image 
                src={imagePreview} 
                alt="Preview" 
                className="w-100" 
                style={{ borderRadius: '8px', maxHeight: '300px', objectFit: 'cover' }}
              />
              <Button 
                variant="light" 
                size="sm" 
                className="position-absolute top-0 end-0 m-2"
                onClick={handleRemoveImage}
                style={{ borderRadius: '50%', width: '30px', height: '30px', padding: '0' }}
              >
                ×
              </Button>
            </div>
          )}

          <Row className="align-items-center">
            <Col>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={() => fileInputRef.current?.click()}
                className="me-2"
                style={{ borderRadius: '20px' }}
              >
                <i className="bi bi-image me-1"></i>
                {imageFile ? 'Change Photo' : 'Add Photo'}
              </Button>
            </Col>
            <Col xs="auto">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={loading}
                style={{ 
                  borderRadius: '20px',
                  background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                  border: 'none',
                  fontWeight: '600'
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Posting...
                  </>
                ) : (
                  'Share'
                )}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CreatePost;
