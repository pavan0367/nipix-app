const { Conversation, ConversationMember, Message, User } = require('../models');
const { getIO } = require('../sockets/socket');

const messageService = {
  getOrCreateConversation: async (userId1, userId2) => {
    // Find existing conversation
    const convs = await Conversation.findAll({ include: { model: User, where: { id: [userId1, userId2] } } });
    // Simplified logic for MVP: create new if not found
    const conversation = await Conversation.create();
    await ConversationMember.bulkCreate([
      { conversationId: conversation.id, userId: userId1 },
      { conversationId: conversation.id, userId: userId2 }
    ]);
    return conversation;
  },

  sendMessage: async (senderId, conversationId, text) => {
    const message = await Message.create({ senderId, conversationId, messageText: text });
    
    // Emit real-time event
    const io = getIO();
    const recipient = await ConversationMember.findOne({ 
      where: { conversationId }, 
      attributes: ['userId'] 
    });
    // In a real app, find the other user's ID and emit to their room
    io.to(`user_${recipient.userId}`).emit('receiveMessage', message);
    
    return message;
  },

  getMessages: async (conversationId) => {
    return await Message.findAll({ 
      where: { conversationId }, 
      include: [{ model: User, as: 'sender', attributes: ['id', 'username', 'profile_image'] }],
      order: [['createdAt', 'ASC']] 
    });
  }
};

module.exports = messageService;