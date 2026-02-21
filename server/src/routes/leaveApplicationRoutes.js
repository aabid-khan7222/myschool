const express = require('express');
const { getLeaveApplications, getMyLeaveApplications, getParentChildrenLeaves, getGuardianWardLeaves } = require('../controllers/leaveApplicationController');

const router = express.Router();

// GET /api/leave-applications/me - current student's leaves (for Student Dashboard)
router.get('/me', getMyLeaveApplications);
// GET /api/leave-applications/parent-children - parent's children leaves (for Parent Dashboard)
router.get('/parent-children', getParentChildrenLeaves);
// GET /api/leave-applications/guardian-wards - guardian's ward leaves (for Guardian Dashboard)
router.get('/guardian-wards', getGuardianWardLeaves);
// GET /api/leave-applications
router.get('/', getLeaveApplications);

module.exports = router;
