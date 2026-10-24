const { connectDB, getDatabaseStatus } = require('../config/db');
const { config } = require('../config/env');
const aiProvider = require('../services/aiProvider');

async function getHealth(req, res) {
  let dbError = null;

  if (config.MONGODB_URI) {
    try {
      await connectDB();
    } catch (err) {
      dbError = err.message;
    }
  }

  const dbStatus = getDatabaseStatus();

  res.status(200).json({
    status: 'ok',
    service: 'Resumind AI Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
    database: dbStatus,
    ...(dbError && { databaseError: dbError }),
    aiProvider: {
      status: aiProvider.isConfigured() ? 'active' : 'unconfigured',
      configured: aiProvider.isConfigured()
    }
  });
}

module.exports = { getHealth };

