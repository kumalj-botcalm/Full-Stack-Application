import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDatabase } from '@/config/database';
import userRoutes from '@/routes/userRoutes';
import productRoutes from '@/routes/productRoutes';
import authRoutes from '@/routes/auth';
import uploadRoutes from '@/routes/uploadRoutes';
import { createErrorResponse } from '@/types/response';

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    // Allow any localhost origin during development
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    
    // Block other origins
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});


// API Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

// 404 handler for undefined routes - must be last
app.use((req: Request, res: Response) => {
  res.status(404).json(
    createErrorResponse(
      `Route ${req.method} ${req.originalUrl} not found`,
      undefined,
      {
        availableRoutes: [
          'GET /api/users',
          'POST /api/users',
          'PUT /api/users/:id',
          'DELETE /api/users/:id',
          'GET /api/products',
          'POST /api/auth/register',
          'POST /api/auth/login',
          'POST /api/auth/check-email'
        ]
      }
    )
  );
});

// Global error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`Error: ${err.message}`);
  console.error(err.stack);
  
  res.status(500).json(
    createErrorResponse(
      'Internal Server Error',
      undefined,
      { error: err.message }
    )
  );
});

// Database connection and server startup
async function startServer(): Promise<void> {
  try {
    // Connect to MongoDB
    await connectDatabase();
    console.log('✅ Database connected successfully');
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();

export default app;