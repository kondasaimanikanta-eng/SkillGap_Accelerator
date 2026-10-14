const express = require('express');
const router = express.Router();
const {
  getQuestions,
  submitAssessment,
  getAssessmentHistory,
  getAttemptById,
  getComparison,
} = require('../controllers/assessmentController');
const { protect } = require('../middleware/auth');

router.get('/questions/:role', protect, getQuestions);
router.post('/submit', protect, submitAssessment);
router.get('/history', protect, getAssessmentHistory);
router.get('/comparison', protect, getComparison);
router.get('/attempt/:id', protect, getAttemptById);

module.exports = router;
