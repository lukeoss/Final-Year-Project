// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { TeamProvider } from './components/TeamContext';
import { AuthProvider, useAuth } from './AuthContext';
import Home from './pages/Home';
import Game from './pages/Game';
import NewGame from './pages/NewGame';
import Teams from './pages/Teams';
import Login from './pages/Login';
import Account from './pages/Account';
import CreateAccount from './pages/CreateAccount';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { ProtectedRoute } from './ProtectedRoute.js';

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
            <Nav.Link as={Link} to="/newgame">New Game</Nav.Link>
            <Nav.Link as={Link} to="/teams">Teams</Nav.Link>
            <Nav.Link as={Link} to="/account">My Account</Nav.Link> :
            {
              isLoggedIn ?
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link> :
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            }
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
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/game" element={<ProtectedRoute><Game /></ProtectedRoute>} />
              <Route path="/newgame" element={<ProtectedRoute><NewGame /></ProtectedRoute>} />
              <Route path="/teams" element={<ProtectedRoute><Teams /></ProtectedRoute>} />
              <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
              <Route path="/create-account" element={<CreateAccount />} />
              <Route path="/login" element={<Login />} />
              {/* Placeholder for implementing protected routes or conditional rendering based on auth status */}
              <Route path="*" element={<Home />} /> {/* Handles unknown paths */}
            </Routes>
          </Container>
        </Router>
      </TeamProvider>
    </AuthProvider>
  );
}

export default App;
