import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { testConnection } from '../src/config/database';
import authRoutes from '../src/routes/authRoutes';
import transactionRoutes from '../src/routes/transactionRoutes';
import userRoutes from '../src/routes/userRoutes';

dotenv.config();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database
testConnection().catch(console.error);

// Static files - serve from public directory
app.use(express.static(path.join(__dirname, '../public')));
app.use('/css', express.static(path.join(__dirname, '../public/css')));
app.use('/js', express.static(path.join(__dirname, '../public/js')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve index.html for all non-API routes (SPA support)
app.get('*', (req: Request, res: Response) => {
  // Don't serve index.html for API routes or static assets
  if (req.path.startsWith('/api') || req.path.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg)$/)) {
    res.status(404).send('Not found');
    return;
  }
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

export default app;
