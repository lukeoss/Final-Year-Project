// App.js
import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { useAuth, AuthProvider } from './AuthContext.js';
import { TeamProvider } from './components/TeamContext.js';
import ProtectedRoutes from './ProtectedRoutes';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

const NavBarWithAuth = () => {
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-text">GAA Stat</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/stagegames">Games</Nav.Link>
            <Nav.Link as={Link} to="/teams">Teams</Nav.Link>
            <Nav.Link as={Link} to="/account">Dashboard</Nav.Link>
            {isLoggedIn ? (
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

function App() {
  return (
    <AuthProvider>
      <TeamProvider>
        <Router>
          <Container fluid className="p-0">
            <NavBarWithAuth />
            <ProtectedRoutes /> {/* Use ProtectedRoutes here */}
          </Container>
        </Router>
      </TeamProvider>
    </AuthProvider>
  );
}

export default App;