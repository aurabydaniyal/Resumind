const mongoose = require('mongoose');

const scoreCategorySchema = new mongoose.Schema(
  {
    score: { type: Number, required: true, min: 0 },
    max: { type: Number, required: true },
    explanation: { type: String, required: true }
  },
  { _id: false }
);

const strengthSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    evidence: { type: String, required: true }
  },
  { _id: false }
);

const issueSchema = new mongoose.Schema(
  {
    severity: {
      type: String,
      enum: ['critical', 'warning', 'tip'],
      default: 'warning'
    },
    section: { type: String, default: 'General' },
    issue: { type: String, required: true },
    recommendation: { type: String, required: true }
  },
  { _id: false }
);

const keywordGapSchema = new mongoose.Schema(
  {
    keyword: { type: String, required: true },
    context: { type: String, default: '' },
    recommendation: { type: String, required: true }
  },
  { _id: false }
);

const rewriteSuggestionSchema = new mongoose.Schema(
  {
    original: { type: String, required: true },
    suggested: { type: String, required: true },
    reason: { type: String, required: true },
    section: { type: String, default: 'Experience' }
  },
  { _id: false }
);

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: false
    },
    resumeTitle: {
      type: String,
      default: 'Uploaded Resume Analysis'
    },
    targetRole: {
      type: String,
      default: ''
    },
    jobDescription: {
      type: String,
      default: ''
    },
    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    scoreBreakdown: {
      contentRelevance: { type: scoreCategorySchema, required: true },
      impactClarity: { type: scoreCategorySchema, required: true },
      skillsAlignment: { type: scoreCategorySchema, required: true },
      structureReadability: { type: scoreCategorySchema, required: true },
      completenessConsistency: { type: scoreCategorySchema, required: true },
      languageGrammar: { type: scoreCategorySchema, required: true }
    },
    strengths: [strengthSchema],
    issues: [issueSchema],
    keywordGaps: [keywordGapSchema],
    rewriteSuggestions: [rewriteSuggestionSchema],
    disclaimer: {
      type: String,
      default: 'This score is an automated estimation based on standard ATS best practices and resume structure guidelines. It is not a guarantee of employment or ATS pass-through.'
    }
  },
  {
    timestamps: true
  }
);

analysisSchema.index({ userId: 1, createdAt: -1 });

const Analysis = mongoose.model('Analysis', analysisSchema);
module.exports = Analysis;
