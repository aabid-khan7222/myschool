const express = require('express');
const { getAllSchedules, getScheduleById, updateSchedule } = require('../controllers/scheduleController');

const router = express.Router();

router.get('/', getAllSchedules);
router.get('/:id', getScheduleById);
router.put('/:id', updateSchedule);

module.exports = router;
