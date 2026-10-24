const Analysis = require('../models/Analysis');
const { connectDB } = require('../config/db');

async function listAnalyses(req, res, next) {
  try {
    await connectDB();
    const analyses = await Analysis.find({ userId: req.user.id })
      .select('resumeTitle targetRole overallScore scoreBreakdown createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { analyses }
    });
  } catch (error) {
    next(error);
  }
}

async function getAnalysisById(req, res, next) {
  try {
    await connectDB();
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Analysis record not found or access unauthorized.'
      });
    }

    res.status(200).json({
      success: true,
      data: { analysis }
    });
  } catch (error) {
    next(error);
  }
}

async function deleteAnalysis(req, res, next) {
  try {
    await connectDB();
    const result = await Analysis.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Analysis record not found or access unauthorized.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Analysis record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listAnalyses,
  getAnalysisById,
  deleteAnalysis
};
