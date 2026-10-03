const axios = require('axios');
let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  nodemailer = null;
}

// In-memory Delivery Audit Log (last 100 entries, no passwords or plain OTPs)
const emailDeliveryLogs = [];

const logDelivery = ({ eventType, recipient, status, error = null, messageId = null }) => {
  const entry = {
    eventType,
    recipient: recipient ? recipient.replace(/^(.)(.*)(@.*)$/, (_, a, b, c) => a + '***' + c) : 'unknown',
    status, // 'SENT' | 'FAILED' | 'MOCKED'
    messageId,
    error: error ? (error.message || String(error)) : null,
    timestamp: new Date().toISOString()
  };
  emailDeliveryLogs.unshift(entry);
  if (emailDeliveryLogs.length > 100) emailDeliveryLogs.pop();
  console.log(`📧 [EMAIL_AUDIT] ${entry.status} - Type: "${eventType}" to ${entry.recipient} at ${entry.timestamp}`);
};

/**
 * Clean Nipix Branded HTML Email Wrapper
 */
const buildNipixEmailHtml = ({ title, preheader, bodyContent, alertBox = null, footerNotice = null }) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9; }
    .wrapper { width: 100%; background-color: #0b0f19; padding: 40px 16px; }
    .card { max-width: 540px; margin: 0 auto; background: #13192b; border: 1px solid rgba(59, 130, 246, 0.25); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .header { background: linear-gradient(135deg, #1e293b, #0f172a); padding: 32px 24px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.08); }
    .logo-badge { display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: #ffffff; font-weight: 900; font-size: 22px; padding: 10px 20px; border-radius: 12px; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4); }
    .brand-sub { margin-top: 8px; font-size: 13px; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase; font-weight: 600; }
    .content { padding: 32px 28px; line-height: 1.6; }
    h2 { margin: 0 0 16px 0; color: #ffffff; font-size: 20px; font-weight: 700; }
    p { margin: 0 0 16px 0; color: #cbd5e1; font-size: 15px; }
    .code-box { background: rgba(59, 130, 246, 0.1); border: 2px dashed #3b82f6; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
    .code-digits { font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; color: #60a5fa; letter-spacing: 8px; margin: 0; }
    .alert-box { background: rgba(245, 158, 11, 0.12); border-left: 4px solid #f59e0b; padding: 14px 16px; border-radius: 6px; margin: 20px 0; color: #fbbf24; font-size: 13px; }
    .footer { padding: 24px; background: #0c111e; border-top: 1px solid rgba(255,255,255,0.06); text-align: center; font-size: 12px; color: #64748b; line-height: 1.5; }
    .btn { display: inline-block; background: linear-gradient(135deg, #3b82f6, #2563eb); color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 700; font-size: 14px; margin-top: 12px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); }
  </style>
</head>
<body>
  <div style="display:none; font-size:1px; color:#0b0f19; line-height:1px; max-height:0px; max-width:0px; opacity:0; overflow:hidden;">
    ${preheader || title}
  </div>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <div class="logo-badge">NIPIX</div>
        <div class="brand-sub">AI Scholar Platform</div>
      </div>
      <div class="content">
        ${bodyContent}
        ${alertBox ? `<div class="alert-box">${alertBox}</div>` : ''}
      </div>
      <div class="footer">
        <p style="margin: 0 0 6px 0;">This email was sent automatically by Nipix AI Scholar Security.</p>
        <p style="margin: 0 0 6px 0;">If you did not initiate this request, please secure your account immediately.</p>
        <p style="margin: 0; font-size: 11px; color: #475569;">© ${new Date().getFullYear()} Nipix AI Scholar • All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;
};

/**
 * Universal Sender Dispatcher
 */
const sendMail = async ({ to, subject, html, text, eventType }) => {
  const fromEmail = process.env.EMAIL_FROM || process.env.BREVO_SENDER_EMAIL || 'noreply@nipix.app';
  const fromName = process.env.EMAIL_FROM_NAME || 'Nipix AI Scholar';

  // 1. Try Brevo REST API (if BREVO_API_KEY is present)
  const brevoApiKey = process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY;
  if (brevoApiKey) {
    try {
      const response = await axios.post(
        'https://api.brevo.com/v3/smtp/email',
        {
          sender: { name: fromName, email: fromEmail },
          to: [{ email: to }],
          subject,
          htmlContent: html,
          textContent: text
        },
        {
          headers: {
            'api-key': brevoApiKey,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );
      logDelivery({ eventType, recipient: to, status: 'SENT', messageId: response.data?.messageId || 'brevo-sent' });
      return { success: true, provider: 'brevo', messageId: response.data?.messageId };
    } catch (brevoErr) {
      console.warn('⚠️ Brevo API delivery failed, attempting fallback:', brevoErr.response?.data || brevoErr.message);
      logDelivery({ eventType, recipient: to, status: 'FAILED', error: brevoErr });
    }
  }

  // 2. Try SMTP via nodemailer (if SMTP_HOST is present)
  if (nodemailer && process.env.SMTP_HOST && process.env.SMTP_USER) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS || process.env.SMTP_PASSWORD
        },
        tls: { rejectUnauthorized: false }
      });

      const info = await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to,
        subject,
        text,
        html
      });
      logDelivery({ eventType, recipient: to, status: 'SENT', messageId: info.messageId });
      return { success: true, provider: 'smtp', messageId: info.messageId };
    } catch (smtpErr) {
      console.warn('⚠️ SMTP delivery failed:', smtpErr.message);
      logDelivery({ eventType, recipient: to, status: 'FAILED', error: smtpErr });
    }
  }

  // 3. Mock Delivery (Dev / Safe Testing mode when provider not configured)
  console.log(`\n================== [NIPX MOCK EMAIL TRANSMISSION] ==================`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Event: ${eventType}`);
  console.log(`Summary:\n${text}`);
  console.log(`====================================================================\n`);
  logDelivery({ eventType, recipient: to, status: 'MOCKED', messageId: 'mock-' + Date.now() });
  return { success: true, provider: 'mock', messageId: 'mock-' + Date.now() };
};

const emailService = {
  // 1. Email Verification Code (Registration)
  sendVerificationEmail: async ({ email, code, name = 'Learner' }) => {
    const subject = 'Nipix — Verify Your Email';
    const bodyContent = `
      <h2>Verify Your Nipix Account</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>Welcome to <strong>Nipix AI Scholar</strong>! To complete your registration and activate your learning workspace, please enter the 6-digit verification code below:</p>
      <div class="code-box">
        <div class="code-digits">${code}</div>
      </div>
      <p style="font-size: 13px; color: #94a3b8; text-align: center;">This verification code is valid for <strong>10 minutes</strong>. Do not share this code with anyone.</p>
    `;
    const alertBox = 'Security notice: Nipix representatives will never ask for your verification code.';
    const text = `Nipix AI Scholar Email Verification\n\nHello ${name},\nYour verification code is: ${code}\nThis code expires in 10 minutes.\nDo not share this code.`;
    const html = buildNipixEmailHtml({ title: subject, preheader: `Your verification code is ${code}`, bodyContent, alertBox });
    return await sendMail({ to: email, subject, html, text, eventType: 'REGISTRATION_OTP' });
  },

  // 2. Welcome Email (After Email Verification or Google Sign-In)
  sendWelcomeEmail: async ({ email, name = 'Learner', isGoogle = false }) => {
    const subject = 'Nipix — Welcome to Nipix';
    const bodyContent = `
      <h2>Welcome to Nipix AI Scholar 🎓</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>${isGoogle
        ? 'Your Google account has been successfully connected and your Nipix scholar account is now registered and verified.'
        : 'Your Nipix account has been successfully registered and your email has been verified.'}</p>
      <p>You can now explore courses, access interactive study materials, practice Japanese across JLPT tracks, and converse with all 7 AI specialized bots.</p>
      <p>Enjoy your learning journey with Nipix!</p>
      <div style="text-align: center; margin-top: 24px;">
        <a href="${process.env.CLIENT_URL || 'https://nipix-media.vercel.app'}/study" class="btn">Explore Courses & AI Bots</a>
      </div>
    `;
    const text = `Welcome to Nipix AI Scholar!\n\nHello ${name},\nYour account has been successfully verified. You can now access courses, study materials, and AI tutors.\nVisit: ${process.env.CLIENT_URL || 'https://nipix-media.vercel.app'}`;
    const html = buildNipixEmailHtml({ title: subject, preheader: 'Welcome to your Nipix AI Scholar workspace', bodyContent });
    return await sendMail({ to: email, subject, html, text, eventType: 'WELCOME' });
  },

  // 3. New Login Detected Notification
  sendLoginNotificationEmail: async ({ email, name = 'Scholar', time = new Date().toLocaleString(), ip = 'Unknown IP', userAgent = 'Unknown Browser' }) => {
    const subject = 'Nipix — New Login Detected';
    const bodyContent = `
      <h2>Security Alert: New Login Detected</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>We detected a successful sign-in to your Nipix account:</p>
      <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 16px; margin: 16px 0; font-size: 14px;">
        <p style="margin: 4px 0;"><strong>Date & Time:</strong> ${time}</p>
        <p style="margin: 4px 0;"><strong>Device / Browser:</strong> ${userAgent}</p>
        <p style="margin: 4px 0;"><strong>IP Address:</strong> ${ip}</p>
      </div>
      <p>If this was you, you can safely disregard this email.</p>
    `;
    const alertBox = '⚠️ If you did not perform this login, your account may be compromised. Please reset your password immediately.';
    const text = `Security Alert: New Login Detected\n\nHello ${name},\nA login to your Nipix account was recorded at ${time} from ${userAgent} (${ip}).\nIf this was not you, please reset your password immediately.`;
    const html = buildNipixEmailHtml({ title: subject, preheader: 'A new sign-in to your account was detected', bodyContent, alertBox });
    return await sendMail({ to: email, subject, html, text, eventType: 'LOGIN_NOTIFICATION' });
  },

  // 4. Password Reset OTP
  sendPasswordResetOtpEmail: async ({ email, code, name = 'Scholar' }) => {
    const subject = 'Nipix — Your Password Reset Code';
    const bodyContent = `
      <h2>Reset Your Nipix Password</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>We received a request to reset the password for your Nipix account. Enter the 6-digit one-time password below to proceed with setting a new password:</p>
      <div class="code-box">
        <div class="code-digits">${code}</div>
      </div>
      <p style="font-size: 13px; color: #94a3b8; text-align: center;">This code expires in <strong>10 minutes</strong>. Your password will NOT change until you complete the verification process.</p>
    `;
    const alertBox = 'Security Warning: If you did not request a password reset, please ignore this email. Your current password remains secure.';
    const text = `Nipix Password Reset\n\nHello ${name},\nYour password reset code is: ${code}\nThis code expires in 10 minutes.\nIf you did not request this, please ignore this email.`;
    const html = buildNipixEmailHtml({ title: subject, preheader: `Your reset code is ${code}`, bodyContent, alertBox });
    return await sendMail({ to: email, subject, html, text, eventType: 'PASSWORD_RESET_OTP' });
  },

  // 5. Password Changed Notification
  sendPasswordChangedEmail: async ({ email, name = 'Scholar', time = new Date().toLocaleString() }) => {
    const subject = 'Nipix — Password Changed Successfully';
    const bodyContent = `
      <h2>Password Updated Successfully</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>The password for your Nipix account was successfully changed on <strong>${time}</strong>.</p>
      <p>You can now sign in using your new credentials.</p>
    `;
    const alertBox = '⚠️ If you did NOT change your password, please contact Nipix Support and initiate account recovery immediately.';
    const text = `Nipix Account Notice\n\nHello ${name},\nYour password was changed on ${time}.\nIf you did not perform this change, please contact support immediately.`;
    const html = buildNipixEmailHtml({ title: subject, preheader: 'Your Nipix account password was changed', bodyContent, alertBox });
    return await sendMail({ to: email, subject, html, text, eventType: 'PASSWORD_CHANGED' });
  },

  // 6. Account / Security Update Notification
  sendAccountUpdatedEmail: async ({ email, name = 'Scholar', changeDescription = 'Security settings updated', time = new Date().toLocaleString() }) => {
    const subject = 'Nipix — Your Account Was Updated';
    const bodyContent = `
      <h2>Account Security Notification</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>An update was made to your Nipix account:</p>
      <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 16px; margin: 16px 0;">
        <p style="margin: 4px 0;"><strong>Update:</strong> ${changeDescription}</p>
        <p style="margin: 4px 0;"><strong>Timestamp:</strong> ${time}</p>
      </div>
      <p>If you authorized this change, no further action is necessary.</p>
    `;
    const alertBox = 'If you did not make this change, please sign in to review your profile and update your password immediately.';
    const text = `Nipix Account Update\n\nHello ${name},\nAn update was made: ${changeDescription} at ${time}.\nIf you did not authorize this, please review your account settings.`;
    const html = buildNipixEmailHtml({ title: subject, preheader: 'Your Nipix account details were updated', bodyContent, alertBox });
    return await sendMail({ to: email, subject, html, text, eventType: 'ACCOUNT_UPDATED' });
  },

  // Access audit logs
  getDeliveryLogs: () => emailDeliveryLogs
};

module.exports = emailService;
