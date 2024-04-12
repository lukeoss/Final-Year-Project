// ProtectedRoutes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Home from './pages/Home';
import Game from './pages/Game';
import NewGame from './pages/NewGame';
import StageGame from './pages/StageGame';
import Teams from './pages/Teams';
import Login from './pages/Login';
import Account from './pages/Account';
import CreateAccount from './pages/CreateAccount';
import LoadingComp from './components/LoadingComp/LoadingComponent.js';
import PlayerProfile from './components/PlayerProfile/PlayerProfile.js';
import GameProfile from './components/GameProfile/GameProfile.js';
import PastGames from './pages/PastGames.js';

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }

    return children;
};

const ProtectedRoutes = () => {
    const { isLoggedIn, isLoading } = useAuth();

    if (isLoading) {
      return <LoadingComp />;
    }

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game" element={<ProtectedRoute><Game /></ProtectedRoute>} />
            <Route path="/newgame" element={<ProtectedRoute><NewGame /></ProtectedRoute>} />
            <Route path="/pastgames" element={<ProtectedRoute><PastGames/></ProtectedRoute>} />
            <Route path="/stagegames" element={<ProtectedRoute><StageGame /></ProtectedRoute>} />
            <Route path="/teams" element={<ProtectedRoute><Teams /></ProtectedRoute>} />
            <Route path="/playerprofile/:playerId" element={<ProtectedRoute><PlayerProfile/></ProtectedRoute>} />
            <Route path="/gameprofile/:gameId" element={<ProtectedRoute><GameProfile/></ProtectedRoute>} />
            <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />
            {/* Placeholder for implementing protected routes or conditional rendering based on auth status */}
            <Route path="*" element={<Home />} /> {/* Handles unknown paths */}
        </Routes>
    );
};

export default ProtectedRoutes;
