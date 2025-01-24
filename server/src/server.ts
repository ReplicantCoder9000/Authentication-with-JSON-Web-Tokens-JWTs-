import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import authRoutes from './routes/auth-routes.js';
import { sequelize } from './models/index.js';
import { seedProduction } from './seeds/production-seed.js';

const app = express();
const PORT = process.env.PORT || 3002;
const isProduction = process.env.NODE_ENV === 'production';

// Configure CORS with specific options
const allowedOrigins = isProduction 
  ? ['https://replicantcoder9000.github.io', 'https://kanban-board.onrender.com']
  : ['http://localhost:5173']; // Vite's default dev server port

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400, // 24 hours in seconds
  optionsSuccessStatus: 204
};

// Enable CORS with options
app.use(cors(corsOptions));

// Add security headers
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Parse JSON bodies
app.use(express.json());

// Add health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Handle unsupported methods
app.use((req, res, next) => {
  res.header('Allow', 'GET, POST, PUT, DELETE');
  next();
});

// Serves static files in the entire client's dist folder
app.use(express.static('../client/dist'));

// Mount API and auth routes
app.use(routes);

// For any other route, serve the static files
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: '../client/dist' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Initialize database and start server
const initializeServer = async () => {
  try {
    await sequelize.sync();
    
    if (isProduction) {
      await seedProduction();
    }
    
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
};

initializeServer();
