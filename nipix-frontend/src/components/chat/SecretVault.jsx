import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Lock,
  KeyRound,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Eye,
  EyeOff,
  Sparkles,
  Phone,
  Video,
  FileText,
  Image as ImageIcon,
  Search,
  Settings as SettingsIcon,
  FolderArchive,
  Star,
  Send,
  Paperclip,
  Mic,
  Camera,
  LogOut,
  X,
  PhoneOff,
  MicOff,
  VideoOff,
  UserCheck
} from 'lucide-react';
import vaultApi from '../../services/vaultApi';
import { getCurrentSystemTime } from '../../pages/Chat';

// Mock Encrypted Transmissions for the Unlocked Vault Dashboard
const INITIAL_VAULT_CHATS = [
  {
    id: 'vault-contact-1',
    name: 'Dr. Katherine Vance',
    role: 'Lead Quantum Architect',
    avatar: 'V',
    online: true,
    lastTime: '5:20 PM',
    unread: 1,
    messages: [
      {
        id: 'vm-1',
        sender: 'Dr. Katherine Vance',
        isUser: false,
        text: 'Decrypted Channel Active: The topological qubit test benchmarks have matched theoretical parity. Access token for Shard 4 is 0x7F4A92B.',
        time: '5:18 PM'
      },
      {
        id: 'vm-2',
        sender: 'You',
        isUser: true,
        text: 'Received and confirmed. Synchronizing neural weights to the distributed vault node.',
        time: '5:19 PM'
      },
      {
        id: 'vm-3',
        sender: 'Dr. Katherine Vance',
        isUser: false,
        text: 'Please review the attached cryptographic lattice before our 6 PM sync.',
        time: '5:20 PM'
      }
    ]
  },
  {
    id: 'vault-contact-2',
    name: 'Cipher_09 Protocol',
    role: 'Security Fellow',
    avatar: 'C',
    online: true,
    lastTime: '4:45 PM',
    unread: 0,
    messages: [
      {
        id: 'vm-c1',
        sender: 'Cipher_09 Protocol',
        isUser: false,
        text: 'Zero-knowledge proofs generated for all study vaults. Zero plain-text telemetry detected.',
        time: '4:45 PM'
      }
    ]
  },
  {
    id: 'vault-contact-3',
    name: 'NovaMind Core',
    role: 'Autonomous Reasoning Node',
    avatar: 'N',
    online: false,
    lastTime: 'Yesterday',
    unread: 0,
    messages: [
      {
        id: 'vm-n1',
        sender: 'NovaMind Core',
        isUser: false,
        text: 'Archived dataset shard 12 is synchronized and available in Shared Files.',
        time: 'Yesterday'
      }
    ]
  }
];

const VAULT_SHARED_FILES = [
  { id: 'f-1', name: 'Cryptographic_Lattice_v4.pdf', type: 'doc', size: '2.4 MB', date: 'Oct 4, 2026' },
  { id: 'f-2', name: 'Quantum_Circuit_Diagram.png', type: 'image', size: '4.8 MB', date: 'Oct 3, 2026' },
  { id: 'f-3', name: 'Telemetry_Dump_Shard09.json', type: 'data', size: '820 KB', date: 'Oct 2, 2026' },
  { id: 'f-4', name: 'Research_Notes_VoiceMemo.wav', type: 'audio', size: '1.1 MB', date: 'Oct 1, 2026' }
];

