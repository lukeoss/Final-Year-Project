// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const apiBaseURL = process.env.REACT_APP_API_BASE_URL;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const response = await fetch(`${apiBaseURL}token/refresh/`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          console.log("Session is not valid or has expired");
        }
      } catch (error) {
        console.error('Error refreshing access token:', error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    refreshAccessToken();
  }, []);

  const logout = async () => {
    try {
      const response = await fetch(`${apiBaseURL}logout/`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        document.cookie = 'access=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        setIsLoggedIn(false);
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const setUserLoggedIn = () => setIsLoggedIn(true);
  
  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, logout, setUserLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
