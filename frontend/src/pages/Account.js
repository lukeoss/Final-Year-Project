// Account.js
import React from 'react';
import { useState, useEffect } from 'react';
import { Route, Outlet, useNavigate } from 'react-router-dom';


const Account = () => {

  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
        try {
            const response = await fetch('/api/user-info', {
                credentials: 'include', // Ensure cookies are included with the request
            });
            if (!response.ok) throw new Error('Not authenticated');
            const data = await response.json();
            setUserInfo(data);
        } catch (error) {
            console.error('Error fetching user info:', error);
            // Handle error (e.g., redirect to login page or show an error message)
        }
    };

    fetchUserInfo();
  }, []);

  if (!userInfo) {
      return <div>Loading...</div>;
  }

  return (
      <div>
          <h1>Account Information</h1>
          <p>Email: {userInfo.email}</p>
          <p>First Name: {userInfo.first_name}</p>
          <p>Last Name: {userInfo.last_name}</p>
          {/* Display other user information as needed */}
      </div>
  );
}

export default Account;