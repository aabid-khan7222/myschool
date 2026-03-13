const express = require('express');
const Joi = require('joi');
const { superAdminLogin, superAdminLogout } = require('../controllers/superAdminAuthController');
const { authenticateSuperAdmin, requireSuperAdmin } = require('../middleware/superAdminAuthMiddleware');
const { validate } = require('../utils/validate');

const router = express.Router();

const superAdminLoginSchema = Joi.object({
  emailOrUsername: Joi.string().trim().required(),
  password: Joi.string().required(),
});

router.post('/login', validate(superAdminLoginSchema), superAdminLogin);

// Super Admin logout clears its own cookie; allow calling even if token is expired
router.post('/logout', authenticateSuperAdmin, requireSuperAdmin, superAdminLogout);

module.exports = router;

