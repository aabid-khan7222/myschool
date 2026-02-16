const express = require('express');
const { getAllSections, getSectionById, getSectionsByClass, updateSection } = require('../controllers/sectionController');

const router = express.Router();

// Get all sections
router.get('/', getAllSections);

// Get sections by class (must be before /:id)
router.get('/class/:classId', getSectionsByClass);

// Update section
router.put('/:id', updateSection);

// Get section by ID (must be after /class/:classId)
router.get('/:id', getSectionById);

module.exports = router;
