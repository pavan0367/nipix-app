import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Settings as SettingsIcon, User, Lock, Shield, Bell, Check } from 'lucide-react';
import api from '../../services/api';

const Settings = () => {
  const currentUser = useSelector((state) => state.auth?.user);
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
    <div style={{ maxWidth: '640px', margin: '30px auto', padding: '0 16px' }}>
      <div className="glass-card" style={{ padding: '32px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#fff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <SettingsIcon size={22} color="var(--accent-blue)" /> Account Settings
        </h2>

        {savedSuccess && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            color: '#4ade80',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '20px',
            fontSize: '0.88rem'
          }}>
            <Check size={18} /> Settings saved successfully!
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* User Profile Info */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Username
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
              Bio
            </label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
              className="input-field"
              style={{ resize: 'none' }}
              placeholder="Tell Nipix about yourself..."
            />
          </div>

          {/* Privacy Toggle (SRS FR-23) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border-color)'
          }}>
            <div>
              <p style={{ fontWeight: '600', fontSize: '0.95rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={16} color="var(--accent-blue)" /> Private Account
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                When your account is private, only approved followers can see your photos and reels.
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
            {loading ? 'Saving Changes...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
