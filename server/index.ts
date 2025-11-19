// Load environment variables FIRST (before any imports that need them)
try {
  require('dotenv/config');
} catch (error) {
  console.log('Note: dotenv not loaded (might already be configured via tsx)');
}

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import authRouter from './routes/auth';
import spotsRouter from './routes/spots';
import inventoryRouter from './routes/inventory';
import ordersRouter from './routes/orders';
import stripeRouter, { stripeWebhookHandler } from './routes/stripe';

const app = express();

app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), stripeWebhookHandler);

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple request logger
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Supabase-backed API routes
app.use('/api', authRouter);
app.use('/api', spotsRouter);
app.use('/api', inventoryRouter);
app.use('/api', ordersRouter);
app.use('/api', stripeRouter);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Something went wrong' });
});

// In production, serve static files from dist
if (process.env.NODE_ENV === 'production') {
  const publicPath = path.resolve('dist/public');
  app.use(express.static(publicPath));
  
  // Handle SPA routing - return index.html for all other routes
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

// Start the server
const serverPort = parseInt(process.env.PORT || '5000', 10);
app.listen(serverPort, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${serverPort}`);
  console.log('Supabase-backed API available at:');
  console.log(`- http://0.0.0.0:${serverPort}/api/inventory`);
  console.log(`- http://0.0.0.0:${serverPort}/api/orders/:userId`);
  console.log(`- http://0.0.0.0:${serverPort}/api/payments/create-checkout-session`);
  console.log(`\nTo test the API, run:`);
  console.log(`curl http://0.0.0.0:${serverPort}/api/inventory`);
});
