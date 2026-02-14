const Joi = require('joi');

const createParentSchema = Joi.object({
  student_id: Joi.number().integer().required(),
  father_name: Joi.string().trim().optional().allow(null, ''),
  father_email: Joi.string().email().optional().allow(null, ''),
  father_phone: Joi.string().trim().optional().allow(null, ''),
  father_occupation: Joi.string().trim().optional().allow(null, ''),
  father_image_url: Joi.string().trim().optional().allow(null, ''),
  mother_name: Joi.string().trim().optional().allow(null, ''),
  mother_email: Joi.string().email().optional().allow(null, ''),
  mother_phone: Joi.string().trim().optional().allow(null, ''),
  mother_occupation: Joi.string().trim().optional().allow(null, ''),
  mother_image_url: Joi.string().trim().optional().allow(null, '')
});

const updateParentSchema = Joi.object({
  father_name: Joi.string().trim().optional().allow(null, ''),
  father_email: Joi.string().email().optional().allow(null, ''),
  father_phone: Joi.string().trim().optional().allow(null, ''),
  father_occupation: Joi.string().trim().optional().allow(null, ''),
  father_image_url: Joi.string().trim().optional().allow(null, ''),
  mother_name: Joi.string().trim().optional().allow(null, ''),
  mother_email: Joi.string().email().optional().allow(null, ''),
  mother_phone: Joi.string().trim().optional().allow(null, ''),
  mother_occupation: Joi.string().trim().optional().allow(null, ''),
  mother_image_url: Joi.string().trim().optional().allow(null, '')
});

module.exports = { createParentSchema, updateParentSchema };
