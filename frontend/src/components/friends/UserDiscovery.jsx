import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Alert, Badge } from 'react-bootstrap';
import { friendService } from '../../services/friendService';

const UserDiscovery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFriendRequests();
    fetchFriends();
  }, []);

  const fetchFriendRequests = async () => {
    try {
      const response = await friendService.getFriendRequests();
      if (response.success) {
        setFriendRequests(response.requests);
      }
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await friendService.getFriends();
      if (response.success) {
        setFriends(response.friends);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await friendService.searchUsers(searchQuery);
      if (response.success) {
        setSearchResults(response.users);
      }
    } catch (error) {
      setError('Error searching users');
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (userId) => {
    try {
      const response = await friendService.sendFriendRequest(userId);
      if (response.success) {
        // Update the search results to show request sent
        setSearchResults(searchResults.map(u => 
          u._id === userId ? { ...u, friendStatus: 'request_sent' } : u
        ));
      }
    } catch (error) {
      setError('Error sending friend request');
    }
  };

  const acceptFriendRequest = async (requestId) => {
    try {
      const response = await friendService.acceptFriendRequest(requestId);
      if (response.success) {
        fetchFriendRequests();
        fetchFriends();
      }
    } catch (error) {
      setError('Error accepting friend request');
    }
  };

  const declineFriendRequest = async (requestId) => {
    try {
      const response = await friendService.declineFriendRequest(requestId);
      if (response.success) {
        fetchFriendRequests();
      }
    } catch (error) {
      setError('Error declining friend request');
    }
  };

  const UserCard = ({ userData, showActions = true }) => (
    <Card className="mb-2" style={{ borderRadius: '10px' }}>
      <Card.Body className="p-3">
        <Row className="align-items-center">
          <Col xs="auto">
            <div 
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{ 
                width: '50px', 
                height: '50px', 
                background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '18px'
              }}
            >
              {userData.username?.[0]?.toUpperCase()}
            </div>
          </Col>
          <Col>
            <h6 className="mb-1" style={{ fontWeight: '600' }}>{userData.username}</h6>
            <small className="text-muted">{userData.email}</small>
          </Col>
          {showActions && (
            <Col xs="auto">
              {userData.friendStatus === 'not_friends' && (
                <Button 
                  size="sm" 
                  variant="primary"
                  onClick={() => sendFriendRequest(userData._id)}
                  style={{ borderRadius: '20px' }}
                >
                  <i className="bi bi-person-plus me-1"></i>
                  Add Friend
                </Button>
              )}
              {userData.friendStatus === 'request_sent' && (
                <Badge bg="secondary" className="px-3 py-2">
                  Request Sent
                </Badge>
              )}
              {userData.friendStatus === 'friends' && (
                <Badge bg="success" className="px-3 py-2">
                  <i className="bi bi-check-circle me-1"></i>
                  Friends
                </Badge>
              )}
            </Col>
          )}
        </Row>
      </Card.Body>
    </Card>
  );

  return (
    <div>
      {/* Friend Requests */}
      {friendRequests.length > 0 && (
        <Card className="mb-4" style={{ borderRadius: '15px' }}>
          <Card.Header className="bg-white border-0 pb-0">
            <h5 className="mb-0">
              <i className="bi bi-people me-2"></i>
              Friend Requests 
              <Badge bg="danger" className="ms-2">{friendRequests.length}</Badge>
            </h5>
          </Card.Header>
          <Card.Body>
            {friendRequests.map((request) => (
              <Card key={request._id} className="mb-2" style={{ borderRadius: '10px' }}>
                <Card.Body className="p-3">
                  <Row className="align-items-center">
                    <Col xs="auto">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{ 
                          width: '50px', 
                          height: '50px', 
                          background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '18px'
                        }}
                      >
                        {request.from.username?.[0]?.toUpperCase()}
                      </div>
                    </Col>
                    <Col>
                      <h6 className="mb-1" style={{ fontWeight: '600' }}>{request.from.username}</h6>
                      <small className="text-muted">wants to be friends</small>
                    </Col>
                    <Col xs="auto">
                      <Button 
                        size="sm" 
                        variant="success" 
                        className="me-2"
                        onClick={() => acceptFriendRequest(request._id)}
                        style={{ borderRadius: '20px' }}
                      >
                        <i className="bi bi-check"></i>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline-secondary"
                        onClick={() => declineFriendRequest(request._id)}
                        style={{ borderRadius: '20px' }}
                      >
                        <i className="bi bi-x"></i>
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </Card.Body>
        </Card>
      )}

      {/* Search Users */}
      <Card className="mb-4" style={{ borderRadius: '15px' }}>
        <Card.Header className="bg-white border-0">
          <h5 className="mb-0">
            <i className="bi bi-search me-2"></i>
            Discover People
          </h5>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSearch} className="mb-3">
            <Row>
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Search for friends by username or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ borderRadius: '20px' }}
                />
              </Col>
              <Col xs="auto">
                <Button 
                  type="submit" 
                  disabled={loading}
                  style={{ 
                    borderRadius: '20px',
                    background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                    border: 'none'
                  }}
                >
                  {loading ? 'Searching...' : 'Search'}
                </Button>
              </Col>
            </Row>
          </Form>

          {searchResults.length > 0 && (
            <div>
              <h6 className="mb-3">Search Results:</h6>
              {searchResults.map((userData) => (
                <UserCard key={userData._id} userData={userData} />
              ))}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Friends List */}
      {friends.length > 0 && (
        <Card style={{ borderRadius: '15px' }}>
          <Card.Header className="bg-white border-0">
            <h5 className="mb-0">
              <i className="bi bi-people-fill me-2"></i>
              Your Friends ({friends.length})
            </h5>
          </Card.Header>
          <Card.Body>
            {friends.map((friend) => (
              <UserCard key={friend._id} userData={friend} showActions={false} />
            ))}
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default UserDiscovery;