const SecretVault = ({ currentUser, onClose }) => {
  // Vault Navigation State: 'LOADING' | 'PIN_CREATE' | 'PIN_ENTRY' | 'FORGOT_PIN_DATE' | 'SET_NEW_PIN' | 'DASHBOARD'
  const [viewState, setViewState] = useState('LOADING');

  // Vault Server Config Status
  const [vaultStatus, setVaultStatus] = useState({
    hasPin: false,
    recoveryMethod: null,
    isLocked: false,
    lockRemainingSeconds: 0
  });

  // UI Form States
  const [pinInput, setPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [recoveryMethod, setRecoveryMethod] = useState('birthday'); // 'birthday' | 'anniversary'
  const [recoveryDate, setRecoveryDate] = useState('');
  const [showPinMask, setShowPinMask] = useState(false);

  // Recovery Verification State
  const [resetToken, setResetToken] = useState(null);
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Dashboard Active State
  const [activeTab, setActiveTab] = useState('chats'); // 'chats' | 'search' | 'calls' | 'media' | 'settings'
  const [activeContact, setActiveContact] = useState(INITIAL_VAULT_CHATS[0]);
  const [vaultChats, setVaultChats] = useState(INITIAL_VAULT_CHATS);
  const [messageText, setMessageText] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  // Call simulation modal states
  const [activeCall, setActiveCall] = useState(null); // { type: 'audio' | 'video', contact: ... } | null
  const [callMuted, setCallMuted] = useState(false);
  const [callVideoOff, setCallVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // Settings sub-states
  const [settingsCurrentPin, setSettingsCurrentPin] = useState('');
  const [settingsNewPin, setSettingsNewPin] = useState('');
  const [settingsConfirmPin, setSettingsConfirmPin] = useState('');
  const [settingsRecMethod, setSettingsRecMethod] = useState('birthday');
  const [settingsRecDate, setSettingsRecDate] = useState('');
  const [settingsPinSuccess, setSettingsPinSuccess] = useState(null);
  const [settingsRecSuccess, setSettingsRecSuccess] = useState(null);

  // Fetch status on initial mount
  useEffect(() => {
    fetchVaultStatus();
  }, []);

  // Call timer effect
  useEffect(() => {
    let timer = null;
    if (activeCall) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => timer && clearInterval(timer);
  }, [activeCall]);

  const fetchVaultStatus = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await vaultApi.getStatus();
      setVaultStatus(data);
      if (data.hasPin) {
        setViewState('PIN_ENTRY');
      } else {
        setViewState('PIN_CREATE');
      }
    } catch (err) {
      console.error('Failed to get vault status:', err);
      // Fallback to PIN_CREATE if new or error
      setViewState('PIN_CREATE');
    } finally {
      setLoading(false);
    }
  };

  // --- 1. NEW USER: CREATE PIN + RECOVERY METHOD ---
  const handleCreatePin = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!pinInput || !/^\d{4}$/.test(pinInput.trim())) {
      setErrorMsg('Secret Vault PIN must be exactly 4 numeric digits.');
      return;
    }
    if (pinInput.trim() !== confirmPinInput.trim()) {
      setErrorMsg('PIN and PIN confirmation do not match.');
      return;
    }
    if (!recoveryDate) {
      setErrorMsg(`Please enter your ${recoveryMethod === 'birthday' ? 'Birthday' : 'Anniversary Date'} for PIN recovery.`);
      return;
    }

    setLoading(true);
    try {
      await vaultApi.setup({
        pin: pinInput.trim(),
        confirmPin: confirmPinInput.trim(),
        recoveryMethod,
        recoveryDate
      });
      setSuccessMsg('Secret Vault configured successfully!');
      // Transition to Dashboard immediately
      setTimeout(() => {
        setViewState('DASHBOARD');
        setVaultStatus((prev) => ({ ...prev, hasPin: true, recoveryMethod }));
        setPinInput('');
        setConfirmPinInput('');
        setRecoveryDate('');
      }, 600);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to setup Secret Vault.');
    } finally {
      setLoading(false);
    }
  };

  // --- 2. EXISTING USER: UNLOCK WITH PIN ---
  const handleUnlockPin = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!pinInput || !/^\d{4}$/.test(pinInput.trim())) {
      setErrorMsg('Please enter your 4-digit PIN.');
      return;
    }

    setLoading(true);
    try {
      await vaultApi.unlock(pinInput.trim());
      setPinInput('');
      setViewState('DASHBOARD');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Incorrect PIN.');
    } finally {
      setLoading(false);
    }
  };

  // --- 3. FORGOT PIN: DATE VERIFICATION (NO OTP) ---
  const handleVerifyDate = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!recoveryDate) {
      setErrorMsg('Please select your registered recovery date.');
      return;
    }

    setLoading(true);
    try {
      const res = await vaultApi.verifyRecovery({
        recoveryMethod,
        recoveryDate
      });
      if (res.resetToken) {
        setResetToken(res.resetToken);
        setViewState('SET_NEW_PIN');
        setRecoveryDate('');
      } else {
        setErrorMsg('Recovery details do not match.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Recovery details do not match.');
    } finally {
      setLoading(false);
    }
  };

  // --- 4. SET NEW 4-DIGIT PIN AFTER SUCCESSFUL DATE VERIFICATION ---
  const handleResetPinSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!newPin || !/^\d{4}$/.test(newPin.trim())) {
      setErrorMsg('New PIN must be exactly 4 digits.');
      return;
    }
    if (newPin.trim() !== confirmNewPin.trim()) {
      setErrorMsg('New PIN and confirmation do not match.');
      return;
    }

    setLoading(true);
    try {
      await vaultApi.resetPin({
        resetToken,
        newPin: newPin.trim(),
        confirmPin: confirmNewPin.trim()
      });
      setSuccessMsg('PIN reset successfully! Opening Secret Vault...');
      setTimeout(() => {
        setNewPin('');
        setConfirmNewPin('');
        setResetToken(null);
        setViewState('DASHBOARD');
      }, 700);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to reset PIN.');
    } finally {
      setLoading(false);
    }
  };

  // --- 5. DASHBOARD ACTIONS: SEND MESSAGE ---
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activeContact) return;

    const newMsg = {
      id: `vm-${Date.now()}`,
      sender: 'You',
      isUser: true,
      text: messageText.trim(),
      time: getCurrentSystemTime()
    };

    setVaultChats((prev) =>
      prev.map((c) =>
        c.id === activeContact.id
          ? { ...c, messages: [...c.messages, newMsg], lastTime: newMsg.time }
          : c
      )
    );
    setActiveContact((prev) => ({
      ...prev,
      messages: [...prev.messages, newMsg],
      lastTime: newMsg.time
    }));
    setMessageText('');
  };

  // --- 6. SETTINGS: CHANGE PIN ---
  const handleSettingsChangePin = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSettingsPinSuccess(null);

    if (!settingsNewPin || !/^\d{4}$/.test(settingsNewPin.trim())) {
      setErrorMsg('New PIN must be 4 digits.');
      return;
    }
    if (settingsNewPin.trim() !== settingsConfirmPin.trim()) {
      setErrorMsg('New PIN and confirmation do not match.');
      return;
    }

    setLoading(true);
    try {
      await vaultApi.changePin({
        currentPin: settingsCurrentPin.trim(),
        newPin: settingsNewPin.trim(),
        confirmPin: settingsConfirmPin.trim()
      });
      setSettingsPinSuccess('PIN updated successfully!');
      setSettingsCurrentPin('');
      setSettingsNewPin('');
      setSettingsConfirmPin('');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to change PIN.');
    } finally {
      setLoading(false);
    }
  };

  // --- 7. SETTINGS: UPDATE RECOVERY METHOD ---
  const handleSettingsUpdateRecovery = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSettingsRecSuccess(null);

    if (!settingsRecDate) {
      setErrorMsg('Please provide a valid date.');
      return;
    }

    setLoading(true);
    try {
      await vaultApi.updateRecoveryMethod({
        currentPin: settingsCurrentPin.trim(),
        recoveryMethod: settingsRecMethod,
        recoveryDate: settingsRecDate
      });
      setSettingsRecSuccess('Recovery method updated successfully!');
      setSettingsCurrentPin('');
      setSettingsRecDate('');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to update recovery method.');
    } finally {
      setLoading(false);
    }
  };

  // Lock Vault and return to PIN screen
  const handleLockVault = () => {
    setViewState('PIN_ENTRY');
    setPinInput('');
  };

  // Format call duration helper
  const formatSeconds = (sec) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // =========================================================================
  // RENDER: LOADING STATE
  // =========================================================================
  if (viewState === 'LOADING') {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card)' }}>
        <Sparkles size={28} className="animate-spin" color="var(--accent-emerald)" />
      </div>
    );
  }

  // =========================================================================
  // RENDER: 1. NEW USER — CREATE SECRET VAULT PIN (NO BACK ARROW!)
  // =========================================================================
  if (viewState === 'PIN_CREATE') {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 20px',
          background: 'radial-gradient(circle at 50% 20%, rgba(5, 150, 105, 0.12), transparent 70%), var(--bg-card)',
          height: '100%',
          overflowY: 'auto'
        }}
      >
        <div
          style={{
            maxWidth: '440px',
            width: '100%',
            background: 'rgba(17, 24, 39, 0.85)',
            border: '1px solid rgba(5, 150, 105, 0.3)',
            borderRadius: '20px',
            padding: '32px 28px',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(5, 150, 105, 0.15)'
          }}
        >
          {/* Header Icon */}
          <div style={{ textAlign: 'center', marginBottom: '22px' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.2), rgba(16, 185, 129, 0.1))',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px'
              }}
            >
              <Shield size={28} color="var(--accent-emerald)" />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0 0 6px 0', color: '#fff' }}>
              Create Secret Vault PIN
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-dim)', margin: 0 }}>
              Set a 4-digit PIN to create your private space.
            </p>
          </div>

          {errorMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '10px',
                color: '#f87171',
                fontSize: '0.82rem',
                marginBottom: '18px'
              }}
            >
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '10px',
                color: '#34d399',
                fontSize: '0.82rem',
                marginBottom: '18px'
              }}
            >
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleCreatePin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* PIN Inputs */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-dim)', marginBottom: '8px' }}>
                4-Digit Secret PIN
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPinMask ? 'text' : 'password'}
                  inputMode="numeric"
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="••••"
                  required
                  className="input-field"
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 16px',
                    fontSize: '1.2rem',
                    letterSpacing: '8px',
                    textAlign: 'center',
                    fontWeight: '700'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPinMask(!showPinMask)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  {showPinMask ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-dim)', marginBottom: '8px' }}>
                Confirm 4-Digit PIN
              </label>
              <input
                type={showPinMask ? 'text' : 'password'}
                inputMode="numeric"
                maxLength={4}
                value={confirmPinInput}
                onChange={(e) => setConfirmPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="••••"
                required
                className="input-field"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '1.2rem',
                  letterSpacing: '8px',
                  textAlign: 'center',
                  fontWeight: '700'
                }}
              />
            </div>

            {/* Recovery Method Selection */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>
                Choose your PIN recovery method
              </label>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', margin: '0 0 12px 0' }}>
                Used to securely recover access using your registered date.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                <button
                  type="button"
                  onClick={() => setRecoveryMethod('birthday')}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: recoveryMethod === 'birthday' ? '1.5px solid var(--accent-emerald)' : '1px solid var(--border-color)',
                    background: recoveryMethod === 'birthday' ? 'rgba(5, 150, 105, 0.15)' : 'var(--bg-input)',
                    color: recoveryMethod === 'birthday' ? '#fff' : 'var(--text-dim)',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Calendar size={14} color={recoveryMethod === 'birthday' ? 'var(--accent-emerald)' : 'var(--text-muted)'} />
                  <span>Birthday</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRecoveryMethod('anniversary')}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: recoveryMethod === 'anniversary' ? '1.5px solid var(--accent-emerald)' : '1px solid var(--border-color)',
                    background: recoveryMethod === 'anniversary' ? 'rgba(5, 150, 105, 0.15)' : 'var(--bg-input)',
                    color: recoveryMethod === 'anniversary' ? '#fff' : 'var(--text-dim)',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Calendar size={14} color={recoveryMethod === 'anniversary' ? 'var(--accent-emerald)' : 'var(--text-muted)'} />
                  <span>Anniversary</span>
                </button>
              </div>

              {/* Recovery Date Input */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-dim)', marginBottom: '6px' }}>
                  {recoveryMethod === 'birthday' ? 'Enter Birthday Date (DD/MM/YYYY)' : 'Enter Anniversary Date (DD/MM/YYYY)'}
                </label>
                <input
                  type="date"
                  value={recoveryDate}
                  onChange={(e) => setRecoveryDate(e.target.value)}
                  required
                  className="input-field"
                  style={{ width: '100%', padding: '10px 14px', fontSize: '0.9rem', color: '#fff' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-vault"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.95rem',
                fontWeight: '700',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '6px'
              }}
            >
              {loading ? <Sparkles size={16} className="animate-spin" /> : <Lock size={16} />}
              <span>{loading ? 'Creating Vault...' : 'Create Secret Vault PIN'}</span>
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              Return to AI Bots
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: 2. EXISTING USER — PIN ENTRY SCREEN (NO BACK ARROW!)
  // =========================================================================
  if (viewState === 'PIN_ENTRY') {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 20px',
          background: 'radial-gradient(circle at 50% 20%, rgba(5, 150, 105, 0.12), transparent 70%), var(--bg-card)',
          height: '100%'
        }}
      >
        <div
          style={{
            maxWidth: '400px',
            width: '100%',
            background: 'rgba(17, 24, 39, 0.85)',
            border: '1px solid rgba(5, 150, 105, 0.3)',
            borderRadius: '20px',
            padding: '36px 30px',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(5, 150, 105, 0.15)'
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '26px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.25), rgba(16, 185, 129, 0.1))',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}
            >
              <Lock size={30} color="var(--accent-emerald)" />
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: '800', margin: '0 0 6px 0', color: '#fff' }}>
              Secret Vault
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-dim)', margin: 0 }}>
              Enter your 4-digit PIN to open your private space
            </p>
          </div>

          {errorMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '10px',
                color: '#f87171',
                fontSize: '0.82rem',
                marginBottom: '20px'
              }}
            >
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleUnlockPin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type={showPinMask ? 'text' : 'password'}
                inputMode="numeric"
                maxLength={4}
                autoFocus
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="••••"
                required
                className="input-field"
                style={{
                  width: '100%',
                  padding: '14px 44px 14px 16px',
                  fontSize: '1.4rem',
                  letterSpacing: '10px',
                  textAlign: 'center',
                  fontWeight: '800'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPinMask(!showPinMask)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                {showPinMask ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || pinInput.length !== 4}
              className="btn-vault"
              style={{
                width: '100%',
                padding: '13px',
                fontSize: '0.95rem',
                fontWeight: '700',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {loading ? <Sparkles size={16} className="animate-spin" /> : <Lock size={16} />}
              <span>{loading ? 'Unlocking...' : 'Unlock'}</span>
            </button>
          </form>

          {/* Forgot PIN & Return to AI Bots */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
            <button
              type="button"
              onClick={() => {
                setErrorMsg(null);
                setViewState('FORGOT_PIN_DATE');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-emerald)',
                fontSize: '0.84rem',
                fontWeight: '600',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              Forgot PIN?
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.82rem',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              Return to AI Bots
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: 3. FORGOT PIN — DATE RECOVERY SCREEN (NO OTP, NO BACK ARROW!)
  // =========================================================================
  if (viewState === 'FORGOT_PIN_DATE') {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 20px',
          background: 'radial-gradient(circle at 50% 20%, rgba(5, 150, 105, 0.12), transparent 70%), var(--bg-card)',
          height: '100%'
        }}
      >
        <div
          style={{
            maxWidth: '420px',
            width: '100%',
            background: 'rgba(17, 24, 39, 0.85)',
            border: '1px solid rgba(5, 150, 105, 0.3)',
            borderRadius: '20px',
            padding: '34px 28px',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(5, 150, 105, 0.15)'
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.2), rgba(16, 185, 129, 0.1))',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px'
              }}
            >
              <KeyRound size={28} color="var(--accent-emerald)" />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0 0 6px 0', color: '#fff' }}>
              Reset Secret Vault PIN
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-dim)', margin: 0 }}>
              Verify your registered birthday or anniversary date.
            </p>
          </div>

          {errorMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '10px',
                color: '#f87171',
                fontSize: '0.82rem',
                marginBottom: '18px'
              }}
            >
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleVerifyDate} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Method selection */}
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '600', color: 'var(--text-dim)', marginBottom: '8px' }}>
                Choose your recovery method
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setRecoveryMethod('birthday')}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: recoveryMethod === 'birthday' ? '1.5px solid var(--accent-emerald)' : '1px solid var(--border-color)',
                    background: recoveryMethod === 'birthday' ? 'rgba(5, 150, 105, 0.15)' : 'var(--bg-input)',
                    color: recoveryMethod === 'birthday' ? '#fff' : 'var(--text-dim)',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Calendar size={14} color={recoveryMethod === 'birthday' ? 'var(--accent-emerald)' : 'var(--text-muted)'} />
                  <span>Birthday</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRecoveryMethod('anniversary')}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: recoveryMethod === 'anniversary' ? '1.5px solid var(--accent-emerald)' : '1px solid var(--border-color)',
                    background: recoveryMethod === 'anniversary' ? 'rgba(5, 150, 105, 0.15)' : 'var(--bg-input)',
                    color: recoveryMethod === 'anniversary' ? '#fff' : 'var(--text-dim)',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Calendar size={14} color={recoveryMethod === 'anniversary' ? 'var(--accent-emerald)' : 'var(--text-muted)'} />
                  <span>Anniversary</span>
                </button>
              </div>
            </div>

            {/* Date Input */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-dim)', marginBottom: '8px' }}>
                Enter your registered date (DD / MM / YYYY)
              </label>
              <input
                type="date"
                value={recoveryDate}
                onChange={(e) => setRecoveryDate(e.target.value)}
                required
                className="input-field"
                style={{ width: '100%', padding: '12px 14px', fontSize: '0.92rem', color: '#fff' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !recoveryDate}
              className="btn-vault"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.95rem',
                fontWeight: '700',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '4px'
              }}
            >
              {loading ? <Sparkles size={16} className="animate-spin" /> : <Calendar size={16} />}
              <span>{loading ? 'Verifying...' : 'Verify Date'}</span>
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '18px' }}>
            <button
              type="button"
              onClick={() => {
                setErrorMsg(null);
                setViewState('PIN_ENTRY');
              }}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.82rem', cursor: 'pointer' }}
            >
              Back to PIN Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: 4. SET NEW PIN (AFTER SUCCESSFUL DATE RECOVERY, NO BACK ARROW!)
  // =========================================================================
  if (viewState === 'SET_NEW_PIN') {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 20px',
          background: 'radial-gradient(circle at 50% 20%, rgba(5, 150, 105, 0.12), transparent 70%), var(--bg-card)',
          height: '100%'
        }}
      >
        <div
          style={{
            maxWidth: '400px',
            width: '100%',
            background: 'rgba(17, 24, 39, 0.85)',
            border: '1px solid rgba(5, 150, 105, 0.3)',
            borderRadius: '20px',
            padding: '34px 28px',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(5, 150, 105, 0.15)'
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.2), rgba(16, 185, 129, 0.1))',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px'
              }}
            >
              <CheckCircle2 size={28} color="var(--accent-emerald)" />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0 0 6px 0', color: '#fff' }}>
              Set New 4-digit PIN
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-dim)', margin: 0 }}>
              Date verified. Enter your new Secret Vault PIN.
            </p>
          </div>

          {errorMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '10px',
                color: '#f87171',
                fontSize: '0.82rem',
                marginBottom: '18px'
              }}
            >
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '10px',
                color: '#34d399',
                fontSize: '0.82rem',
                marginBottom: '18px'
              }}
            >
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleResetPinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-dim)', marginBottom: '8px' }}>
                New 4-digit PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="••••"
                required
                className="input-field"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '1.2rem',
                  letterSpacing: '8px',
                  textAlign: 'center',
                  fontWeight: '700'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-dim)', marginBottom: '8px' }}>
                Confirm New PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={confirmNewPin}
                onChange={(e) => setConfirmNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="••••"
                required
                className="input-field"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '1.2rem',
                  letterSpacing: '8px',
                  textAlign: 'center',
                  fontWeight: '700'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || newPin.length !== 4 || confirmNewPin.length !== 4}
              className="btn-vault"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.95rem',
                fontWeight: '700',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '6px'
              }}
            >
              {loading ? <Sparkles size={16} className="animate-spin" /> : <Lock size={16} />}
              <span>{loading ? 'Updating...' : 'Reset PIN'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: 5. SECRET VAULT DASHBOARD (UNLOCKED — WITH BACK ARROW [←])
  // =========================================================================
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, background: 'var(--bg-primary)' }}>
      {/* ----------------------------------------------------------------- */}
      {/* DASHBOARD TOP HEADER: THE BACK ARROW [←] APPEARS ONLY HERE!        */}
      {/* ----------------------------------------------------------------- */}
      <div
        style={{
          padding: '10px 18px',
          borderBottom: '1px solid var(--border-color)',
          background: 'rgba(5, 150, 105, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Dashboard-Only Back Arrow to return to AI Bots / Main Chat */}
          <button
            type="button"
            onClick={onClose}
            title="Return to AI Bots"
            aria-label="Return to AI Bots"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <ArrowLeft size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)', fontWeight: '800', fontSize: '0.95rem' }}>
            <Shield size={18} />
            <span>Secret Vault</span>
          </div>

          <div
            style={{
              padding: '3px 8px',
              borderRadius: '6px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
              fontSize: '0.72rem',
              fontWeight: '600'
            }}
          >
            End-to-End Encrypted
          </div>
        </div>

        {/* Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setActiveCall({ type: 'audio', contact: activeContact })}
            title="Secure Audio Call"
            className="btn-secondary"
            style={{ padding: '6px 10px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <Phone size={14} color="var(--accent-emerald)" />
            <span className="hidden-mobile">Audio Call</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCall({ type: 'video', contact: activeContact })}
            title="Secure Video Call"
            className="btn-secondary"
            style={{ padding: '6px 10px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <Video size={14} color="var(--accent-blue)" />
            <span className="hidden-mobile">Video Call</span>
          </button>

          <button
            type="button"
            onClick={handleLockVault}
            title="Lock Vault"
            className="btn-secondary"
            style={{ padding: '6px 10px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '5px', color: '#f87171' }}
          >
            <LogOut size={14} />
            <span>Lock</span>
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* DASHBOARD BODY WORKSPACE: SIDEBAR TABS + ACTIVE VIEW               */}
      {/* ----------------------------------------------------------------- */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
        {/* Left Vault Sub-Navigation / Contacts */}
        <div
          style={{
            width: '280px',
            borderRight: '1px solid var(--border-color)',
            background: 'var(--bg-card)',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0
          }}
        >
          {/* Navigation Tabs Bar */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid var(--border-color)',
              background: 'var(--bg-input)'
            }}
          >
            {[
              { id: 'chats', label: 'Inbox', icon: Shield },
              { id: 'media', label: 'Files', icon: FileText },
              { id: 'settings', label: 'Settings', icon: SettingsIcon }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    padding: '10px 4px',
                    background: isActive ? 'rgba(5, 150, 105, 0.12)' : 'none',
                    border: 'none',
                    borderBottom: isActive ? '2px solid var(--accent-emerald)' : '2px solid transparent',
                    color: isActive ? '#fff' : 'var(--text-dim)',
                    fontSize: '0.78rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px'
                  }}
                >
                  <Icon size={13} color={isActive ? 'var(--accent-emerald)' : 'currentColor'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Contacts in Vault */}
          <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search encrypted space..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="input-field"
                style={{ width: '100%', padding: '6px 10px 6px 30px', fontSize: '0.8rem', borderRadius: '8px' }}
              />
            </div>
          </div>

          {/* Contact / Conversation List */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {vaultChats
              .filter((c) => c.name.toLowerCase().includes(searchFilter.toLowerCase()))
              .map((contact) => {
                const isSelected = activeContact?.id === contact.id;
                return (
                  <div
                    key={contact.id}
                    onClick={() => {
                      setActiveContact(contact);
                      if (activeTab !== 'chats') setActiveTab('chats');
                    }}
                    style={{
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      background: isSelected ? 'rgba(5, 150, 105, 0.12)' : 'transparent',
                      borderLeft: isSelected ? '3px solid var(--accent-emerald)' : '3px solid transparent',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    {/* Contact Avatar */}
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.6), rgba(16, 185, 129, 0.4))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.9rem',
                        fontWeight: '700',
                        color: '#fff',
                        flexShrink: 0
                      }}
                    >
                      {contact.avatar}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.84rem', fontWeight: '600', color: isSelected ? '#fff' : 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {contact.name}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{contact.lastTime}</span>
                      </div>
                      <p style={{ margin: '2px 0 0 0', fontSize: '0.74rem', color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {contact.role}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Right Active Panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden', background: 'var(--bg-primary)' }}>
          {activeTab === 'chats' && (
            /* CONVERSATION THREAD */
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
              {/* Active Chat Header */}
              <div
                style={{
                  padding: '10px 18px',
                  borderBottom: '1px solid var(--border-color)',
                  background: 'var(--bg-card)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexShrink: 0
                }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: '700', color: '#fff' }}>
                    {activeContact?.name}
                  </h4>
                  <span style={{ fontSize: '0.74rem', color: 'var(--accent-emerald)' }}>
                    ● Active Quantum Shard
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setActiveCall({ type: 'audio', contact: activeContact })}
                    className="btn-secondary"
                    style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                    title="Start Audio Call"
                  >
                    <Phone size={14} color="var(--accent-emerald)" />
                  </button>
                  <button
                    onClick={() => setActiveCall({ type: 'video', contact: activeContact })}
                    className="btn-secondary"
                    style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                    title="Start Video Call"
                  >
                    <Video size={14} color="var(--accent-blue)" />
                  </button>
                </div>
              </div>

              {/* Messages Container */}
              <div
                style={{
                  flex: 1,
                  padding: '18px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                {activeContact?.messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: msg.isUser ? 'flex-end' : 'flex-start',
                      maxWidth: '75%',
                      padding: '12px 16px',
                      borderRadius: msg.isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: msg.isUser ? 'linear-gradient(135deg, rgba(5, 150, 105, 0.4), rgba(4, 120, 87, 0.6))' : 'rgba(255, 255, 255, 0.05)',
                      border: msg.isUser ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-color)',
                      color: '#fff'
                    }}
                  >
                    <p style={{ margin: '0 0 4px 0', fontSize: '0.88rem', lineHeight: '1.45' }}>
                      {msg.text}
                    </p>
                    <span style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.6)', display: 'block', textAlign: msg.isUser ? 'right' : 'left' }}>
                      {msg.time}
                    </span>
                  </div>
                ))}
              </div>

              {/* Message Composer */}
              <form
                onSubmit={handleSendMessage}
                style={{
                  padding: '12px 16px',
                  borderTop: '1px solid var(--border-color)',
                  background: 'var(--bg-card)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  flexShrink: 0
                }}
              >
                <button
                  type="button"
                  title="Share confidential file"
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <Paperclip size={18} />
                </button>

                <input
                  type="text"
                  placeholder={`Send confidential message to ${activeContact?.name}...`}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="input-field"
                  style={{ flex: 1, padding: '10px 16px', fontSize: '0.88rem', borderRadius: 'var(--radius-full)' }}
                />

                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="btn-vault"
                  style={{
                    padding: '10px 16px',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontSize: '0.84rem'
                  }}
                >
                  <Send size={15} />
                  <span>Send</span>
                </button>
              </form>
            </div>
          )}

          {activeTab === 'media' && (
            /* SHARED FILES & MEDIA */
            <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>
                    Shared Files & Shards
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    End-to-end encrypted files stored inside your private space.
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
                {VAULT_SHARED_FILES.map((file) => (
                  <div
                    key={file.id}
                    style={{
                      padding: '14px 16px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'rgba(5, 150, 105, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <FileText size={20} color="var(--accent-emerald)" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: '0 0 2px 0', fontSize: '0.84rem', fontWeight: '600', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {file.name}
                      </p>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {file.size} • {file.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            /* SECRET VAULT SETTINGS: CHANGE PIN & RECOVERY METHOD */
            <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
              <div style={{ maxWidth: '560px' }}>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>
                  Secret Vault Settings
                </h3>
                <p style={{ margin: '0 0 24px 0', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                  Manage your private PIN, recovery method, and security preferences.
                </p>

                {errorMsg && (
                  <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', color: '#f87171', fontSize: '0.82rem', marginBottom: '16px' }}>
                    {errorMsg}
                  </div>
                )}

                {/* Change PIN Section */}
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '18px 20px', marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: '700', color: '#fff' }}>
                    Change 4-Digit PIN
                  </h4>
                  <p style={{ margin: '0 0 14px 0', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                    Update your existing Secret Vault PIN.
                  </p>

                  {settingsPinSuccess && (
                    <div style={{ padding: '8px 12px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '8px', color: '#34d399', fontSize: '0.8rem', marginBottom: '12px' }}>
                      {settingsPinSuccess}
                    </div>
                  )}

                  <form onSubmit={handleSettingsChangePin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '4px' }}>Current PIN</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={settingsCurrentPin}
                        onChange={(e) => setSettingsCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="••••"
                        className="input-field"
                        style={{ width: '100%', padding: '8px 12px', fontSize: '1rem', letterSpacing: '4px' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '4px' }}>New PIN</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={settingsNewPin}
                          onChange={(e) => setSettingsNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="••••"
                          className="input-field"
                          style={{ width: '100%', padding: '8px 12px', fontSize: '1rem', letterSpacing: '4px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '4px' }}>Confirm New PIN</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={settingsConfirmPin}
                          onChange={(e) => setSettingsConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="••••"
                          className="input-field"
                          style={{ width: '100%', padding: '8px 12px', fontSize: '1rem', letterSpacing: '4px' }}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !settingsCurrentPin || !settingsNewPin}
                      className="btn-vault"
                      style={{ padding: '9px 16px', fontSize: '0.84rem', alignSelf: 'flex-start', borderRadius: '8px' }}
                    >
                      Update PIN
                    </button>
                  </form>
                </div>

                {/* Manage Recovery Method Section */}
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '18px 20px', marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: '700', color: '#fff' }}>
                    Recovery Method Management
                  </h4>
                  <p style={{ margin: '0 0 14px 0', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                    Update the date used to recover your PIN (requires current PIN).
                  </p>

                  {settingsRecSuccess && (
                    <div style={{ padding: '8px 12px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '8px', color: '#34d399', fontSize: '0.8rem', marginBottom: '12px' }}>
                      {settingsRecSuccess}
                    </div>
                  )}

                  <form onSubmit={handleSettingsUpdateRecovery} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '4px' }}>Current PIN</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={settingsCurrentPin}
                        onChange={(e) => setSettingsCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="••••"
                        className="input-field"
                        style={{ width: '100%', padding: '8px 12px', fontSize: '1rem', letterSpacing: '4px' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => setSettingsRecMethod('birthday')}
                        style={{
                          padding: '8px',
                          borderRadius: '8px',
                          border: settingsRecMethod === 'birthday' ? '1px solid var(--accent-emerald)' : '1px solid var(--border-color)',
                          background: settingsRecMethod === 'birthday' ? 'rgba(5, 150, 105, 0.15)' : 'var(--bg-input)',
                          color: '#fff',
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        Birthday
                      </button>
                      <button
                        type="button"
                        onClick={() => setSettingsRecMethod('anniversary')}
                        style={{
                          padding: '8px',
                          borderRadius: '8px',
                          border: settingsRecMethod === 'anniversary' ? '1px solid var(--accent-emerald)' : '1px solid var(--border-color)',
                          background: settingsRecMethod === 'anniversary' ? 'rgba(5, 150, 105, 0.15)' : 'var(--bg-input)',
                          color: '#fff',
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        Anniversary Date
                      </button>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                        {settingsRecMethod === 'birthday' ? 'Birthday Date' : 'Anniversary Date'}
                      </label>
                      <input
                        type="date"
                        value={settingsRecDate}
                        onChange={(e) => setSettingsRecDate(e.target.value)}
                        className="input-field"
                        style={{ width: '100%', padding: '8px 12px', fontSize: '0.86rem', color: '#fff' }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !settingsCurrentPin || !settingsRecDate}
                      className="btn-vault"
                      style={{ padding: '9px 16px', fontSize: '0.84rem', alignSelf: 'flex-start', borderRadius: '8px' }}
                    >
                      Update Recovery Method
                    </button>
                  </form>
                </div>

                {/* Logout From Secret Vault Action */}
                <div style={{ paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                  <button
                    type="button"
                    onClick={handleLockVault}
                    className="btn-secondary"
                    style={{ padding: '10px 18px', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem' }}
                  >
                    <LogOut size={16} />
                    <span>Logout from Secret Vault</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* SIMULATED AUDIO / VIDEO CALL MODAL                                */}
      {/* ----------------------------------------------------------------- */}
      {activeCall && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <div
            style={{
              width: '90%',
              maxWidth: '440px',
              background: 'rgba(17, 24, 39, 0.95)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '24px',
              padding: '36px 28px',
              textAlign: 'center',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(5, 150, 105, 0.2)'
            }}
          >
            {/* Call Status Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '20px',
                background: 'rgba(5, 150, 105, 0.2)',
                color: '#34d399',
                fontSize: '0.78rem',
                fontWeight: '700',
                marginBottom: '20px'
              }}
            >
              <Shield size={14} />
              <span>{activeCall.type === 'video' ? 'ENCRYPTED VIDEO CALL' : 'ENCRYPTED AUDIO CALL'}</span>
            </div>

            {/* Avatar */}
            <div
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-emerald), #047857)',
                color: '#fff',
                fontSize: '2rem',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                border: '3px solid rgba(16, 185, 129, 0.5)'
              }}
            >
              {activeCall.contact?.avatar}
            </div>

            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', fontWeight: '800', color: '#fff' }}>
              {activeCall.contact?.name}
            </h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '0.84rem', color: 'var(--text-dim)' }}>
              Connected ({formatSeconds(callDuration)})
            </p>

            {/* Call Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '24px' }}>
              <button
                type="button"
                onClick={() => setCallMuted(!callMuted)}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: callMuted ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid var(--border-color)',
                  color: callMuted ? '#f87171' : '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {callMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </button>

              {activeCall.type === 'video' && (
                <button
                  type="button"
                  onClick={() => setCallVideoOff(!callVideoOff)}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: callVideoOff ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid var(--border-color)',
                    color: callVideoOff ? '#f87171' : '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {callVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveCall(null)}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: '#ef4444',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <PhoneOff size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecretVault;
