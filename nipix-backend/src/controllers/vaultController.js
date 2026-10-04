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
  }
};

module.exports = vaultController;
