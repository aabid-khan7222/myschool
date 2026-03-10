const express = require('express');
const { login, getMe, logout } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const { validate } = require('../utils/validate');
const Joi = require('joi');

const router = express.Router();

const loginSchema = Joi.object({
  instituteNumber: Joi.string().trim().required(),
  username: Joi.string().trim().required(),
  password: Joi.string().required()
});

router.post('/login', validate(loginSchema), login);
router.get('/me', authenticate, getMe);
// Logout clears cookie - no auth required so expired tokens can still clear the cookie
router.post('/logout', logout);

module.exports = router;
