const express = require('express');
const { getAllTeachers, getCurrentTeacher, getTeacherById, getTeachersByClass, getTeacherRoutine, updateTeacher } = require('../controllers/teacherController');

const router = express.Router();

// Get all teachers
router.get('/', getAllTeachers);

// Get current logged-in teacher (must be before /:id route)
router.get('/me', getCurrentTeacher);

// Get teachers by class (must be before /:id route)
router.get('/class/:classId', getTeachersByClass);

// Get teacher routine (must be before /:id route)
router.get('/:id/routine', getTeacherRoutine);

// Update teacher (must be before /:id route)
router.put('/:id', updateTeacher);

// Get teacher by ID
router.get('/:id', getTeacherById);

module.exports = router;
