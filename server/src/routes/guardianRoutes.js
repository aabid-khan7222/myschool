const express = require('express');
const { getAllGuardians, getCurrentGuardian, getGuardianById, getGuardianByStudentId } = require('../controllers/guardianController');

const router = express.Router();

// Get all guardians
router.get('/', getAllGuardians);

// Get current logged-in guardian (must be before /:id)
router.get('/me', getCurrentGuardian);

// Get guardian by ID
router.get('/:id', getGuardianById);

// Get guardian by student ID
router.get('/student/:studentId', getGuardianByStudentId);

module.exports = router;
