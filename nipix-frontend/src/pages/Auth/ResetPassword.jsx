import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import NipixLogo from '../../components/NipixLogo';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email') || '';
  const resetToken = queryParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setErrorMessage('Please fill in all password fields.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }
    if (!resetToken) {
      setErrorMessage('Missing password reset session token. Please restart password recovery.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      await api.post('/auth/reset-password', {
        email: email.trim(),
        resetToken,
        newPassword
      });

      // Navigates to Step 4: Password Updated Confirmation
      navigate('/password-updated');
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to update password. Please try again.');
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
            Set New Password
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', margin: 0 }}>
            Choose a strong password to protect your Nipix scholar account.
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
          {/* New Password */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px' }}>
              New Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                autoFocus
                className="input-field"
                style={{ paddingLeft: '42px', paddingRight: '42px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Confirm New Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="input-field"
                style={{ paddingLeft: '42px', paddingRight: '42px' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Password Match Indicator */}
          {newPassword && confirmPassword && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: newPassword === confirmPassword ? '#10b981' : '#f87171' }}>
              {newPassword === confirmPassword ? (
                <>
                  <CheckCircle2 size={14} />
                  <span>Passwords match</span>
                </>
              ) : (
                <>
                  <AlertCircle size={14} />
                  <span>Passwords do not match</span>
                </>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
            className="btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '6px', fontSize: '0.92rem' }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Sparkles size={18} className="animate-spin" /> Updating Password...
              </span>
            ) : 'Update Password'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '22px', fontSize: '0.86rem' }}>
          <Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
            Cancel & Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
