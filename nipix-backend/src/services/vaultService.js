const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { VaultConfig, User } = require('../models');

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
  }
};

module.exports = vaultService;
