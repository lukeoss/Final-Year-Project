// ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const ProtectedRoute = ({ children }) => {
    const { isLoggedIn } = useAuth();
  
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
  
    return children;
};