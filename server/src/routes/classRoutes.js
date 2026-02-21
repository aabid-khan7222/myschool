const express = require('express');
const { getAllClasses, getClassById, getClassesByAcademicYear, updateClass } = require('../controllers/classController');

const router = express.Router();

// Get all classes
router.get('/', getAllClasses);

// Get classes by academic year (must be before /:id)
router.get('/academic-year/:academicYearId', getClassesByAcademicYear);

// Get class by ID
router.get('/:id', getClassById);

// Update class
router.put('/:id', updateClass);

module.exports = router;
