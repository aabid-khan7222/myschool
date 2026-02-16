const express = require('express');
const { getAllTeachers, getTeacherById, getTeachersByClass, getTeacherRoutine } = require('../controllers/teacherController');

const router = express.Router();

// Get all teachers
router.get('/', getAllTeachers);

// Get teachers by class (must be before /:id route)
router.get('/class/:classId', getTeachersByClass);

// Get teacher routine (must be before /:id route)
router.get('/:id/routine', getTeacherRoutine);

// Get teacher by ID
router.get('/:id', getTeacherById);

module.exports = router;
