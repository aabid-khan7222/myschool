const express = require('express');
const { login, getMe } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const { validate } = require('../utils/validate');
const Joi = require('joi');

const router = express.Router();

const loginSchema = Joi.object({
  username: Joi.string().trim().required(),
  password: Joi.string().required()
});

router.post('/login', (req, res, next) => {
  if (process.env.NODE_ENV === 'production') console.log('POST /api/auth/login received');
  next();
}, validate(loginSchema), login);
router.get('/me', authenticate, getMe);

module.exports = router;
