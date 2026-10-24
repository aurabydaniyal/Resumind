const { z } = require('zod');
const { config } = require('../config/env');

const analyzeResumeSchema = z.object({
  resumeText: z
    .string()
    .trim()
    .min(30, 'Extracted resume text must contain at least 30 characters')
    .max(config.MAX_RESUME_TEXT_CHARS, `Resume text cannot exceed ${config.MAX_RESUME_TEXT_CHARS} characters`),
  targetRole: z.string().trim().max(100).optional().default(''),
  jobDescription: z
    .string()
    .trim()
    .max(config.MAX_JOB_DESCRIPTION_CHARS, `Job description cannot exceed ${config.MAX_JOB_DESCRIPTION_CHARS} characters`)
    .optional()
    .default(''),
  resumeTitle: z.string().trim().max(120).optional().default('Uploaded Resume Analysis'),
  resumeId: z.string().optional()
});

const improveResumeSchema = z.object({
  resumeData: z.record(z.any()),
  targetJobDescription: z
    .string()
    .trim()
    .max(config.MAX_JOB_DESCRIPTION_CHARS)
    .optional()
    .default(''),
  targetRole: z.string().trim().max(100).optional().default(''),
  focusSection: z.enum(['all', 'summary', 'experience', 'skills']).optional().default('all')
});

module.exports = {
  analyzeResumeSchema,
  improveResumeSchema
};
