import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ('seller' | 'customer')[];
  fallbackPath?: string;
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  allowedRoles,
  fallbackPath = '/unauthorized',
}) => {
  const { user, isAuthenticated } = useAuthContext();

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  // If user role is not in allowed roles, redirect to fallback
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
