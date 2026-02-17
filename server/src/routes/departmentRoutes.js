const express = require('express');
const {
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
} = require('../controllers/departmentController');

const router = express.Router();

// GET /api/departments
router.get('/', getAllDepartments);

// GET /api/departments/:id
router.get('/:id', getDepartmentById);

// PUT /api/departments/:id
router.put('/:id', updateDepartment);

module.exports = router;
