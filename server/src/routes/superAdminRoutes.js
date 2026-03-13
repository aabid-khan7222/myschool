const express = require('express');
const Joi = require('joi');
const { validate } = require('../utils/validate');
const { authenticateSuperAdmin, requireSuperAdmin } = require('../middleware/superAdminAuthMiddleware');
const {
  listSchools,
  getSchoolById,
  updateSchoolStatus,
  getPlatformStats,
  createSchool,
  updateSchoolMetadata,
  deleteSchool,
} = require('../controllers/superAdminController');
const { getSuperAdminProfile } = require('../controllers/superAdminAuthController');

const router = express.Router();

// All routes here require Super Admin authentication
router.use(authenticateSuperAdmin, requireSuperAdmin);

router.get('/me', getSuperAdminProfile);
router.get('/schools', listSchools);
router.get('/schools/:id', getSchoolById);

const createSchoolSchema = Joi.object({
  school_name: Joi.string().trim().min(2).max(255).required(),
  institute_number: Joi.string().trim().min(1).max(50).required(),
  admin_name: Joi.string().trim().min(2).max(255).required(),
  admin_email: Joi.string().trim().email().max(255).required(),
  admin_password: Joi.string().min(6).max(200).required(),
});

router.post(
  '/schools',
  validate(createSchoolSchema),
  createSchool
);

const updateSchoolSchema = Joi.object({
  school_name: Joi.string().trim().min(2).max(255).optional(),
  institute_number: Joi.string().trim().min(1).max(50).optional(),
}).min(1);

router.patch(
  '/schools/:id',
  validate(updateSchoolSchema),
  updateSchoolMetadata
);

router.delete(
  '/schools/:id',
  deleteSchool
);

const updateSchoolStatusSchema = Joi.object({
  status: Joi.string().valid('active', 'disabled').required(),
});

router.patch(
  '/schools/:id/status',
  validate(updateSchoolStatusSchema),
  updateSchoolStatus
);

router.get('/stats/platform', getPlatformStats);

module.exports = router;

