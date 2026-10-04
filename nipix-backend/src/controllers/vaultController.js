const vaultService = require('../services/vaultService');

const vaultController = {
  // GET /api/vault/status
  getStatus: async (req, res, next) => {
    try {
      const status = await vaultService.getStatus(req.user.id);
      res.json({ success: true, ...status });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/vault/setup
  setup: async (req, res, next) => {
    try {
      const result = await vaultService.setupVault({
        userId: req.user.id,
        pin: req.body.pin,
        confirmPin: req.body.confirmPin,
        recoveryMethod: req.body.recoveryMethod,
        recoveryDate: req.body.recoveryDate
      });
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // POST /api/vault/unlock
  unlock: async (req, res, next) => {
    try {
      const result = await vaultService.unlockVault({
        userId: req.user.id,
        pin: req.body.pin
      });
      res.json(result);
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // POST /api/vault/verify-recovery
  verifyRecovery: async (req, res, next) => {
    try {
      const result = await vaultService.verifyRecovery({
        userId: req.user.id,
        recoveryMethod: req.body.recoveryMethod,
        recoveryDate: req.body.recoveryDate
      });
      res.json(result);
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // POST /api/vault/reset-pin
  resetPin: async (req, res, next) => {
    try {
      const result = await vaultService.resetPin({
        userId: req.user.id,
        resetToken: req.body.resetToken,
        newPin: req.body.newPin,
        confirmPin: req.body.confirmPin
      });
      res.json(result);
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // POST /api/vault/change-pin
  changePin: async (req, res, next) => {
    try {
      const result = await vaultService.changePin({
        userId: req.user.id,
        currentPin: req.body.currentPin,
        newPin: req.body.newPin,
        confirmPin: req.body.confirmPin
      });
      res.json(result);
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // PUT /api/vault/recovery-method
  updateRecoveryMethod: async (req, res, next) => {
    try {
      const result = await vaultService.updateRecoveryMethod({
        userId: req.user.id,
        currentPin: req.body.currentPin,
        recoveryMethod: req.body.recoveryMethod,
        recoveryDate: req.body.recoveryDate
      });
      res.json(result);
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // GET /api/vault/conversations
  getConversations: async (req, res, next) => {
    try {
      const conversations = await vaultService.getConversations(req.user.id);
      res.json({ success: true, conversations });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/vault/conversations
  startConversation: async (req, res, next) => {
    try {
      const conversation = await vaultService.startConversation(req.user.id, req.body.targetUserId);
      res.status(201).json({ success: true, conversation });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // GET /api/vault/conversations/:id/messages
  getConversationMessages: async (req, res, next) => {
    try {
      const messages = await vaultService.getConversationMessages(req.user.id, req.params.id);
      res.json({ success: true, messages });
    } catch (err) {
      res.status(403).json({ success: false, message: err.message });
    }
  },

  // POST /api/vault/conversations/:id/messages
  sendVaultMessage: async (req, res, next) => {
    try {
      const message = await vaultService.sendVaultMessage(req.user.id, req.params.id, {
        messageText: req.body.messageText,
        mediaUrl: req.body.mediaUrl,
        mediaType: req.body.mediaType,
        fileName: req.body.fileName,
        fileSize: req.body.fileSize
      });
      res.status(201).json({ success: true, message });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // GET /api/vault/users/search
  searchScholars: async (req, res, next) => {
    try {
      const users = await vaultService.searchScholars(req.user.id, req.query.q);
      res.json({ success: true, users });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/vault/call-logs
  getCallLogs: async (req, res, next) => {
    try {
      const callLogs = await vaultService.getCallLogs(req.user.id);
      res.json({ success: true, callLogs });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/vault/call-logs
  recordCallLog: async (req, res, next) => {
    try {
      const callLog = await vaultService.recordCallLog(req.user.id, req.body);
      res.status(201).json({ success: true, callLog });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
};

module.exports = vaultController;
