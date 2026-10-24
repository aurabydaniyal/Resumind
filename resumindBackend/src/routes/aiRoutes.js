const express = require('express');
const { analyzeResume, improveResume } = require('../controllers/aiController');
const { optionalAuth, requireAuth } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiters');

const router = express.Router();

// Analyze resume: rate limited, optional auth so guest uploads work and authenticated users get history
router.post('/analyze-resume', aiLimiter, optionalAuth, analyzeResume);

// Improve resume: rate limited, requires authentication as it operates on user resume data
router.post('/improve-resume', aiLimiter, requireAuth, improveResume);

module.exports = router;
