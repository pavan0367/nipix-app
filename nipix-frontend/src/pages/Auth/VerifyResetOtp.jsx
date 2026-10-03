import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { KeyRound, Mail, Sparkles, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import NipixLogo from '../../components/NipixLogo';

const VerifyResetOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const emailParam = queryParams.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resendStatus, setResendStatus] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!code.trim() || code.trim().length !== 6) {
      setErrorMessage('Please enter the complete 6-digit code.');
      return;
    }
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await api.post('/auth/verify-reset-otp', {
        email: email.trim(),
        code: code.trim()
      });

      if (res.data?.resetToken) {
        // Navigates to dedicated Step 3: Set New Password page
        navigate(`/reset-password?email=${encodeURIComponent(email.trim())}&token=${encodeURIComponent(res.data.resetToken)}`);
      } else {
        setErrorMessage('Verification failed. Please try again.');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Invalid or expired code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setResendStatus('Dispatching new code...');
    setErrorMessage('');
    try {
      await api.post('/auth/forgot-password', { email: email.trim() });
      setResendStatus('A fresh reset code has been sent to your email.');
      setCanResend(false);
      setResendTimer(60);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to resend code.');
      setResendStatus('');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      padding: '24px'
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '36px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            <NipixLogo size={70} style={{ borderRadius: '16px' }} glow />
          </div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 6px 0' }}>
            Enter Recovery Code
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', margin: 0 }}>
            Enter the 6-digit password reset code sent to:
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--accent-blue)',
            fontWeight: '700',
            fontSize: '0.9rem',
            marginTop: '4px',
            background: 'rgba(59, 130, 246, 0.1)',
            padding: '4px 12px',
            borderRadius: '20px'
          }}>
            <Mail size={14} />
            <span>{email || 'your email'}</span>
          </div>
        </div>

        {errorMessage && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '18px',
            fontSize: '0.84rem'
          }}>
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {resendStatus && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#10b981',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '18px',
            fontSize: '0.84rem'
          }}>
            <KeyRound size={16} />
            <span>{resendStatus}</span>
          </div>
        )}

        {/* Note: STRICTLY ONLY OTP INPUT, ZERO PASSWORD FIELDS PER REQUIREMENTS */}
        <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!emailParam && (
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                placeholder="Confirm your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
                style={{ paddingLeft: '42px' }}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              6-Digit Reset Code
            </label>
            <input
              type="text"
              maxLength={6}
              placeholder="••••••"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
              autoFocus
              required
              className="input-field"
              style={{
                textAlign: 'center',
                fontSize: '1.6rem',
                letterSpacing: '8px',
                fontWeight: '800',
                padding: '12px'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '6px', fontSize: '0.92rem' }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Sparkles size={18} className="animate-spin" /> Verifying Code...
              </span>
            ) : 'Verify Code & Set Password'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '22px', fontSize: '0.84rem' }}>
          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend}
            style={{
              background: 'none',
              border: 'none',
              color: canResend ? 'var(--accent-blue)' : 'var(--text-dim)',
              cursor: canResend ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: '600'
            }}
          >
            <RefreshCw size={14} />
            <span>{canResend ? 'Resend Code' : `Resend in ${resendTimer}s`}</span>
          </button>

          <Link to="/forgot-password" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowLeft size={14} /> Change Email
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyResetOtp;
