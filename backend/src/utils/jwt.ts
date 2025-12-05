import jwt from 'jsonwebtoken';

// JWT secret key - in production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Token payload interface
export interface TokenPayload {
  userId: number;
  name: string;
  email: string;
  role: 'seller' | 'customer';
}

// Generate JWT token
export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {

    expiresIn: '1h' // Token expires in 1 hour
  });
};

// Verify JWT token
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

// Extract token from Authorization header
export const extractToken = (authHeader: string | undefined): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove "Bearer " prefix
};