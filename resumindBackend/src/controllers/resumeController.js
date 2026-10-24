const Resume = require('../models/Resume');
const { resumeCreateSchema, resumeUpdateSchema } = require('../validators/resumeValidators');
const { connectDB } = require('../config/db');

async function createResume(req, res, next) {
  try {
    const validated = resumeCreateSchema.parse(req.body);
    await connectDB();

    const resume = await Resume.create({
      ...validated,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Resume created successfully',
      data: { resume }
    });
  } catch (error) {
    next(error);
  }
}

async function listResumes(req, res, next) {
  try {
    await connectDB();
    const resumes = await Resume.find({ userId: req.user.id })
      .select('title targetRole selectedTemplate updatedAt createdAt')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: { resumes }
    });
  } catch (error) {
    next(error);
  }
}

async function getResumeById(req, res, next) {
  try {
    await connectDB();
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found or access unauthorized.'
      });
    }

    res.status(200).json({
      success: true,
      data: { resume }
    });
  } catch (error) {
    next(error);
  }
}

async function updateResume(req, res, next) {
  try {
    const validated = resumeUpdateSchema.parse(req.body);
    await connectDB();

    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: validated },
      { new: true, runValidators: true }
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found or access unauthorized.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resume updated successfully',
      data: { resume }
    });
  } catch (error) {
    next(error);
  }
}

async function deleteResume(req, res, next) {
  try {
    await connectDB();
    const result = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found or access unauthorized.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createResume,
  listResumes,
  getResumeById,
  updateResume,
  deleteResume
};
