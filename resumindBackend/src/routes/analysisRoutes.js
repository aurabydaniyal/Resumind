const express = require('express');
const {
  listAnalyses,
  getAnalysisById,
  deleteAnalysis
} = require('../controllers/analysisController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/', listAnalyses);
router.get('/:id', getAnalysisById);
router.delete('/:id', deleteAnalysis);

module.exports = router;
