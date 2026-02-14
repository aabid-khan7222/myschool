const Joi = require('joi');

const createStudentSchema = Joi.object({
  academic_year_id: Joi.number().integer().optional().allow(null),
  admission_number: Joi.string().trim().required(),
  admission_date: Joi.date().iso().optional().allow(null),
  roll_number: Joi.string().trim().optional().allow(null, ''),
  status: Joi.string().optional(),
  first_name: Joi.string().trim().required(),
  last_name: Joi.string().trim().required(),
  class_id: Joi.number().integer().optional().allow(null),
  section_id: Joi.number().integer().optional().allow(null),
  gender: Joi.string().trim().optional().allow(null, ''),
  date_of_birth: Joi.date().optional().allow(null),
  blood_group_id: Joi.number().integer().optional().allow(null),
  house_id: Joi.number().integer().optional().allow(null),
  religion_id: Joi.number().integer().optional().allow(null),
  cast_id: Joi.number().integer().optional().allow(null),
  phone: Joi.string().trim().optional().allow(null, ''),
  email: Joi.string().email().optional().allow(null, ''),
  mother_tongue_id: Joi.number().integer().optional().allow(null),
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

const updateStudentSchema = createStudentSchema;

module.exports = { createStudentSchema, updateStudentSchema };
