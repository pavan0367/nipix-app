const express = require('express');
const router = express.Router();
const vaultController = require('../controllers/vaultController');
const authMiddleware = require('../middleware/authMiddleware');

// All Secret Vault routes require an active, authenticated user session
router.use(authMiddleware);

// 1. Check status (hasPin, recoveryMethod, isLocked)
router.get('/status', vaultController.getStatus);

// 2. Initial Setup (4-digit PIN + Mandatory Recovery Method & Date)
router.post('/setup', vaultController.setup);

// 3. Unlock with 4-digit PIN
router.post('/unlock', vaultController.unlock);

// 4. Date-Based Recovery Verification (NO OTP)
router.post('/verify-recovery', vaultController.verifyRecovery);

// 5. Reset PIN using valid recovery token
router.post('/reset-pin', vaultController.resetPin);

// 6. Change PIN from inside authenticated vault
router.post('/change-pin', vaultController.changePin);

// 7. Update Recovery Method from Settings
router.put('/recovery-method', vaultController.updateRecoveryMethod);

// 8. User-to-User Conversations
router.get('/conversations', vaultController.getConversations);
router.post('/conversations', vaultController.startConversation);

// 9. Messages in Conversation
router.get('/conversations/:id/messages', vaultController.getConversationMessages);
router.post('/conversations/:id/messages', vaultController.sendVaultMessage);

// 10. Scholar Search
router.get('/users/search', vaultController.searchScholars);

// 11. Call Logs
router.get('/call-logs', vaultController.getCallLogs);
router.post('/call-logs', vaultController.recordCallLog);

module.exports = router;
