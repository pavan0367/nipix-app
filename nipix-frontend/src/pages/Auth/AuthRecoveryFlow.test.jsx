import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import authReducer from '../../store/slices/authSlice';

import VerifyEmail from './VerifyEmail';
import ForgotPassword from './ForgotPassword';
import VerifyResetOtp from './VerifyResetOtp';
import ResetPassword from './ResetPassword';
import PasswordUpdated from './PasswordUpdated';

const renderToHtml = (ui, route = '/') => {
  const store = configureStore({
    reducer: { auth: authReducer }
  });
  return ReactDOMServer.renderToStaticMarkup(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        {ui}
      </MemoryRouter>
    </Provider>
  );
};

describe('Authentication, Verification & Password Recovery Views', () => {
  test('VerifyEmail renders email address, 6-digit input and verify button', () => {
    const html = renderToHtml(<VerifyEmail />, '/verify-email?email=test%40nipix.live');
    expect(html).toContain('Verify Your Email');
    expect(html).toContain('test@nipix.live');
    expect(html).toContain('Verify &amp; Continue');
    expect(html).toContain('Resend');
  });

  test('ForgotPassword Page 1 renders email field and Send Reset Code button', () => {
    const html = renderToHtml(<ForgotPassword />, '/forgot-password');
    expect(html).toContain('Reset Password');
    expect(html).toContain('Enter your registered email');
    expect(html).toContain('Send Reset Code');
  });

  test('VerifyResetOtp Page 2 contains ONLY OTP verification and ZERO password fields', () => {
    const html = renderToHtml(<VerifyResetOtp />, '/verify-reset-otp?email=student%40nipix.live');
    expect(html).toContain('Enter Recovery Code');
    expect(html).toContain('••••••');
    expect(html).toContain('Verify Code &amp; Set Password');

    // Verify critical security rule: ZERO password inputs on OTP page!
    expect(html.toLowerCase()).not.toContain('new password');
    expect(html.toLowerCase()).not.toContain('confirm password');
  });

  test('ResetPassword Page 3 renders New Password and Confirm New Password fields', () => {
    const html = renderToHtml(<ResetPassword />, '/reset-password?email=student%40nipix.live&token=valid-token');
    expect(html).toContain('Set New Password');
    expect(html).toContain('At least 6 characters');
    expect(html).toContain('Re-enter new password');
    expect(html).toContain('Update Password');
  });

  test('PasswordUpdated Page 4 renders success confirmation and Go to Login link', () => {
    const html = renderToHtml(<PasswordUpdated />, '/password-updated');
    expect(html).toContain('Password Updated Successfully');
    expect(html).toContain('Go to Login');
    expect(html).toContain('href="/login"');
  });
});
