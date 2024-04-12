// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { logout, refreshAccessToken } from './apiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuthStatus = async () => {
      const isAuthenticated = await refreshAccessToken();
      setIsLoggedIn(isAuthenticated);
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      setIsLoggedIn(false);
    } else {
      console.error('Logout failed');
    }
  };

  const setUserLoggedIn = () => setIsLoggedIn(true);
  
  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, logout: handleLogout, setUserLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
