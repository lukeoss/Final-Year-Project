import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import Home from './pages/Home';
import Game from './pages/Game';
import Teams from './pages/Teams';
import Login from './pages/Login';
import Account from './pages/Account';
import CreateAccount from './pages/CreateAccount';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
// import ProtectedAccountRoute from './Pages/Account';

function App() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Container fluid className="p-0">
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand as={Link} to="/">Hurling Stat</Navbar.Brand>
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/game">Game</Nav.Link>
              <Nav.Link as={Link} to="/teams">Teams</Nav.Link>
              <Nav.Link as={Link} to="/account">My Account</Nav.Link>
            </Nav>
          </Container>
        </Navbar>

        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/login" element={<Login />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/account" element={<Account />} />
          {/* Redirect any unknown paths to Home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
