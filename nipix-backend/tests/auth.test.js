const { isValidEmail, isValidUsername, isValidPassword } = require('../src/utils/validators');
const { hashPassword, comparePassword } = require('../src/utils/hashPassword');

describe('Authentication Module Tests (SRS Section 31.1 & TC01-TC05)', () => {
  test('TC01: Valid registration inputs should pass validation', () => {
    expect(isValidUsername('valid_user')).toBe(true);
    expect(isValidEmail('test@nipix.com')).toBe(true);
    expect(isValidPassword('securePassword123')).toBe(true);
  });

  test('TC02/TC03: Invalid username and email should be rejected', () => {
    expect(isValidUsername('a')).toBe(false);
    expect(isValidEmail('invalid-email-format')).toBe(false);
    expect(isValidPassword('123')).toBe(false);
  });

  test('TC05: Password hashing and comparison should function correctly', async () => {
    const rawPassword = 'mySecretPassword';
    const hashed = await hashPassword(rawPassword);

    expect(hashed).not.toBe(rawPassword);
    const isMatch = await comparePassword(rawPassword, hashed);
    expect(isMatch).toBe(true);

    const isWrongMatch = await comparePassword('wrongPassword', hashed);
    expect(isWrongMatch).toBe(false);
  });
});
