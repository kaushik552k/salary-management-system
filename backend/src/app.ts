import express from 'express';
import cors from 'cors';
import { employeeRouter } from './routes/employees';
import { analyticsRouter } from './routes/analytics';
import { errorMiddleware } from './middleware/error.middleware';

export function createApp() {
  const app = express();

  // Middleware
  app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
  app.use(express.json());

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Routes
  app.use('/api/employees', employeeRouter);
  app.use('/api/analytics', analyticsRouter);

  // 404 handler
  app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

  // Global error handler (must be last)
  app.use(errorMiddleware);

  return app;
}
