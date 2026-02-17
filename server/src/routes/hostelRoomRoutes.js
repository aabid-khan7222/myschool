const express = require('express');
const { getAllHostelRooms, getHostelRoomById, updateHostelRoom } = require('../controllers/hostelRoomController');

const router = express.Router();

// Get all hostel rooms
router.get('/', getAllHostelRooms);

// Update hostel room
router.put('/:id', updateHostelRoom);

// Get hostel room by ID
router.get('/:id', getHostelRoomById);

module.exports = router;
