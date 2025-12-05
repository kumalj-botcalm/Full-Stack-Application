"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSeller = exports.requireRole = exports.optionalAuth = exports.authenticateToken = void 0;
const jwt_1 = require("../utils/jwt");
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = (0, jwt_1.extractToken)(authHeader);
    if (!token) {
        res.status(401).json({
            success: false,
            message: 'Access token is required'
        });
        return;
    }
    const payload = (0, jwt_1.verifyToken)(token);
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
exports.authenticateToken = authenticateToken;
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = (0, jwt_1.extractToken)(authHeader);
    if (token) {
        const payload = (0, jwt_1.verifyToken)(token);
        if (payload) {
            req.user = payload;
        }
    }
    next();
};
exports.optionalAuth = optionalAuth;
const requireRole = (requiredRole) => {
    return (req, res, next) => {
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
exports.requireRole = requireRole;
exports.requireSeller = (0, exports.requireRole)('seller');
//# sourceMappingURL=auth.js.map