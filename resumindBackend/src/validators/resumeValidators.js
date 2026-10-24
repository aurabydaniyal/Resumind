const { z } = require('zod');

const personalInfoSchema = z.object({
  fullName: z.string().trim().max(100).optional().default(''),
  email: z.string().trim().max(100).optional().default(''),
  phone: z.string().trim().max(50).optional().default(''),
  location: z.string().trim().max(100).optional().default(''),
  linkedin: z.string().trim().max(200).optional().default(''),
  website: z.string().trim().max(200).optional().default(''),
  github: z.string().trim().max(200).optional().default('')
}).optional().default({});

const skillGroupSchema = z.object({
  category: z.string().trim().max(60).default('General'),
  items: z.array(z.string().trim().max(60)).default([])
});

const experienceSchema = z.object({
  id: z.string().optional(),
  company: z.string().trim().max(100).default(''),
  role: z.string().trim().max(100).default(''),
  location: z.string().trim().max(100).optional().default(''),
  startDate: z.string().trim().max(50).default(''),
  endDate: z.string().trim().max(50).optional().default(''),
  current: z.boolean().optional().default(false),
  bullets: z.array(z.string().trim().max(1000)).default([])
});

const educationSchema = z.object({
  id: z.string().optional(),
  institution: z.string().trim().max(100).default(''),
  degree: z.string().trim().max(100).default(''),
  fieldOfStudy: z.string().trim().max(100).optional().default(''),
  startDate: z.string().trim().max(50).optional().default(''),
  endDate: z.string().trim().max(50).optional().default(''),
  gpa: z.string().trim().max(20).optional().default(''),
  bullets: z.array(z.string().trim().max(1000)).optional().default([])
});

const projectSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().max(100).default(''),
  description: z.string().trim().max(1000).optional().default(''),
  technologies: z.array(z.string().trim().max(50)).optional().default([]),
  link: z.string().trim().max(250).optional().default(''),
  bullets: z.array(z.string().trim().max(1000)).optional().default([])
});

const certificationSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().max(150).default(''),
  issuer: z.string().trim().max(100).optional().default(''),
  date: z.string().trim().max(50).optional().default(''),
  link: z.string().trim().max(250).optional().default('')
});

const resumeCreateSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(120, 'Title cannot exceed 120 characters').default('My Professional Resume'),
  targetRole: z.string().trim().max(100).optional().default(''),
  selectedTemplate: z.enum(['classic', 'modern', 'minimal']).optional().default('classic'),
  personalInfo: personalInfoSchema,
  summary: z.string().trim().max(4000).optional().default(''),
  skills: z.array(skillGroupSchema).optional().default([]),
  experience: z.array(experienceSchema).optional().default([]),
  education: z.array(educationSchema).optional().default([]),
  projects: z.array(projectSchema).optional().default([]),
  certifications: z.array(certificationSchema).optional().default([]),
  targetJobDescription: z.string().max(20000).optional().default('')
});

const resumeUpdateSchema = resumeCreateSchema.partial();

module.exports = {
  resumeCreateSchema,
  resumeUpdateSchema
};
