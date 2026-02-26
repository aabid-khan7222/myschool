const express = require('express');
const { requireRole } = require('../middleware/rbacMiddleware');
const { EVENT_MANAGER_ROLES } = require('../config/roles');
const {
  getAllEvents,
  getUpcomingEvents,
  getCompletedEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventsController');

const router = express.Router();

// All authenticated users can view events
router.get('/', getAllEvents);
router.get('/upcoming', getUpcomingEvents);
router.get('/completed', getCompletedEvents);

// Headmaster + Teacher only - create, update, delete
router.post('/', requireRole(EVENT_MANAGER_ROLES), createEvent);
router.put('/:id', requireRole(EVENT_MANAGER_ROLES), updateEvent);
router.delete('/:id', requireRole(EVENT_MANAGER_ROLES), deleteEvent);

module.exports = router;
