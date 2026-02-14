const express = require('express');
const { 
  getAllStudents, 
  getStudentById, 
  getStudentsByClass, 
  createStudent,
  updateStudent
} = require('../controllers/studentController');
const { validate } = require('../utils/validate');
const { createStudentSchema, updateStudentSchema } = require('../validations/studentValidation');

const router = express.Router();

// Debug middleware - only in development
if (process.env.NODE_ENV === 'development') {
  router.use((req, res, next) => {
    console.log(`[DEBUG] ${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
  });
}

// Get all students
router.get('/', getAllStudents);

// Get students by class (specific route before parameterized route)
router.get('/class/:classId', getStudentsByClass);

// Get student by ID (parameterized route)
router.get('/:id', getStudentById);

// Create new student
router.post('/', validate(createStudentSchema), createStudent);

// Update student
router.put('/:id', validate(updateStudentSchema), updateStudent);

module.exports = router;
