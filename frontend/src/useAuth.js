// useAuth.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);
};


// import { useAuth } from './useAuth';

// const AccountPage = () => {
//   useAuth();

//   return (
//     <div>Protected Account Page</div>
//   );
// };
