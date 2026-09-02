const messageService = require('../services/messageService');

const messageController = {
  sendMessage: async (req, res) => {
    try {
      const message = await messageService.sendMessage(req.user.id, req.body.conversationId, req.body.text);
      res.status(201).json({ success: true, message });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },

  getMessages: async (req, res) => {
    try {
      const messages = await messageService.getMessages(req.params.conversationId);
      res.json({ success: true, messages });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  }
};

module.exports = messageController;