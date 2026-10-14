const express = require('express');
const router = express.Router();
const {
  generatePlan,
  getCurrentPlan,
  toggleTaskCompletion,
  rescheduleTasks,
} = require('../controllers/planController');
const { protect } = require('../middleware/auth');

router.post('/generate', protect, generatePlan);
router.get('/current', protect, getCurrentPlan);
router.patch('/task/:taskId', protect, toggleTaskCompletion);
router.patch('/task/:taskId/toggle', protect, toggleTaskCompletion);
router.post('/reschedule', protect, rescheduleTasks);

module.exports = router;
