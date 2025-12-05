import Cookies from 'js-cookie';
import { SystemUser } from '../apis/auth';
import apiClient from '../libs/axios';

// JWT token validation utility
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch {
    return true; // If we can't parse, consider it expired
  }
};

// Cookie configuration
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// Cookie options
const cookieOptions = {
  expires: 1 / 24, // 1 hour (1 day / 24 hours)
  secure: window.location.protocol === 'https:', // Only use secure in HTTPS
  sameSite: 'strict' as const,
  path: '/',
};

// Token management with cookies
export const getToken = (): string | null => {
  const token = Cookies.get(TOKEN_KEY);

  if (token && isTokenExpired(token)) {
    // Token is expired, remove cookies automatically
    removeToken();
    return null;
  }

  return token || null;
};

export const setToken = (token: string): void => {
  Cookies.set(TOKEN_KEY, token, cookieOptions);
  // Set axios default header
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const removeToken = (): void => {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(USER_KEY);
  // Remove axios default header
  delete apiClient.defaults.headers.common['Authorization'];
};

export const getStoredUser = (): SystemUser | null => {
  const user = Cookies.get(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setStoredUser = (user: SystemUser): void => {
  Cookies.set(USER_KEY, JSON.stringify(user), cookieOptions);
};

// Validate token and cleanup if expired
export const validateAndCleanupToken = (): boolean => {
  const token = Cookies.get(TOKEN_KEY);

  if (!token) return false;

  if (isTokenExpired(token)) {
    removeToken();
    return false;
  }

  return true;
};

// Initialize axios with token if available on app load
export const initializeAuth = (): void => {
  const token = getToken();
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};
