import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { useAuth } from '../../utils/AuthContext';

const Navigation = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar variant="dark" expand="lg" className="navbar">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <i className="bi bi-chat-dots-fill me-2"></i>
          Social Post
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/feed" className="text-white">
                  <i className="bi bi-house-fill me-1"></i>
                  Feed
                </Nav.Link>
                <span className="text-white me-3">
                  <i className="bi bi-person-circle me-1"></i>
                  {user?.username}
                </span>
                <Button 
                  variant="outline-light" 
                  size="sm" 
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-1"></i>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="text-white">
                  Login
                </Nav.Link>
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="outline-light" 
                  size="sm"
                >
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
