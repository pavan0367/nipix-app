const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { VaultConfig, User, Conversation, ConversationMember, Message, CallLog } = require('../models');

let getIO;
try {
  getIO = require('../sockets/socket').getIO;
} catch (e) {
  getIO = () => null;
}

// Helper to normalize input date to standard YYYY-MM-DD string
const normalizeDate = (dateStr) => {
  if (!dateStr) return null;
  const str = String(dateStr).trim();

  // If already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }

  // If DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    const month = dmyMatch[2].padStart(2, '0');
    const year = dmyMatch[3];
    return `${year}-${month}-${day}`;
  }

  // Attempt Date parse
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    const year = parsed.getUTCFullYear();
    const month = String(parsed.getUTCMonth() + 1).padStart(2, '0');
    const day = String(parsed.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return null;
};

const vaultService = {
  // 1. Get Vault Status (Has PIN configured? Recovery method configured? Lockout state?)
  getStatus: async (userId) => {
    const config = await VaultConfig.findOne({ where: { userId } });
    if (!config) {
      return {
        hasPin: false,
        recoveryMethod: null,
        isLocked: false,
        lockRemainingSeconds: 0
      };
    }

    const now = new Date();
    const isLocked = config.locked_until && config.locked_until > now;
    const lockRemainingSeconds = isLocked ? Math.ceil((config.locked_until - now) / 1000) : 0;

    return {
      hasPin: true,
      recoveryMethod: config.recovery_method,
      isLocked: !!isLocked,
      lockRemainingSeconds
    };
  },

  // 2. Setup Vault PIN & Mandatory Recovery Method
  setupVault: async ({ userId, pin, confirmPin, recoveryMethod, recoveryDate }) => {
    // Validate 4-digit PIN
    if (!pin || !/^\d{4}$/.test(String(pin).trim())) {
      throw new Error('Secret Vault PIN must be exactly 4 numeric digits.');
    }
    if (String(pin).trim() !== String(confirmPin).trim()) {
      throw new Error('PIN and PIN confirmation do not match.');
    }

    // Validate Recovery Method
    const cleanMethod = String(recoveryMethod || '').trim().toLowerCase();
    if (!['birthday', 'anniversary'].includes(cleanMethod)) {
      throw new Error('Please select a valid recovery method (Birthday or Anniversary Date).');
    }

    // Validate Recovery Date
    const normalizedDate = normalizeDate(recoveryDate);
    if (!normalizedDate) {
      throw new Error('Please provide a valid recovery date (DD/MM/YYYY).');
    }

    // Hash PIN and Recovery Date with bcrypt
    const saltRounds = 10;
    const pin_hash = await bcrypt.hash(String(pin).trim(), saltRounds);
    const recovery_hash = await bcrypt.hash(normalizedDate, saltRounds);

    let config = await VaultConfig.findOne({ where: { userId } });
    if (config) {
      config.pin_hash = pin_hash;
      config.recovery_method = cleanMethod;
      config.recovery_hash = recovery_hash;
      config.failed_attempts = 0;
      config.locked_until = null;
      await config.save();
    } else {
      config = await VaultConfig.create({
        userId,
        pin_hash,
        recovery_method: cleanMethod,
        recovery_hash,
        failed_attempts: 0,
        locked_until: null
      });
    }

    return {
      success: true,
      message: 'Secret Vault PIN and recovery method configured successfully.',
      recoveryMethod: cleanMethod
    };
  },

  // 3. Unlock Vault
  unlockVault: async ({ userId, pin }) => {
    const config = await VaultConfig.findOne({ where: { userId } });
    if (!config) {
      throw new Error('Secret Vault has not been configured yet. Please create a PIN.');
    }

    const now = new Date();
    if (config.locked_until && config.locked_until > now) {
      const waitMins = Math.ceil((config.locked_until - now) / 60000);
      throw new Error(`Vault is temporarily locked due to repeated incorrect attempts. Please wait ${waitMins} minute(s).`);
    }

    const cleanPin = String(pin || '').trim();
    const isMatch = await bcrypt.compare(cleanPin, config.pin_hash);

    if (!isMatch) {
      config.failed_attempts = (config.failed_attempts || 0) + 1;
      if (config.failed_attempts >= 5) {
        config.locked_until = new Date(Date.now() + 15 * 60 * 1000); // 15 min lockout
      }
      await config.save();

      const remaining = 5 - config.failed_attempts;
      if (remaining > 0) {
        throw new Error(`Incorrect 4-digit PIN. ${remaining} attempt(s) remaining before temporary lockout.`);
      } else {
        throw new Error('Too many incorrect PIN attempts. Secret Vault is locked for 15 minutes.');
      }
    }

    // Success: Reset failure count
    config.failed_attempts = 0;
    config.locked_until = null;
    await config.save();

    return {
      success: true,
      message: 'Secret Vault unlocked successfully.'
    };
  },

  // 4. Verify Recovery Details (Date-Based Recovery — NO OTP)
  verifyRecovery: async ({ userId, recoveryMethod, recoveryDate }) => {
    const config = await VaultConfig.findOne({ where: { userId } });
    if (!config) {
      throw new Error('No Secret Vault configuration found for this account.');
    }

    const now = new Date();
    if (config.locked_until && config.locked_until > now) {
      const waitMins = Math.ceil((config.locked_until - now) / 60000);
      throw new Error(`Too many failed recovery attempts. Please wait ${waitMins} minute(s) before trying again.`);
    }

    const cleanMethod = String(recoveryMethod || '').trim().toLowerCase();
    const normalizedDate = normalizeDate(recoveryDate);

    let isMatch = false;
    if (normalizedDate && cleanMethod === config.recovery_method) {
      isMatch = await bcrypt.compare(normalizedDate, config.recovery_hash);
    }

    if (!isMatch) {
      config.failed_attempts = (config.failed_attempts || 0) + 1;
      if (config.failed_attempts >= 5) {
        config.locked_until = new Date(Date.now() + 15 * 60 * 1000); // 15 min lockout
      }
      await config.save();

      // Per specification Section 9: Do not reveal which part was incorrect.
      throw new Error('Recovery details do not match.');
    }

    // Success: Reset failed attempts and issue a short-lived reset token (15 mins)
    config.failed_attempts = 0;
    config.locked_until = null;
    await config.save();

    const resetToken = jwt.sign(
      { userId, purpose: 'vault_pin_reset' },
      process.env.JWT_SECRET || 'NipixSecret2024!!',
      { expiresIn: '15m' }
    );

    return {
      success: true,
      message: 'Recovery details verified successfully.',
      resetToken
    };
  },

  // 5. Reset 4-digit PIN after successful date verification
  resetPin: async ({ userId, resetToken, newPin, confirmPin }) => {
    if (!resetToken) {
      throw new Error('Recovery verification session expired. Please verify your recovery date again.');
    }

    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET || 'NipixSecret2024!!');
    } catch (err) {
      throw new Error('Recovery session expired or invalid. Please verify your recovery date again.');
    }

    if (String(decoded.userId) !== String(userId) || decoded.purpose !== 'vault_pin_reset') {
      throw new Error('Invalid recovery session for this account.');
    }

    if (!newPin || !/^\d{4}$/.test(String(newPin).trim())) {
      throw new Error('New Secret Vault PIN must be exactly 4 numeric digits.');
    }

    if (String(newPin).trim() !== String(confirmPin).trim()) {
      throw new Error('PIN confirmation does not match.');
    }

    const config = await VaultConfig.findOne({ where: { userId } });
    if (!config) {
      throw new Error('Secret Vault configuration not found.');
    }

    const pin_hash = await bcrypt.hash(String(newPin).trim(), 10);
    config.pin_hash = pin_hash;
    config.failed_attempts = 0;
    config.locked_until = null;
    await config.save();

    return {
      success: true,
      message: 'Secret Vault PIN reset successfully.'
    };
  },

  // 6. Change PIN from inside authenticated vault
  changePin: async ({ userId, currentPin, newPin, confirmPin }) => {
    const config = await VaultConfig.findOne({ where: { userId } });
    if (!config) {
      throw new Error('Secret Vault configuration not found.');
    }

    const isMatch = await bcrypt.compare(String(currentPin || '').trim(), config.pin_hash);
    if (!isMatch) {
      throw new Error('Current PIN is incorrect.');
    }

    if (!newPin || !/^\d{4}$/.test(String(newPin).trim())) {
      throw new Error('New PIN must be exactly 4 numeric digits.');
    }
    if (String(newPin).trim() !== String(confirmPin).trim()) {
      throw new Error('New PIN and confirmation do not match.');
    }

    config.pin_hash = await bcrypt.hash(String(newPin).trim(), 10);
    await config.save();

    return {
      success: true,
      message: 'PIN changed successfully.'
    };
  },

  // 7. Update Recovery Method from Settings
  updateRecoveryMethod: async ({ userId, currentPin, recoveryMethod, recoveryDate }) => {
    const config = await VaultConfig.findOne({ where: { userId } });
    if (!config) {
      throw new Error('Secret Vault configuration not found.');
    }

    const isMatch = await bcrypt.compare(String(currentPin || '').trim(), config.pin_hash);
    if (!isMatch) {
      throw new Error('Current PIN is required to change your recovery method.');
    }

    const cleanMethod = String(recoveryMethod || '').trim().toLowerCase();
    if (!['birthday', 'anniversary'].includes(cleanMethod)) {
      throw new Error('Please select a valid recovery method (Birthday or Anniversary Date).');
    }

    const normalizedDate = normalizeDate(recoveryDate);
    if (!normalizedDate) {
      throw new Error('Please provide a valid recovery date (DD/MM/YYYY).');
    }

    config.recovery_method = cleanMethod;
    config.recovery_hash = await bcrypt.hash(normalizedDate, 10);
    await config.save();

    return {
      success: true,
      message: 'Recovery method updated successfully.',
      recoveryMethod: cleanMethod
    };
  },

  // 8. Get Vault Conversations for current authenticated user
  getConversations: async (userId) => {
    // Find all conversations where current user is a member
    const memberships = await ConversationMember.findAll({
      where: { userId },
      attributes: ['conversationId']
    });

    if (!memberships || memberships.length === 0) {
      return []; // Return clean empty array for new users per Section 7
    }

    const convIds = memberships.map(m => m.conversationId);

    // Fetch conversation details with all members and latest message
    const conversations = await Conversation.findAll({
      where: { id: { [Op.in]: convIds } },
      include: [
        {
          model: ConversationMember,
          as: 'members',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'full_name', 'profile_image', 'role']
            }
          ]
        },
        {
          model: Message,
          as: 'messages',
          limit: 1,
          order: [['createdAt', 'DESC']],
          attributes: ['id', 'senderId', 'messageText', 'mediaUrl', 'mediaType', 'fileName', 'fileSize', 'isRead', 'createdAt']
        }
      ],
      order: [['updatedAt', 'DESC']]
    });

    // Format for client consumption
    const formatted = await Promise.all(conversations.map(async (conv) => {
      const otherMemberObj = (conv.members || []).find(m => String(m.userId) !== String(userId));
      const contactUser = otherMemberObj ? otherMemberObj.user : null;

      // Count unread messages for this user in this conversation
      const unreadCount = await Message.count({
        where: {
          conversationId: conv.id,
          senderId: { [Op.ne]: userId },
          isRead: false
        }
      });

      const lastMsg = conv.messages && conv.messages.length > 0 ? conv.messages[0] : null;

      return {
        id: conv.id,
        contact: contactUser ? {
          id: contactUser.id,
          name: contactUser.full_name || contactUser.username,
          username: contactUser.username,
          avatar: contactUser.profile_image || (contactUser.full_name || contactUser.username || 'U')[0].toUpperCase(),
          profile_image: contactUser.profile_image,
          online: false
        } : {
          id: 0,
          name: 'Scholar',
          username: 'scholar',
          avatar: 'S',
          online: false
        },
        lastMessage: lastMsg ? {
          id: lastMsg.id,
          text: lastMsg.messageText,
          mediaUrl: lastMsg.mediaUrl,
          mediaType: lastMsg.mediaType || 'text',
          fileName: lastMsg.fileName,
          time: lastMsg.createdAt,
          senderId: lastMsg.senderId,
          isUser: String(lastMsg.senderId) === String(userId)
        } : null,
        unread: unreadCount,
        updatedAt: conv.updatedAt
      };
    }));

    return formatted;
  },

  // 9. Start or Get Conversation between authenticated user and target user
  startConversation: async (userId, targetUserId) => {
    if (!targetUserId) {
      throw new Error('Target user ID is required.');
    }
    if (String(userId) === String(targetUserId)) {
      throw new Error('Cannot start a private conversation with yourself.');
    }

    const targetUser = await User.findByPk(targetUserId, {
      attributes: ['id', 'username', 'full_name', 'profile_image']
    });
    if (!targetUser) {
      throw new Error('Target scholar was not found.');
    }

    // Check if conversation already exists between both users
    const myConvs = await ConversationMember.findAll({
      where: { userId },
      attributes: ['conversationId']
    });
    const convIds = myConvs.map(c => c.conversationId);

    let existingConv = null;
    if (convIds.length > 0) {
      const match = await ConversationMember.findOne({
        where: {
          userId: targetUserId,
          conversationId: { [Op.in]: convIds }
        }
      });
      if (match) {
        existingConv = await Conversation.findByPk(match.conversationId);
      }
    }

    if (!existingConv) {
      // Create new conversation
      existingConv = await Conversation.create();
      await ConversationMember.bulkCreate([
        { conversationId: existingConv.id, userId },
        { conversationId: existingConv.id, userId: targetUserId }
      ]);
    }

    return {
      id: existingConv.id,
      contact: {
        id: targetUser.id,
        name: targetUser.full_name || targetUser.username,
        username: targetUser.username,
        avatar: targetUser.profile_image || (targetUser.full_name || targetUser.username || 'U')[0].toUpperCase(),
        profile_image: targetUser.profile_image,
        online: false
      },
      lastMessage: null,
      unread: 0,
      updatedAt: existingConv.updatedAt
    };
  },

  // 10. Get Messages for a specific conversation
  getConversationMessages: async (userId, conversationId) => {
    // SECURITY: Verify caller is a member of this conversation
    const isMember = await ConversationMember.findOne({
      where: { conversationId, userId }
    });
    if (!isMember) {
      throw new Error('Access denied: You are not a participant in this encrypted conversation.');
    }

    // Mark messages sent to this user as read
    await Message.update(
      { isRead: true },
      {
        where: {
          conversationId,
          senderId: { [Op.ne]: userId },
          isRead: false
        }
      }
    );

    const messages = await Message.findAll({
      where: { conversationId },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'full_name', 'profile_image']
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    return messages.map(msg => ({
      id: msg.id,
      conversationId: msg.conversationId,
      senderId: msg.senderId,
      senderName: msg.sender ? (msg.sender.full_name || msg.sender.username) : 'Scholar',
      isUser: String(msg.senderId) === String(userId),
      text: msg.messageText,
      mediaUrl: msg.mediaUrl,
      mediaType: msg.mediaType || 'text',
      fileName: msg.fileName,
      fileSize: msg.fileSize,
      isRead: msg.isRead,
      createdAt: msg.createdAt
    }));
  },

  // 11. Send User-to-User Message (Text / Image / Video / Document / Audio / Location)
  sendVaultMessage: async (userId, conversationId, { messageText, mediaUrl, mediaType, fileName, fileSize }) => {
    // SECURITY: Verify caller is a member
    const isMember = await ConversationMember.findOne({
      where: { conversationId, userId }
    });
    if (!isMember) {
      throw new Error('Access denied: You cannot send messages to this conversation.');
    }

    if (!messageText && !mediaUrl) {
      throw new Error('Message cannot be empty.');
    }

    const message = await Message.create({
      conversationId,
      senderId: userId,
      messageText: messageText || '',
      mediaUrl: mediaUrl || null,
      mediaType: mediaType || 'text',
      fileName: fileName || null,
      fileSize: fileSize || null,
      isRead: false
    });

    // Touch conversation updatedAt
    await Conversation.update({ updatedAt: new Date() }, { where: { id: conversationId } });

    // Fetch sender info
    const sender = await User.findByPk(userId, {
      attributes: ['id', 'username', 'full_name', 'profile_image']
    });

    const formattedMsg = {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      senderName: sender ? (sender.full_name || sender.username) : 'Scholar',
      isUser: true,
      text: message.messageText,
      mediaUrl: message.mediaUrl,
      mediaType: message.mediaType,
      fileName: message.fileName,
      fileSize: message.fileSize,
      isRead: false,
      createdAt: message.createdAt
    };

    // Emit real-time event via socket
    try {
      if (getIO) {
        const io = getIO();
        if (io) {
          const members = await ConversationMember.findAll({
            where: { conversationId },
            attributes: ['userId']
          });
          members.forEach(m => {
            io.to(`user_${m.userId}`).emit('vaultMessage', formattedMsg);
          });
        }
      }
    } catch (sockErr) {
      console.warn('Socket notification skipped:', sockErr.message);
    }

    return formattedMsg;
  },

  // 12. Search Scholars
  searchScholars: async (userId, query) => {
    const cleanQuery = String(query || '').trim();
    if (!cleanQuery) return [];

    const users = await User.findAll({
      where: {
        id: { [Op.ne]: userId },
        [Op.or]: [
          { username: { [Op.like]: `%${cleanQuery}%` } },
          { full_name: { [Op.like]: `%${cleanQuery}%` } }
        ]
      },
      attributes: ['id', 'username', 'full_name', 'profile_image'],
      limit: 25
    });

    return users.map(u => ({
      id: u.id,
      name: u.full_name || u.username,
      username: u.username,
      avatar: u.profile_image || (u.full_name || u.username || 'U')[0].toUpperCase(),
      profile_image: u.profile_image,
      online: false
    }));
  },

  // 13. Get Call Logs
  getCallLogs: async (userId) => {
    const logs = await CallLog.findAll({
      where: { userId },
      include: [
        {
          model: User,
          as: 'contact',
          attributes: ['id', 'username', 'full_name', 'profile_image']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return logs.map(l => ({
      id: l.id,
      contact: l.contact ? {
        id: l.contact.id,
        name: l.contact.full_name || l.contact.username,
        username: l.contact.username,
        avatar: l.contact.profile_image || (l.contact.full_name || l.contact.username || 'U')[0].toUpperCase()
      } : {
        id: 0,
        name: 'Scholar',
        username: 'scholar',
        avatar: 'S'
      },
      callType: l.callType,
      direction: l.direction,
      status: l.status,
      duration: l.duration,
      createdAt: l.createdAt
    }));
  },

  // 14. Record Call Log
  recordCallLog: async (userId, { contactId, callType, direction, status, duration }) => {
    if (!contactId) {
      throw new Error('Contact ID is required.');
    }

    const log = await CallLog.create({
      userId,
      contactId,
      callType: callType || 'audio',
      direction: direction || 'outgoing',
      status: status || 'completed',
      duration: parseInt(duration, 10) || 0
    });

    // Also record incoming/outgoing counter-log for contact
    try {
      const counterDirection = direction === 'outgoing' ? 'incoming' : 'outgoing';
      await CallLog.create({
        userId: contactId,
        contactId: userId,
        callType: callType || 'audio',
        direction: counterDirection,
        status: status || 'completed',
        duration: parseInt(duration, 10) || 0
      });
    } catch (e) {
      console.warn('Counter call log creation warning:', e.message);
    }

    const contact = await User.findByPk(contactId, {
      attributes: ['id', 'username', 'full_name', 'profile_image']
    });

    return {
      id: log.id,
      contact: contact ? {
        id: contact.id,
        name: contact.full_name || contact.username,
        username: contact.username,
        avatar: contact.profile_image || (contact.full_name || contact.username || 'U')[0].toUpperCase()
      } : null,
      callType: log.callType,
      direction: log.direction,
      status: log.status,
      duration: log.duration,
      createdAt: log.createdAt
    };
  }
};

module.exports = vaultService;
