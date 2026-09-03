import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser } from '../store/slices/authSlice';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, AtSign, Eye, EyeOff, Sparkles, AlertCircle, KeyRound, Shield } from 'lucide-react';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', full_name: '' });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.auth);

  // Check if user came from the Secret Chat / Hidden Chat icon
  const queryParams = new URLSearchParams(location.search);
  const redirectTarget = queryParams.get('redirect');
  const isHiddenChatRedirect = redirectTarget === 'hidden-chat';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let result;
    if (isRegister) {
      result = await dispatch(registerUser(formData));
    } else {
      result = await dispatch(loginUser({ email: formData.email, password: formData.password }));
    }

    if (result.meta.requestStatus === 'fulfilled') {
      // AFTER SUCCESSFUL LOGIN: Take the user directly to the Hidden Chat / Secret Chat area!
      if (isHiddenChatRedirect) {
        navigate('/chat?view=hidden');
      } else {
        navigate('/home');
      }
    }
  };

  const getErrorMessage = () => {
    if (!error) return null;
    if (typeof error === 'string') return error;
    return error.message || error.msg || error.error || 'Authentication failed';
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
        
        {/* Hidden Chat Security Notice Banner (If clicked secret chat icon) */}
        {isHiddenChatRedirect && (
          <div style={{
            background: 'rgba(5, 150, 105, 0.1)',
            border: '1px solid rgba(5, 150, 105, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 14px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'var(--accent-emerald)',
            fontSize: '0.84rem',
            fontWeight: '600'
          }}>
            <Shield size={18} />
            <span>Secure Channel Authentication — Log in to decrypt and access the hidden chat.</span>
          </div>
        )}

        {/* Brand & Title */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: isHiddenChatRedirect ? 'var(--vault-gradient)' : 'var(--scholar-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto'
          }}>
            {isHiddenChatRedirect ? <KeyRound size={22} color="#fff" /> : <Sparkles size={22} color="#fff" />}
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 6px 0' }}>
            {isHiddenChatRedirect ? 'Vault Channel Login' : (isRegister ? 'Create Scholar Account' : 'Sign In to Nipix')}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', margin: 0 }}>
            {isHiddenChatRedirect
              ? 'Authentication is required to unlock your encrypted conversations.'
              : (isRegister ? 'Join students and researchers worldwide.' : 'Welcome back to your study workspace.')}
          </p>
        </div>

        {/* Tab Toggle */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-input)',
          borderRadius: 'var(--radius-sm)',
          padding: '4px',
          marginBottom: '22px',
          border: '1px solid var(--border-color)'
        }}>
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            style={{
              flex: 1,
              padding: '9px',
              border: 'none',
              borderRadius: '6px',
              background: !isRegister ? 'var(--accent-blue)' : 'transparent',
              color: !isRegister ? '#fff' : 'var(--text-muted)',
              fontWeight: '700',
              fontSize: '0.86rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => setIsRegister(true)}
            style={{
              flex: 1,
              padding: '9px',
              border: 'none',
              borderRadius: '6px',
              background: isRegister ? 'var(--accent-blue)' : 'transparent',
              color: isRegister ? '#fff' : 'var(--text-muted)',
              fontWeight: '700',
              fontSize: '0.86rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
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
            <span>{getErrorMessage()}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {isRegister && (
            <>
              {/* Full Name */}
              <div style={{ position: 'relative' }}>
                <UserIcon size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.full_name}
                  onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                  required
                  className="input-field"
                  style={{ paddingLeft: '42px' }}
                />
              </div>

              {/* Username */}
              <div style={{ position: 'relative' }}>
                <AtSign size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                  required
                  className="input-field"
                  style={{ paddingLeft: '42px' }}
                />
              </div>
            </>
          )}

          {/* Email */}
          <div style={{ position: 'relative' }}>
            <Mail size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
              className="input-field"
              style={{ paddingLeft: '42px' }}
            />
          </div>

          {/* Password */}
          <div style={{ position: 'relative' }}>
            <Lock size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              required
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

          {/* Forgot Password Link */}
          {!isRegister && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-4px' }}>
              <button
                type="button"
                onClick={() => alert('Password reset link has been dispatched to your email address.')}
                style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '600' }}
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={isHiddenChatRedirect ? "btn-vault" : "btn-primary"}
            style={{ width: '100%', padding: '12px', marginTop: '6px', fontSize: '0.92rem' }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Sparkles size={18} className="animate-spin" /> Verifying Credentials...
              </span>
            ) : (isHiddenChatRedirect ? 'Authenticate & Open Hidden Chat' : (isRegister ? 'Complete Registration' : 'Sign In'))}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '22px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
          <span
            onClick={() => setIsRegister(!isRegister)}
            style={{ color: 'var(--accent-blue)', cursor: 'pointer', fontWeight: '700', marginLeft: '4px' }}
          >
            {isRegister ? 'Log In' : 'Create Account'}
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;