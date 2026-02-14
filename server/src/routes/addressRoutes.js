const express = require('express');
const router = express.Router();
const {
  createAddress,
  updateAddress,
  getAllAddresses,
  getAddressById,
  getAddressesByUserId,
  deleteAddress
} = require('../controllers/addressController');
const { validate } = require('../utils/validate');
const { createAddressSchema, updateAddressSchema } = require('../validations/addressValidation');

// Create new address
router.post('/', validate(createAddressSchema), createAddress);

// Get all addresses
router.get('/', getAllAddresses);

// Get address by ID
router.get('/:id', getAddressById);

// Get addresses by user ID
router.get('/user/:userId', getAddressesByUserId);

// Update address
router.put('/:id', validate(updateAddressSchema), updateAddress);

// Delete address
router.delete('/:id', deleteAddress);

module.exports = router;
