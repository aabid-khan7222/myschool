const express = require('express');
const router = express.Router();
const {
  getAllEmails,
  getEmailById,
  createEmail,
  updateEmail,
  deleteEmail
} = require('../controllers/emailController');

router.get('/', getAllEmails);
router.get('/:id', getEmailById);
router.post('/', createEmail);
router.put('/:id', updateEmail);
router.delete('/:id', deleteEmail);

module.exports = router;
