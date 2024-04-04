// AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const response = await fetch('https://localhost:8000/api/token/refresh/', {
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
      }
    };

    refreshAccessToken();
  }, []);

  const logout = async () => {
    try {
      const response = await fetch('https://localhost:8000/api/logout/', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        console.log("Logout Successful");
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
    <AuthContext.Provider value={{ isLoggedIn, logout, setUserLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
