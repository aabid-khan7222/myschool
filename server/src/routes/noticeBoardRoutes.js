const express = require('express');
const {
  getAllNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
} = require('../controllers/noticeBoardController');

const router = express.Router();

router.get('/', getAllNotices);
router.get('/:id', getNoticeById);
router.post('/', createNotice);
router.put('/:id', updateNotice);
router.delete('/:id', deleteNotice);

module.exports = router;
