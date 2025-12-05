import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuthContext();
  const location = useLocation();

  // Add debugging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('🛡️ ProtectedRoute Check:', {
      isAuthenticated,
      user: user ? `${user.firstName} ${user.lastName}` : 'None',
      currentPath: location.pathname,
    });
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
