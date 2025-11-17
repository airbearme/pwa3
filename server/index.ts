import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import mockApi from './mock-api';
const app = express();
const port = process.env.PORT || 3000;

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple request logger
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Mock API routes
app.use('/api', mockApi);

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
  console.log('Mock API available at:');
  console.log(`- http://0.0.0.0:${serverPort}/api/products`);
  console.log(`- http://0.0.0.0:${serverPort}/api/features`);
  console.log(`\nTo test the API, run:`);
  console.log(`curl http://0.0.0.0:${serverPort}/api/products`);
  console.log(`curl http://0.0.0.0:${serverPort}/api/features`);
});
