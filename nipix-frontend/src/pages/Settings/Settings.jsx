import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Settings as SettingsIcon, Sun, Moon, Laptop, Lock, Check, LogIn } from 'lucide-react';
import api from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import NipixLogo from '../../components/NipixLogo';

const Settings = () => {
  const currentUser = useSelector((state) => state.auth?.user);
  const { themeMode, changeTheme } = useTheme();

  const [bio, setBio] = useState(currentUser?.bio || '');
  const [fullName, setFullName] = useState(currentUser?.full_name || '');
  const [isPrivate, setIsPrivate] = useState(currentUser?.is_private || false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSavedSuccess(false);

    try {
      if (currentUser?.id) {
        await api.put(`/users/${currentUser.id}`, {
          bio,
          full_name: fullName,
          is_private: isPrivate,
        });
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update settings:', err);
      alert(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-theme-settings" style={{ minHeight: '100vh', padding: '30px 16px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
            <NipixLogo size={46} style={{ borderRadius: '10px' }} glow />
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Platform & Account Settings
              </h2>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Nipix AI Scholar Workspace Preferences
              </p>
            </div>
          </div>

          {/* ========================================================== */}
          {/* THEME SELECTION: LIGHT / DARK / SAME AS DEVICE             */}
          {/* ========================================================== */}
          <div style={{
            marginBottom: '28px',
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)'
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>
              Appearance Theme
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Choose your reading comfort. Text colors automatically adjust to basic black in light mode and basic white in dark mode.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {/* 1. Light Mode */}
              <button
                type="button"
                onClick={() => changeTheme('light')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: themeMode === 'light' ? '2px solid var(--accent-blue)' : '1px solid var(--border-color)',
                  background: themeMode === 'light' ? 'rgba(37, 99, 235, 0.1)' : 'var(--bg-card)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '0.86rem'
                }}
              >
                <Sun size={20} color="var(--accent-amber)" />
                <span>☀ Light</span>
              </button>

              {/* 2. Dark Mode */}
              <button
                type="button"
                onClick={() => changeTheme('dark')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: themeMode === 'dark' ? '2px solid var(--accent-blue)' : '1px solid var(--border-color)',
                  background: themeMode === 'dark' ? 'rgba(37, 99, 235, 0.1)' : 'var(--bg-card)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '0.86rem'
                }}
              >
                <Moon size={20} color="var(--accent-purple)" />
                <span>🌙 Dark</span>
              </button>

              {/* 3. Same as Device */}
              <button
                type="button"
                onClick={() => changeTheme('system')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: themeMode === 'system' ? '2px solid var(--accent-blue)' : '1px solid var(--border-color)',
                  background: themeMode === 'system' ? 'rgba(37, 99, 235, 0.1)' : 'var(--bg-card)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '0.86rem'
                }}
              >
                <Laptop size={20} color="var(--accent-cyan)" />
                <span>🖥 Device</span>
              </button>
            </div>
          </div>

          {savedSuccess && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(34, 197, 94, 0.12)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              color: '#16a34a',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '20px',
              fontSize: '0.88rem'
            }}>
              <Check size={18} /> Settings saved successfully!
            </div>
          )}

          {currentUser ? (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Scholar Username
                </label>
                <input
                  type="text"
                  value={currentUser?.username || ''}
                  disabled
                  className="input-field"
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Scholar Bio
                </label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={3}
                  className="input-field"
                  style={{ resize: 'none' }}
                  placeholder="Share your research interests and academic focuses..."
                />
              </div>

              {/* Privacy Toggle */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)'
              }}>
                <div>
                  <p style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Lock size={16} color="var(--accent-blue)" /> Private Scholar Profile
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                    When enabled, only verified peers can view your study materials and notes.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={e => setIsPrivate(e.target.checked)}
                  style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--accent-blue)' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', padding: '12px', marginTop: '8px' }}
              >
                {loading ? 'Saving Changes...' : 'Save Profile Settings'}
              </button>
            </form>
          ) : (
            <div style={{
              padding: '24px 20px',
              textAlign: 'center',
              background: 'var(--bg-input)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
                Sign in to your Nipix account to manage profile details and personal privacy preferences.
              </p>
              <Link to="/login" className="btn-secondary" style={{ padding: '8px 20px', fontSize: '0.84rem', gap: '6px' }}>
                <LogIn size={15} /> Sign In to Edit Profile
              </Link>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
            <NipixLogo size={24} style={{ borderRadius: '6px', marginBottom: '6px' }} />
            <div>Nipix AI Scholar Platform • Learn • Explore • Create • Beyond</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
