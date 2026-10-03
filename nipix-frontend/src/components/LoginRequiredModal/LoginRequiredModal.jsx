import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, LogIn, UserPlus, X, Sparkles, GraduationCap } from 'lucide-react';
import NipixLogo from '../NipixLogo';

const LoginRequiredModal = ({
  isOpen,
  onClose,
  title = 'Authentication Required',
  description = 'Sign in to access interactive lessons, take graded tests, submit practical tasks, track learning progress, and consult AI tutors.',
  returnUrl = '/study'
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSignIn = () => {
    onClose && onClose();
    const target = returnUrl ? `/login?redirect=${encodeURIComponent(returnUrl)}` : '/login';
    navigate(target);
  };

  const handleRegister = () => {
    onClose && onClose();
    const target = returnUrl ? `/register?redirect=${encodeURIComponent(returnUrl)}` : '/register';
    navigate(target);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5, 7, 15, 0.82)',
        backdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '32px 28px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          background: 'var(--bg-primary)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
          position: 'relative',
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        {/* Dismiss Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-dim)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Close prompt"
        >
          <X size={18} />
        </button>

        {/* Brand Icon & Heading */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            <div style={{ position: 'relative' }}>
              <NipixLogo size={58} style={{ borderRadius: '14px' }} glow />
              <div
                style={{
                  position: 'absolute',
                  bottom: '-4px',
                  right: '-4px',
                  background: 'var(--accent-blue)',
                  borderRadius: '50%',
                  width: '22px',
                  height: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
                }}
              >
                <Lock size={12} color="#fff" />
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 6px 0' }}>
            {title}
          </h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
            {description}
          </p>
        </div>

        {/* Benefits Box */}
        <div
          style={{
            background: 'rgba(59, 130, 246, 0.06)',
            border: '1px solid rgba(59, 130, 246, 0.15)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            marginBottom: '22px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            <GraduationCap size={14} color="var(--accent-blue)" />
            <span>Interactive lessons & hands-on exercises</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            <Sparkles size={14} color="var(--accent-cyan)" />
            <span>AI chat bots & Sakura Japanese Sensei</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            <Lock size={14} color="var(--accent-emerald)" />
            <span>Persistent progress, milestones & score tracking</span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            type="button"
            onClick={handleSignIn}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '0.92rem',
              justifyContent: 'center',
              gap: '8px',
              fontWeight: '700'
            }}
          >
            <LogIn size={16} />
            <span>Sign In to Continue</span>
          </button>

          <button
            type="button"
            onClick={handleRegister}
            className="btn-secondary"
            style={{
              width: '100%',
              padding: '11px',
              fontSize: '0.88rem',
              justifyContent: 'center',
              gap: '8px',
              fontWeight: '600'
            }}
          >
            <UserPlus size={16} />
            <span>Create Free Account</span>
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '14px', fontSize: '0.75rem', color: 'var(--text-dim)', margin: '14px 0 0 0' }}>
          You can continue browsing public course overviews at any time.
        </p>
      </div>
    </div>
  );
};

export default LoginRequiredModal;
