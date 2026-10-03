import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, KeyRound, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import NipixLogo from '../../components/NipixLogo';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setErrorMessage('');

    try {
      await api.post('/auth/forgot-password', { email: email.trim() });
      // Navigate to dedicated Step 2: Verify Reset OTP page
      navigate(`/verify-reset-otp?email=${encodeURIComponent(email.trim())}`);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to dispatch reset code. Please try again.');
    } finally {
      setLoading(false);
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
            Reset Password
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', margin: 0 }}>
            Enter your account's verified email address to receive a 6-digit password recovery code.
          </p>
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Mail size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="input-field"
              style={{ paddingLeft: '42px' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '6px', fontSize: '0.92rem' }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Sparkles size={18} className="animate-spin" /> Dispatching Code...
              </span>
            ) : 'Send Reset Code'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '22px', fontSize: '0.86rem' }}>
          <Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
