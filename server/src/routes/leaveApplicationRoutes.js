const express = require('express');
const { protectApi } = require('../middleware/authMiddleware');
const {
  getLeaveTypes,
  createLeaveApplication,
  updateLeaveApplicationStatus,
  getLeaveApplications,
  getMyLeaveApplications,
  getParentChildrenLeaves,
  getGuardianWardLeaves,
} = require('../controllers/leaveApplicationController');

const router = express.Router();

// GET /api/leave-applications/leave-types - all leave types (public for dropdown)
router.get('/leave-types', getLeaveTypes);

// POST /api/leave-applications - create leave (requires auth)
router.post('/', protectApi, createLeaveApplication);

// PUT /api/leave-applications/:id - update status (approve/reject)
router.put('/:id', protectApi, updateLeaveApplicationStatus);

// GET /api/leave-applications/me - current student's or staff's leaves
router.get('/me', protectApi, getMyLeaveApplications);
// GET /api/leave-applications/parent-children - parent's children leaves (for Parent Dashboard)
router.get('/parent-children', getParentChildrenLeaves);
// GET /api/leave-applications/guardian-wards - guardian's ward leaves (for Guardian Dashboard)
router.get('/guardian-wards', getGuardianWardLeaves);
// GET /api/leave-applications
router.get('/', getLeaveApplications);

module.exports = router;
