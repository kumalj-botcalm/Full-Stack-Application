import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractToken, TokenPayload } from '../utils/jwt';

// Extend Request interface to include user data
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

// Middleware to verify JWT token
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = extractToken(authHeader);

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Access token is required'
    });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
    return;
  }

  req.user = payload;
  next();
};

// Middleware to verify JWT token but don't fail if missing (optional auth)
export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = extractToken(authHeader);

  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      req.user = payload;
    }
  }

  next();
};

// Role-based access control middleware
export const requireRole = (requiredRole: 'seller' | 'customer') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    if (req.user.role !== requiredRole) {
      res.status(403).json({
        success: false,
        message: `Access denied. ${requiredRole} role required.`
      });
      return;
    }

    next();
  };
};

// Middleware to require seller role (admin access)
export const requireSeller = requireRole('seller');