import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { TeamProvider } from './components/TeamContext';
import Home from './pages/Home';
import Game from './pages/Game';
import NewGame from './pages/NewGame';
import Teams from './pages/Teams';
import Login from './pages/Login';
import Account from './pages/Account';
import CreateAccount from './pages/CreateAccount';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

function App() {
  // State for tracking user authentication could be added here
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <TeamProvider>
      <Router>
        <Container fluid className="p-0">
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <Navbar.Brand as={Link} to="/" className="brand-text">GAA Stat</Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="ms-auto">
                  <Nav.Link as={Link} to="/">Home</Nav.Link>
                  <Nav.Link as={Link} to="/newgame">New Game</Nav.Link>
                  <Nav.Link as={Link} to="/teams">Teams</Nav.Link>
                  <Nav.Link as={Link} to="/account">My Account</Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game" element={<Game />} />
            <Route path="/newgame" element={<NewGame />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/login" element={<Login />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/account" element={<Account />} />
            {/* Placeholder for implementing protected routes or conditional rendering based on auth status */}
            <Route path="*" element={<Home />} /> {/* Handles unknown paths */}
          </Routes>
        </Container>
      </Router>
    </TeamProvider>
  );
}

export default App;
