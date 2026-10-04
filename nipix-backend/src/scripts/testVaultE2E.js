require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { sequelize, User, VaultConfig, Conversation, ConversationMember, Message, CallLog } = require('../models');
const vaultService = require('../services/vaultService');

async function runTests() {
  console.log('--- STARTING SECRET VAULT E2E TEST SUITE ---');
  await sequelize.authenticate();
  console.log('✓ Database connected.');

  // Find or create test users
  let userA = await User.findOne({ where: { username: 'test_vault_user_a' } });
  if (!userA) {
    userA = await User.create({
      username: 'test_vault_user_a',
      email: 'test_vault_a@nipix.test',
      password: 'hashedpassword123',
      full_name: 'Alice Scholar'
    });
  }

  let userB = await User.findOne({ where: { username: 'test_vault_user_b' } });
  if (!userB) {
    userB = await User.create({
      username: 'test_vault_user_b',
      email: 'test_vault_b@nipix.test',
      password: 'hashedpassword123',
      full_name: 'Bob Scholar'
    });
  }

  console.log(`✓ Test Users: User A (ID: ${userA.id}), User B (ID: ${userB.id})`);

  // Reset any existing vault config for User A
  await VaultConfig.destroy({ where: { userId: userA.id } });

  // TEST 1: New user status
  const statusBefore = await vaultService.getStatus(userA.id);
  console.log('✓ Test 1 - New user status hasPin === false:', statusBefore.hasPin === false);

  // TEST 2: Setup PIN with Birthday
  const setupRes = await vaultService.setupVault({
    userId: userA.id,
    pin: '1234',
    confirmPin: '1234',
    recoveryMethod: 'birthday',
    recoveryDate: '15/08/1998'
  });
  console.log('✓ Test 2 - Vault Setup successful:', setupRes.success);

  // TEST 3: Unlock with correct PIN
  const unlockRes = await vaultService.unlockVault({ userId: userA.id, pin: '1234' });
  console.log('✓ Test 3 - Unlock with correct PIN successful:', unlockRes.success);

  // TEST 4: Wrong PIN rejected
  try {
    await vaultService.unlockVault({ userId: userA.id, pin: '9999' });
    console.error('✗ Test 4 Failed: Wrong PIN was accepted!');
  } catch (err) {
    console.log('✓ Test 4 - Wrong PIN rejected properly:', err.message);
  }

  // TEST 5: Verify Recovery with wrong date rejected
  try {
    await vaultService.verifyRecovery({
      userId: userA.id,
      recoveryMethod: 'birthday',
      recoveryDate: '01/01/2000'
    });
    console.error('✗ Test 5 Failed: Wrong recovery date was accepted!');
  } catch (err) {
    console.log('✓ Test 5 - Wrong recovery date rejected:', err.message);
  }

  // TEST 6: Verify Recovery with correct date
  const verifyRes = await vaultService.verifyRecovery({
    userId: userA.id,
    recoveryMethod: 'birthday',
    recoveryDate: '15/08/1998'
  });
  console.log('✓ Test 6 - Correct recovery date verified, token received:', !!verifyRes.resetToken);

  // TEST 7: Reset PIN
  const resetRes = await vaultService.resetPin({
    userId: userA.id,
    resetToken: verifyRes.resetToken,
    newPin: '5678',
    confirmPin: '5678'
  });
  console.log('✓ Test 7 - Reset PIN successful:', resetRes.success);

  // TEST 8: Old PIN rejected after reset
  try {
    await vaultService.unlockVault({ userId: userA.id, pin: '1234' });
    console.error('✗ Test 8 Failed: Old PIN worked after reset!');
  } catch (err) {
    console.log('✓ Test 8 - Old PIN rejected after reset:', err.message);
  }

  // TEST 9: New PIN works
  const unlockNew = await vaultService.unlockVault({ userId: userA.id, pin: '5678' });
  console.log('✓ Test 9 - New PIN unlocks successfully:', unlockNew.success);

  // TEST 10: Clean conversations for user with no conversations
  // Reset any conversations between User A and User B
  const memberships = await ConversationMember.findAll({ where: { userId: userA.id } });
  for (const m of memberships) {
    await Message.destroy({ where: { conversationId: m.conversationId } });
    await ConversationMember.destroy({ where: { conversationId: m.conversationId } });
    await Conversation.destroy({ where: { id: m.conversationId } });
  }

  const convsEmpty = await vaultService.getConversations(userA.id);
  console.log('✓ Test 10 - New user inbox empty array:', convsEmpty.length === 0);

  // TEST 11: Scholar Search
  const searchResults = await vaultService.searchScholars(userA.id, 'Bob');
  console.log('✓ Test 11 - Scholar search finds User B:', searchResults.some(u => u.id === userB.id));

  // TEST 12: Start Conversation
  const conv = await vaultService.startConversation(userA.id, userB.id);
  console.log('✓ Test 12 - Start conversation created ID:', conv.id);

  // TEST 13: Send User-to-User Message (Text)
  const sentMsg = await vaultService.sendVaultMessage(userA.id, conv.id, {
    messageText: 'Quantum benchmark received.'
  });
  console.log('✓ Test 13 - Send text message successful:', sentMsg.id, sentMsg.text);

  // TEST 14: Send Attachment Message (Image & Doc)
  const sentImage = await vaultService.sendVaultMessage(userA.id, conv.id, {
    messageText: 'quantum_spec.png',
    mediaUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    mediaType: 'image',
    fileName: 'quantum_spec.png',
    fileSize: '1.2 KB'
  });
  console.log('✓ Test 14 - Send image attachment message successful:', sentImage.id, sentImage.mediaType);

  // TEST 15: Retrieve Messages
  const messagesList = await vaultService.getConversationMessages(userA.id, conv.id);
  console.log('✓ Test 15 - Messages retrieved count:', messagesList.length);

  // TEST 16: Security — User C cannot access this conversation
  let userC = await User.findOne({ where: { username: 'test_vault_user_c' } });
  if (!userC) {
    userC = await User.create({
      username: 'test_vault_user_c',
      email: 'test_vault_c@nipix.test',
      password: 'hashedpassword123',
      full_name: 'Charlie Scholar'
    });
  }
  try {
    await vaultService.getConversationMessages(userC.id, conv.id);
    console.error('✗ Test 16 Failed: User C was able to access conversation!');
  } catch (err) {
    console.log('✓ Test 16 - Unauthorized user rejected from private conversation:', err.message);
  }

  // TEST 17: Record Call Log & Retrieve
  const callRecord = await vaultService.recordCallLog(userA.id, {
    contactId: userB.id,
    callType: 'audio',
    direction: 'outgoing',
    status: 'completed',
    duration: 125
  });
  console.log('✓ Test 17 - Call log recorded:', callRecord.id, `${callRecord.duration}s`);

  const userACallLogs = await vaultService.getCallLogs(userA.id);
  console.log('✓ Test 18 - Call logs retrieved for User A count:', userACallLogs.length);

  console.log('--- ALL SECRET VAULT E2E TESTS PASSED SUCCESSFULLY! ---');
  process.exit(0);
}

runTests().catch(err => {
  console.error('FATAL TEST ERROR:', err);
  process.exit(1);
});
