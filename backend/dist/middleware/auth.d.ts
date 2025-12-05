import { Request, Response, NextFunction } from 'express';
import { TokenPayload } from '../utils/jwt';
declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}
export declare const authenticateToken: (req: Request, res: Response, next: NextFunction) => void;
export declare const optionalAuth: (req: Request, res: Response, next: NextFunction) => void;
export declare const requireRole: (requiredRole: "seller" | "customer") => (req: Request, res: Response, next: NextFunction) => void;
export declare const requireSeller: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map