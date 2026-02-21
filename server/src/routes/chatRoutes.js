const express = require('express');
const router = express.Router();
const {
  getAllChats,
  getChatById,
  getMessagesByRecipient,
  getSharedMedia,
  getConversations,
  createChat,
  updateChat,
  pinConversation,
  deleteConversation,
  muteConversation,
  clearConversation,
  reportUser,
  blockUser,
  deleteChat
} = require('../controllers/chatController');

router.get('/', getAllChats);
router.get('/conversations', getConversations);
router.get('/messages/:recipientId', getMessagesByRecipient);
router.get('/shared-media/:recipientId', getSharedMedia);
router.put('/conversation/:recipientId/pin', pinConversation);
router.put('/conversation/:recipientId/mute', muteConversation);
router.put('/conversation/:recipientId/clear', clearConversation);
router.delete('/conversation/:recipientId', deleteConversation);
router.post('/conversation/:recipientId/report', reportUser);
router.post('/conversation/:recipientId/block', blockUser);
router.get('/:id', getChatById);
router.post('/', createChat);
router.put('/:id', updateChat);
router.delete('/:id', deleteChat);

module.exports = router;
