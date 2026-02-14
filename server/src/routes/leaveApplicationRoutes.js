const express = require('express');
const { getLeaveApplications } = require('../controllers/leaveApplicationController');

const router = express.Router();

// GET /api/leave-applications
router.get('/', getLeaveApplications);

module.exports = router;
