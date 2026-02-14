const express = require('express');
const { getAllParents, getParentById, getParentByStudentId, createParent, updateParent } = require('../controllers/parentController');
const { validate } = require('../utils/validate');
const { createParentSchema, updateParentSchema } = require('../validations/parentValidation');

const router = express.Router();

// Get all parents
router.get('/', getAllParents);

// Create new parent
router.post('/', validate(createParentSchema), createParent);

// Get parent by student ID (must be before /:id)
router.get('/student/:studentId', getParentByStudentId);

// Get parent by ID
router.get('/:id', getParentById);

// Update parent by ID
router.put('/:id', validate(updateParentSchema), updateParent);

module.exports = router;
