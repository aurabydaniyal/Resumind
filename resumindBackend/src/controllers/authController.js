const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { config } = require('../config/env');
const { registerSchema, loginSchema } = require('../validators/authValidators');
const { connectDB } = require('../config/db');

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );
}

async function register(req, res, next) {
  try {
    // 1. Validate inputs first (fail fast on bad input)
    const validated = registerSchema.parse(req.body);

    // 2. Connect to database
    await connectDB();

    const existing = await User.findOne({ email: validated.email });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'An account with that email address already exists.'
      });
    }

    const user = await User.create(validated);
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    // 1. Validate inputs first
    const validated = loginSchema.parse(req.body);

    // 2. Connect to database
    await connectDB();

    const user = await User.findOne({ email: validated.email });
    if (!user) {
      // Generic message to avoid email enumeration
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    const isMatch = await user.comparePassword(validated.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    next(error);
  }
}

async function getMe(req, res, next) {
  try {
    await connectDB();
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User account not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: user.toJSON()
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  getMe
};
