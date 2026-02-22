const express = require('express');
const { getAllClassSchedules, getClassScheduleById, createClassSchedule, getClassSchedulesDebug } = require('../controllers/classScheduleController');

const router = express.Router();

router.post('/', createClassSchedule);
router.get('/', getAllClassSchedules);
router.get('/debug', getClassSchedulesDebug);
router.get('/:id', getClassScheduleById);

module.exports = router;
