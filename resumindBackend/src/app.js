const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { config, validateStartupEnv } = require('./config/env');
const { connectDB } = require('./config/db');
const { generalLimiter } = require('./middleware/rateLimiters');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Route modules
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const aiRoutes = require('./routes/aiRoutes');
const analysisRoutes = require('./routes/analysisRoutes');

const app = express();

// Security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);

    const allowed = config.FRONTEND_ORIGINS;
    if (allowed.includes('*') || allowed.includes(origin)) {
      return callback(null, true);
    }

    // In development, also permit local network origins
    if (config.NODE_ENV === 'development' && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
      return callback(null, true);
    }

    return callback(new Error(`CORS policy does not allow access from origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

// General rate limiter
app.use(generalLimiter);

// Body parsers with safe size limits
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Mount API routes under prefix
const apiRouter = express.Router();
apiRouter.use('/', healthRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/resumes', resumeRoutes);
apiRouter.use('/ai', aiRoutes);
apiRouter.use('/analyses', analysisRoutes);

app.use(config.API_PREFIX, apiRouter);

// Root fallback for quick ping
app.get('/', (req, res) => {
  res.json({
    name: 'Resumind AI API',
    status: 'running',
    docs: `${config.API_PREFIX}/health`
  });
});

// 404 & Centralized Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

// If executed directly (node src/app.js)
if (require.main === module) {
  const startupWarnings = validateStartupEnv();
  startupWarnings.forEach(w => console.warn(`[CONFIG WARNING] ${w}`));

  connectDB().catch(err => {
    console.warn(`[DB NOTICE] MongoDB connection deferred: ${err.message}`);
  });

  const server = app.listen(config.PORT, () => {
    console.log(`===============================================`);
    console.log(` Resumind AI API Server Started`);
    console.log(` Environment : ${config.NODE_ENV}`);
    console.log(` Listening on: http://localhost:${config.PORT}`);
    console.log(` Health check: http://localhost:${config.PORT}${config.API_PREFIX}/health`);
    console.log(`===============================================`);
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => console.log('HTTP server closed'));
  });
}

module.exports = app;
