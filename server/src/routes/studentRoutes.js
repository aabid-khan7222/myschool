const express = require('express');
const { 
  getAllStudents, 
  getStudentById,
  getCurrentStudent,
  getStudentsByClass, 
  createStudent,
  updateStudent
} = require('../controllers/studentController');
const { validate } = require('../utils/validate');
const { createStudentSchema, updateStudentSchema } = require('../validations/studentValidation');

const router = express.Router();


// Get all students
router.get('/', getAllStudents);

// Get current logged-in student (must be before /:id)
router.get('/me', getCurrentStudent);

// Get students by class (specific route before parameterized route)
router.get('/class/:classId', getStudentsByClass);

// Get student by ID (parameterized route)
router.get('/:id', getStudentById);

// Create new student
router.post('/', validate(createStudentSchema), createStudent);

// Update student
router.put('/:id', validate(updateStudentSchema), updateStudent);

module.exports = router;
