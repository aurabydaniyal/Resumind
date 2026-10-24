const rateLimit = require('express-rate-limit');
const { config } = require('../config/env');

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests from this IP. Please try again later.'
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts. Please wait 15 minutes before trying again.'
  }
});

const aiLimiter = rateLimit({
  windowMs: config.AI_RATE_LIMIT_WINDOW_MS || 60 * 1000,
  max: config.AI_RATE_LIMIT_MAX || 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'AI request limit reached. Please wait a minute before requesting another analysis or improvement.'
  }
});

module.exports = {
  generalLimiter,
  authLimiter,
  aiLimiter
};
