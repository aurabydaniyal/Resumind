const dotenv = require('dotenv');
const path = require('path');

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  API_PREFIX: process.env.API_PREFIX || '/api/v1',
  MONGODB_URI: process.env.MONGODB_URI || '',
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || 'resumind_ai',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_resumind_ai_2026_fallback',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  AI_PROVIDER: process.env.AI_PROVIDER || 'groq',
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  GROQ_MODEL: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  FRONTEND_ORIGINS: process.env.FRONTEND_ORIGINS
    ? process.env.FRONTEND_ORIGINS.split(',').map(o => o.trim())
    : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  AI_RATE_LIMIT_WINDOW_MS: parseInt(process.env.AI_RATE_LIMIT_WINDOW_MS || '60000', 10),
  AI_RATE_LIMIT_MAX: parseInt(process.env.AI_RATE_LIMIT_MAX || '10', 10),
  MAX_RESUME_TEXT_CHARS: parseInt(process.env.MAX_RESUME_TEXT_CHARS || '40000', 10),
  MAX_JOB_DESCRIPTION_CHARS: parseInt(process.env.MAX_JOB_DESCRIPTION_CHARS || '20000', 10)
};

// Validate startup safety without printing secret values
function validateStartupEnv() {
  const warnings = [];
  if (!config.MONGODB_URI) {
    warnings.push('MONGODB_URI is not set. Database operations will fail until configured in .env or Vercel.');
  }
  if (!config.GROQ_API_KEY) {
    warnings.push('GROQ_API_KEY is not set. Real AI analysis will return 503 until an API key is provided.');
  }
  if (config.NODE_ENV === 'production' && config.JWT_SECRET === 'dev_secret_resumind_ai_2026_fallback') {
    warnings.push('WARNING: Using default JWT_SECRET in production! Please set a strong random secret.');
  }
  return warnings;
}

module.exports = { config, validateStartupEnv };
