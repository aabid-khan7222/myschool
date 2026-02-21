const express = require('express');
const {
  getAllClassRooms,
  getClassRoomById,
  createClassRoom,
  updateClassRoom,
  deleteClassRoom
} = require('../controllers/classRoomController');

const router = express.Router();

router.get('/', getAllClassRooms);
router.get('/:id', getClassRoomById);
router.post('/', createClassRoom);
router.put('/:id', updateClassRoom);
router.delete('/:id', deleteClassRoom);

module.exports = router;
