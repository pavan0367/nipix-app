import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import NipixLogo from '../../components/NipixLogo';

const PasswordUpdated = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      padding: '24px'
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '40px 32px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <NipixLogo size={70} style={{ borderRadius: '16px' }} glow />
        </div>

        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '2px solid rgba(16, 185, 129, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto',
          color: '#10b981'
        }}>
          <CheckCircle2 size={36} />
        </div>

        <h1 style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 10px 0' }}>
          Password Updated Successfully
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', margin: '0 0 28px 0' }}>
          Your Nipix account password has been updated securely. A confirmation notification has been sent to your verified email address.
        </p>

        <Link
          to="/login"
          className="btn-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '12px',
            fontSize: '0.94rem',
            textDecoration: 'none'
          }}
        >
          <span>Go to Login</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default PasswordUpdated;
