const express = require('express');
const {
  getDashboardStats,
  getUpcomingEvents,
  getClassRoutineForDashboard,
  getBestPerformers,
  getStarStudents,
  getPerformanceSummary,
  getTopSubjects,
  getRecentActivity,
  getNoticeBoardForDashboard,
} = require('../controllers/dashboardController');

const router = express.Router();

// GET /api/dashboard/stats
router.get('/stats', getDashboardStats);
router.get('/upcoming-events', getUpcomingEvents);
router.get('/class-routine', getClassRoutineForDashboard);
router.get('/best-performers', getBestPerformers);
router.get('/star-students', getStarStudents);
router.get('/performance-summary', getPerformanceSummary);
router.get('/top-subjects', getTopSubjects);
router.get('/recent-activity', getRecentActivity);
router.get('/notice-board', getNoticeBoardForDashboard);

module.exports = router;
