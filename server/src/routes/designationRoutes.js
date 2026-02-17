const express = require('express');
const { getAllDesignations, getDesignationById, updateDesignation } = require('../controllers/designationController');

const router = express.Router();

// GET /api/designations
router.get('/', getAllDesignations);

// PUT /api/designations/:id
router.put('/:id', updateDesignation);

// GET /api/designations/:id
router.get('/:id', getDesignationById);

module.exports = router;
