import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import planRoutes from './routes/planRoutes.js';
import { seedAdminIfNoneExists } from './services/authService.js';
import { seedInitialPlansIfEmpty } from './services/planService.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const rawClientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
const normalizedClientUrl = rawClientUrl.replace(/\/+$/, '');

const allowedOrigins = new Set([
  normalizedClientUrl,
  `${normalizedClientUrl}/`,
  'https://freshfold-nine.vercel.app',
  'https://freshfold-nine.vercel.app/',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]);

// 1. Core Middlewares
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.has(origin) || allowedOrigins.has(origin.replace(/\/+$/, ''))) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());

// 2. Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'FreshFold Laundry API',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// 3. API Feature Routes
app.use('/api/plans', planRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// 4. 404 Handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.originalUrl} not found`,
  });
});

// 5. Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// 6. Connect to Database, seed default data, and start server
async function startServer() {
  try {
    await connectDB();
    await seedAdminIfNoneExists();
    await seedInitialPlansIfEmpty();
    app.listen(PORT, () => {
      console.log(`🚀 FreshFold Server listening on port ${PORT}`);
      console.log(`📡 Ready for frontend requests at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server due to DB connection error:', error.message);
    process.exit(1);
  }
}

startServer();
