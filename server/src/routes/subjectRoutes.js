const express = require('express');
const { getAllSubjects, getSubjectById, getSubjectsByClass, updateSubject } = require('../controllers/subjectController');

const router = express.Router();

// Get all subjects
router.get('/', getAllSubjects);

// Update subject
router.put('/:id', updateSubject);

// Get subject by ID
router.get('/:id', getSubjectById);

// Get subjects by class
router.get('/class/:classId', getSubjectsByClass);

module.exports = router;
