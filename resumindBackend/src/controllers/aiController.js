const aiProvider = require('../services/aiProvider');
const Analysis = require('../models/Analysis');
const { analyzeResumeSchema, improveResumeSchema } = require('../validators/aiValidators');
const { connectDB } = require('../config/db');

async function analyzeResume(req, res, next) {
  try {
    const validated = analyzeResumeSchema.parse(req.body);

    const result = await aiProvider.analyzeResume({
      resumeText: validated.resumeText,
      targetRole: validated.targetRole,
      jobDescription: validated.jobDescription
    });

    let savedAnalysis = null;
    // If user is authenticated, save the analysis for history tracking
    if (req.user && req.user.id) {
      try {
        await connectDB();
        savedAnalysis = await Analysis.create({
          userId: req.user.id,
          resumeId: validated.resumeId || undefined,
          resumeTitle: validated.resumeTitle || 'Uploaded Resume Analysis',
          targetRole: validated.targetRole || '',
          jobDescription: validated.jobDescription || '',
          overallScore: result.overallScore,
          scoreBreakdown: result.scoreBreakdown,
          strengths: result.strengths,
          issues: result.issues,
          keywordGaps: result.keywordGaps,
          rewriteSuggestions: result.rewriteSuggestions,
          disclaimer: result.disclaimer
        });
      } catch (dbErr) {
        console.warn('Could not auto-save analysis record to DB:', dbErr.message);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Resume analyzed successfully',
      data: {
        analysis: result,
        analysisId: savedAnalysis ? savedAnalysis._id : null
      }
    });
  } catch (error) {
    next(error);
  }
}

async function improveResume(req, res, next) {
  try {
    const validated = improveResumeSchema.parse(req.body);

    const result = await aiProvider.improveResume({
      resumeData: validated.resumeData,
      targetJobDescription: validated.targetJobDescription,
      targetRole: validated.targetRole,
      focusSection: validated.focusSection
    });

    res.status(200).json({
      success: true,
      message: 'Resume improvement proposals generated',
      data: {
        improvements: result
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  analyzeResume,
  improveResume
};
