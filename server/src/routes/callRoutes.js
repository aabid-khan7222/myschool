const express = require('express');
const router = express.Router();
const {
  getAllCalls,
  getCallById,
  createCall,
  updateCall,
  deleteCall
} = require('../controllers/callController');

router.get('/', getAllCalls);
router.get('/:id', getCallById);
router.post('/', createCall);
router.put('/:id', updateCall);
router.delete('/:id', deleteCall);

module.exports = router;
