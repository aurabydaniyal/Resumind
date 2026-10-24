const mongoose = require('mongoose');

const skillCategorySchema = new mongoose.Schema(
  {
    category: { type: String, trim: true, default: 'General' },
    items: [{ type: String, trim: true }]
  },
  { _id: false }
);

const experienceEntrySchema = new mongoose.Schema(
  {
    id: { type: String },
    company: { type: String, trim: true, default: '' },
    role: { type: String, trim: true, default: '' },
    location: { type: String, trim: true, default: '' },
    startDate: { type: String, trim: true, default: '' },
    endDate: { type: String, trim: true, default: '' },
    current: { type: Boolean, default: false },
    bullets: [{ type: String, trim: true }]
  },
  { _id: false }
);

const educationEntrySchema = new mongoose.Schema(
  {
    id: { type: String },
    institution: { type: String, trim: true, default: '' },
    degree: { type: String, trim: true, default: '' },
    fieldOfStudy: { type: String, trim: true, default: '' },
    startDate: { type: String, trim: true, default: '' },
    endDate: { type: String, trim: true, default: '' },
    gpa: { type: String, trim: true, default: '' },
    bullets: [{ type: String, trim: true }]
  },
  { _id: false }
);

const projectEntrySchema = new mongoose.Schema(
  {
    id: { type: String },
    name: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    technologies: [{ type: String, trim: true }],
    link: { type: String, trim: true, default: '' },
    bullets: [{ type: String, trim: true }]
  },
  { _id: false }
);

const certificationEntrySchema = new mongoose.Schema(
  {
    id: { type: String },
    name: { type: String, trim: true, default: '' },
    issuer: { type: String, trim: true, default: '' },
    date: { type: String, trim: true, default: '' },
    link: { type: String, trim: true, default: '' }
  },
  { _id: false }
);

const personalInfoSchema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    location: { type: String, trim: true, default: '' },
    linkedin: { type: String, trim: true, default: '' },
    website: { type: String, trim: true, default: '' },
    github: { type: String, trim: true, default: '' }
  },
  { _id: false }
);

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Resume title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
      default: 'My Professional Resume'
    },
    targetRole: {
      type: String,
      trim: true,
      maxlength: [100, 'Target role cannot exceed 100 characters'],
      default: ''
    },
    selectedTemplate: {
      type: String,
      enum: ['classic', 'modern', 'minimal'],
      default: 'classic'
    },
    personalInfo: {
      type: personalInfoSchema,
      default: () => ({})
    },
    summary: {
      type: String,
      trim: true,
      maxlength: [4000, 'Summary cannot exceed 4000 characters'],
      default: ''
    },
    skills: {
      type: [skillCategorySchema],
      default: []
    },
    experience: {
      type: [experienceEntrySchema],
      default: []
    },
    education: {
      type: [educationEntrySchema],
      default: []
    },
    projects: {
      type: [projectEntrySchema],
      default: []
    },
    certifications: {
      type: [certificationEntrySchema],
      default: []
    },
    targetJobDescription: {
      type: String,
      maxlength: [20000, 'Job description cannot exceed 20,000 characters'],
      default: ''
    }
  },
  {
    timestamps: true
  }
);

resumeSchema.index({ userId: 1, updatedAt: -1 });

const Resume = mongoose.model('Resume', resumeSchema);
module.exports = Resume;
