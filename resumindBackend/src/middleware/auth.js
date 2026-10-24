const jwt = require('jsonwebtoken');
const { config } = require('../config/env');
const User = require('../models/User');

async function requireAuth(req, res, next) {
  try {
    let token = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. No bearer token provided.'
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, config.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'Session expired. Please log in again.'
        });
      }
      return res.status(401).json({
        success: false,
        error: 'Invalid authentication token.'
      });
    }

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        error: 'Malformed authentication token.'
      });
    }

    // Attach user payload
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    next(error);
  }
}

// Optional auth for endpoints that can benefit from user context if present
function optionalAuth(req, res, next) {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      const token = req.headers.authorization.split(' ')[1];
      try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        if (decoded && decoded.id) {
          req.user = { id: decoded.id };
        }
      } catch (err) {
        // Silently ignore expired/invalid optional token
      }
    }
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { requireAuth, optionalAuth };
