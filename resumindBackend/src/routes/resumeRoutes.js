const express = require('express');
const {
  createResume,
  listResumes,
  getResumeById,
  updateResume,
  deleteResume
} = require('../controllers/resumeController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.post('/', createResume);
router.get('/', listResumes);
router.get('/:id', getResumeById);
router.patch('/:id', updateResume);
router.delete('/:id', deleteResume);

module.exports = router;
