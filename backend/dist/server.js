"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("@/config/database");
const userRoutes_1 = __importDefault(require("@/routes/userRoutes"));
const productRoutes_1 = __importDefault(require("@/routes/productRoutes"));
const response_1 = require("@/types/response");
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || '5000', 10);
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});
app.use('/api/users', userRoutes_1.default);
app.use('/api/products', productRoutes_1.default);
app.use((req, res) => {
    res.status(404).json((0, response_1.createErrorResponse)(`Route ${req.method} ${req.originalUrl} not found`, undefined, {
        availableRoutes: [
            'GET /health',
            'GET /api/users',
            'POST /api/users',
            'PUT /api/users/:id',
            'DELETE /api/users/:id',
            'GET /api/products',
            'POST /api/products',
            'PUT /api/products/:id',
            'DELETE /api/products/:id'
        ]
    }));
});
app.use((err, req, res, next) => {
    console.error(`Error: ${err.message}`);
    console.error(err.stack);
    res.status(500).json((0, response_1.createErrorResponse)('Internal Server Error', undefined, { error: err.message }));
});
async function startServer() {
    try {
        await (0, database_1.connectDatabase)();
        console.log('✅ Database connected successfully');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📊 Health check: http://localhost:${PORT}/health`);
            console.log(`👥 Users API: http://localhost:${PORT}/api/users`);
            console.log(`🛍️ Products API: http://localhost:${PORT}/api/products`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    process.exit(0);
});
startServer();
exports.default = app;
//# sourceMappingURL=server.js.map