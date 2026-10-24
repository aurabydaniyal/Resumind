const { ZodError } = require('zod');
const { config } = require('../config/env');

function errorHandler(err, req, res, next) {
  // Check for Zod validation error
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message
    }));
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: formattedErrors
    });
  }

  // Check for Mongoose validation error
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
    return res.status(400).json({
      success: false,
      error: 'Database validation failed',
      details
    });
  }

  // Duplicate key error (e.g. email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      error: `An account with that ${field} already exists.`
    });
  }

  // CastError (invalid MongoDB ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: `Invalid resource identifier: ${err.value}`
    });
  }

  // Custom HTTP status errors
  const statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);

  // Avoid logging or leaking stack traces in production
  if (config.NODE_ENV !== 'production') {
    console.error('Unhandled error caught by handler:', err);
  } else {
    console.error('Unhandled error:', err.message);
  }

  res.status(statusCode).json({
    success: false,
    error: err.message || 'An unexpected internal server error occurred',
    ...(config.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.method} ${req.originalUrl}`
  });
}

module.exports = { errorHandler, notFoundHandler };
