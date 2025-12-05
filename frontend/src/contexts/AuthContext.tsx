import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { SystemUser } from '../apis/auth';
import {
  getToken,
  setToken,
  removeToken,
  getStoredUser,
  setStoredUser,
  initializeAuth,
  validateAndCleanupToken,
} from '../utils/cookies';

interface AuthContextType {
  user: SystemUser | null;
  isAuthenticated: boolean;
  login: (token: string, user: SystemUser) => void;
  logout: () => void;
  setUserData: (user: SystemUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<SystemUser | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Initialize auth state on mount
  useEffect(() => {
    // Initialize axios headers from cookies
    initializeAuth();

    const token = getToken();
    const storedUser = getStoredUser();

    if (token && storedUser) {
      setUser(storedUser);
    }
    setIsInitialized(true);
  }, []);

  // Periodic token validation - check every 30 seconds
  useEffect(() => {
    if (!isInitialized) return;

    const validateToken = () => {
      const token = getToken();

      if (user && token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          const timeUntilExpiry = payload.exp - currentTime;

          // Show warning 15 seconds before expiry
          if (timeUntilExpiry > 0 && timeUntilExpiry <= 15) {
            toast.warning(`Session expiring in ${timeUntilExpiry} seconds`, {
              id: 'token-expiry-warning',
              duration: 3000,
            });
          }
        } catch {
          // Token parsing failed, will be handled by validateAndCleanupToken
        }
      }

      if (user && !validateAndCleanupToken()) {
        // Token expired, show notification and auto logout
        toast.error('Your session has expired. Please log in again.', {
          duration: 4000,
        });
        setUser(null);
        queryClient.clear();
        navigate('/');
      }
    };

    // Check immediately
    validateToken();

    // Set up interval to check every 10 seconds for more responsive warnings
    const interval = setInterval(validateToken, 10000);

    return () => clearInterval(interval);
  }, [user, isInitialized, navigate, queryClient]);

  const login = (token: string, userData: SystemUser) => {
    setToken(token);
    setStoredUser(userData);
    setUser(userData);
  };

  const logout = () => {
    removeToken();
    setUser(null);
    queryClient.clear();
    toast.success('You have been logged out successfully.');
    navigate('/'); // This is correct since LOGIN route is '/'
  };

  const setUserData = (userData: SystemUser) => {
    setStoredUser(userData);
    setUser(userData);
  };

  const isAuthenticated = !!user && !!getToken();

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    setUserData,
  };

  // Don't render children until auth state is initialized
  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
