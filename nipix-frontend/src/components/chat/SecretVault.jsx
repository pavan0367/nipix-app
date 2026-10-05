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
  MapPin,
  ExternalLink,
  Download,
  User,
  Plus,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  CheckCheck,
  MoreVertical,
  Info,
  Smile
} from 'lucide-react';
import vaultApi from '../../services/vaultApi';
import { getCurrentSystemTime } from '../../pages/Chat';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../../utils/constants';

const SecretVault = ({ currentUser, onClose }) => {
  const activeUser = currentUser || JSON.parse(localStorage.getItem('nipix_user') || 'null');

  // Vault Navigation State: 'LOADING' | 'PIN_CREATE' | 'PIN_ENTRY' | 'FORGOT_PIN_DATE' | 'SET_NEW_PIN' | 'DASHBOARD'
  const [viewState, setViewState] = useState('LOADING');

  // Vault Server Config Status
  const [vaultStatus, setVaultStatus] = useState({
    hasPin: false,
    recoveryMethod: null,
    isLocked: false,
    lockRemainingSeconds: 0
  });

  // UI Form States for PIN
  const [pinInput, setPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [recoveryMethod, setRecoveryMethod] = useState('birthday'); // 'birthday' | 'anniversary'
  const [recoveryDate, setRecoveryDate] = useState('');
  const [showPinMask, setShowPinMask] = useState(false);

  // Recovery Verification State (Zero OTP)
  const [resetToken, setResetToken] = useState(null);
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Dashboard Left Navigation: 'inbox' | 'search' | 'calls' | 'media' | 'shared_files' | 'starred' | 'archive' | 'settings'
  const [activeNav, setActiveNav] = useState('inbox');

  // Real Persistent Conversations & Messages
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageText, setMessageText] = useState('');

  // Search Scholars State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Call Logs State
  const [callLogs, setCallLogs] = useState([]);
  const [loadingCalls, setLoadingCalls] = useState(false);

  // Contact Profile Drawer State (Right Panel)
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [profileActiveTab, setProfileActiveTab] = useState('media'); // 'media' | 'docs' | 'links'

  // Real Call State & Modals
  const [activeCall, setActiveCall] = useState(null); // { callId, type: 'audio'|'video', direction: 'outgoing'|'incoming', contact, status, startTime } | null
  const [incomingCall, setIncomingCall] = useState(null); // { callId, conversationId, callerId, callerName, callType, sdp } | null
  const [callMuted, setCallMuted] = useState(false);
  const [callVideoOff, setCallVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // Attachment Menu & Modals
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [previewMediaModal, setPreviewMediaModal] = useState(null);

  // Settings State
  const [settingsCurrentPin, setSettingsCurrentPin] = useState('');
  const [settingsNewPin, setSettingsNewPin] = useState('');
  const [settingsConfirmPin, setSettingsConfirmPin] = useState('');
  const [settingsRecMethod, setSettingsRecMethod] = useState('birthday');
  const [settingsRecDate, setSettingsRecDate] = useState('');
  const [settingsPinSuccess, setSettingsPinSuccess] = useState(null);
  const [settingsRecSuccess, setSettingsRecSuccess] = useState(null);

  // Hidden File Inputs
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const docInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Socket & State Synchronization Refs (prevents stale closure message drops)
  const socketRef = useRef(null);
  const activeConversationRef = useRef(activeConversation);
  const currentUserRef = useRef(activeUser);

  // WebRTC Peer Connection & Media Streams Refs
  const activeCallRef = useRef(activeCall);
  const incomingCallRef = useRef(incomingCall);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const iceCandidateQueueRef = useRef({});
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const remoteAudioRef = useRef(null);

  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  useEffect(() => {
    currentUserRef.current = activeUser;
  }, [activeUser]);

  useEffect(() => {
    activeCallRef.current = activeCall;
  }, [activeCall]);

  useEffect(() => {
    incomingCallRef.current = incomingCall;
  }, [incomingCall]);

  // STUN Configuration for WebRTC
  const ICE_SERVERS = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ];

  const cleanupCallMedia = () => {
    console.log('[CallSocket Client] Cleaning up call media and peer connection');
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        try { track.stop(); } catch (e) {}
      });
      localStreamRef.current = null;
    }
    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach((track) => {
        try { track.stop(); } catch (e) {}
      });
      remoteStreamRef.current = null;
    }
    if (peerConnectionRef.current) {
      try { peerConnectionRef.current.close(); } catch (e) {}
      peerConnectionRef.current = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }
    iceCandidateQueueRef.current = {};
  };

  const processIceQueue = async (callId) => {
    const queue = iceCandidateQueueRef.current[callId] || [];
    iceCandidateQueueRef.current[callId] = [];
    for (const candidate of queue) {
      try {
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
          console.log('[CallSocket Client] Added queued ICE candidate for call=' + callId);
        }
      } catch (err) {
        console.warn('[CallSocket Client] Error applying queued ICE candidate:', err.message);
      }
    }
  };

  const setupPeerConnection = (callId, targetUserId) => {
    cleanupCallMedia();

    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    peerConnectionRef.current = pc;

    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        console.log('[CallSocket Client] emitting ICE candidate for call=' + callId);
        socketRef.current.emit('call:ice-candidate', {
          callId,
          targetUserId,
          candidate: event.candidate
        });
      }
    };

    pc.ontrack = (event) => {
      console.log('[CallSocket Client] remote track received:', event.track.kind);
      remoteStreamRef.current = event.streams[0];
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = event.streams[0];
      }
    };

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      console.log(`[CallSocket Client] peer connection state=${state} for call=${callId}`);
      if (state === 'connected') {
        setActiveCall((prev) => (prev && prev.callId === callId ? { ...prev, status: 'connected' } : prev));
      } else if (state === 'failed' || state === 'disconnected') {
        setActiveCall((prev) => (prev && prev.callId === callId ? { ...prev, status: 'ended' } : prev));
        cleanupCallMedia();
        setTimeout(() => {
          setActiveCall((prev) => (prev && prev.callId === callId ? null : prev));
        }, 1500);
      }
    };

    return pc;
  };

  // -------------------------------------------------------------------------
  // INITIAL STATUS CHECK
  // -------------------------------------------------------------------------
  useEffect(() => {
    fetchVaultStatus();
  }, []);

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
      setViewState('PIN_CREATE');
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // DATA FETCHING ON DASHBOARD ENTRY
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (viewState === 'DASHBOARD') {
      loadConversations();
      loadCallLogs();
    }
  }, [viewState]);

  const loadConversations = async () => {
    try {
      const res = await vaultApi.getConversations();
      if (res && res.conversations) {
        setConversations(res.conversations);
        if (res.conversations.length > 0 && !activeConversationRef.current) {
          selectConversation(res.conversations[0]);
        }
      }
    } catch (err) {
      console.warn('Could not load vault conversations:', err.message);
    }
  };

  const loadCallLogs = async () => {
    setLoadingCalls(true);
    try {
      const res = await vaultApi.getCallLogs();
      if (res && res.callLogs) {
        setCallLogs(res.callLogs);
      }
    } catch (err) {
      console.warn('Could not load call logs:', err.message);
    } finally {
      setLoadingCalls(false);
    }
  };

  const selectConversation = async (conv) => {
    setActiveConversation(conv);
    activeConversationRef.current = conv;
    // Mark as read in inbox list
    setConversations((prev) =>
      prev.map((c) => (String(c.id) === String(conv.id) ? { ...c, unread: 0 } : c))
    );
    setLoadingMessages(true);
    try {
      const res = await vaultApi.getMessages(conv.id);
      if (res && res.messages) {
        setMessages((currentMessages) => {
          // If socket delivered any messages for this conversation during fetch, merge safely
          const msgMap = new Map();
          res.messages.forEach((m) => msgMap.set(m.id, m));
          currentMessages.forEach((m) => {
            if (String(m.conversationId) === String(conv.id) && !msgMap.has(m.id)) {
              msgMap.set(m.id, m);
            }
          });
          const combined = Array.from(msgMap.values());
          return combined.sort((a, b) => {
            const timeA = new Date(a.createdAt).getTime();
            const timeB = new Date(b.createdAt).getTime();
            if (timeA !== timeB) return timeA - timeB;
            if (typeof a.id === 'number' && typeof b.id === 'number') return a.id - b.id;
            return String(a.id).localeCompare(String(b.id));
          });
        });
      }
    } catch (err) {
      console.warn('Could not load conversation messages:', err.message);
    } finally {
      setLoadingMessages(false);
    }
  };

  // -------------------------------------------------------------------------
  // REAL-TIME SOCKET.IO LIFECYCLE (SECRET VAULT LIVE CHAT)
  // -------------------------------------------------------------------------
  useEffect(() => {
    // Only connect when user is inside DASHBOARD view
    if (viewState !== 'DASHBOARD') return;

    const token = localStorage.getItem('nipix_token') || localStorage.getItem('token');
    if (!token) return;

    const cleanSocketUrl = SOCKET_URL.replace(/\/+$/, '');
    const socket = io(cleanSocketUrl, {
      auth: { token },
      query: { token },
      transports: ['websocket', 'polling'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[VaultSocket] connected:', socket.id);
      console.log('[VaultSocket] authenticated user:', currentUserRef.current?.id);
      console.log('[VaultSocket] joined private room');
      console.log('[VaultSocket] listener registered');
      if (currentUserRef.current?.id) {
        socket.emit('joinUserRoom', currentUserRef.current.id);
      }
    });

    socket.on('connect_error', (err) => {
      console.warn('[VaultSocket] connection error:', err.message);
    });

    socket.on('vaultMessage', (incomingMsg) => {
      if (!incomingMsg || !incomingMsg.conversationId) return;

      const currentActiveConv = activeConversationRef.current;
      const currentAuthUser = currentUserRef.current;
      const isMsgForActive = String(currentActiveConv?.id) === String(incomingMsg.conversationId);
      const isSender = String(incomingMsg.senderId) === String(currentAuthUser?.id);

      console.log('[VaultSocket] vaultMessage received:', incomingMsg.id);
      console.log('[VaultSocket] active conversation:', currentActiveConv?.id);
      console.log('[VaultSocket] incoming conversation:', incomingMsg.conversationId);

      // 1. If incoming message is for the currently active conversation, append directly to active chat
      if (isMsgForActive) {
        console.log('[VaultSocket] appending message:', incomingMsg.id);
        setMessages((prevMessages) => {
          // Prevent duplicates by canonical server message ID
          if (prevMessages.some((m) => m.id === incomingMsg.id)) {
            return prevMessages;
          }

          // Reconcile optimistic temporary message if present
          let reconciled = false;
          const mapped = prevMessages.map((m) => {
            if (
              !reconciled &&
              isSender &&
              typeof m.id === 'string' &&
              m.id.startsWith('temp-') &&
              String(m.conversationId) === String(incomingMsg.conversationId) &&
              m.mediaType === incomingMsg.mediaType &&
              (m.text === incomingMsg.text || m.mediaUrl === incomingMsg.mediaUrl)
            ) {
              reconciled = true;
              return incomingMsg;
            }
            return m;
          });

          const nextList = reconciled ? mapped : [...mapped, incomingMsg];

          // Deterministic sorting by canonical server createdAt timestamp and database ID
          return nextList.sort((a, b) => {
            const timeA = new Date(a.createdAt).getTime();
            const timeB = new Date(b.createdAt).getTime();
            if (timeA !== timeB) return timeA - timeB;
            if (typeof a.id === 'number' && typeof b.id === 'number') {
              return a.id - b.id;
            }
            return String(a.id).localeCompare(String(b.id));
          });
        });
      }

      // 2. Update conversation list preview, unread status, and ordering
      setConversations((prevConvs) => {
        const convIndex = prevConvs.findIndex(
          (c) => String(c.id) === String(incomingMsg.conversationId)
        );

        if (convIndex === -1) {
          // If conversation is not in local list yet, fetch updated conversations
          loadConversations();
          return prevConvs;
        }

        const existingConv = prevConvs[convIndex];
        const updatedConv = {
          ...existingConv,
          lastMessage: {
            id: incomingMsg.id,
            text: incomingMsg.text,
            mediaUrl: incomingMsg.mediaUrl,
            mediaType: incomingMsg.mediaType || 'text',
            fileName: incomingMsg.fileName,
            time: incomingMsg.createdAt,
            senderId: incomingMsg.senderId,
            isUser: isSender
          },
          // If message is for currently active conversation, unread stays 0;
          // if for a background conversation and sent by contact, increment unread count.
          unread: isMsgForActive ? 0 : (isSender ? existingConv.unread : (existingConv.unread || 0) + 1),
          updatedAt: incomingMsg.createdAt
        };

        const updatedList = [...prevConvs];
        updatedList.splice(convIndex, 1);
        return [updatedConv, ...updatedList];
      });
    });

    // =========================================================================
    // WEBRTC CALL SIGNALING LISTENERS
    // =========================================================================

    socket.on('call:incoming', (data) => {
      console.log('[CallSocket Client] incoming call=' + data.callId + ' from=' + data.callerId);
      const active = activeCallRef.current;
      if (active && ['calling', 'ringing', 'connecting', 'connected'].includes(active.status)) {
        console.log('[CallSocket Client] User busy, signaling busy back to caller');
        socket.emit('call:busy', { callId: data.callId, targetUserId: data.callerId });
        return;
      }
      setIncomingCall(data);
    });

    socket.on('call:ringing', (data) => {
      console.log('[CallSocket Client] remote ringing acknowledged for call=' + data.callId);
      setActiveCall((prev) => (prev && prev.callId === data.callId && prev.status === 'calling' ? { ...prev, status: 'ringing' } : prev));
    });

    socket.on('call:answer', async (data) => {
      console.log('[CallSocket Client] answer received for call=' + data.callId);
      const pc = peerConnectionRef.current;
      const active = activeCallRef.current;
      if (!pc || !active || active.callId !== data.callId) return;

      setActiveCall((prev) => (prev && prev.callId === data.callId ? { ...prev, status: 'connecting' } : prev));
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        await processIceQueue(data.callId);
      } catch (err) {
        console.warn('[CallSocket Client] Error setting remote answer:', err.message);
      }
    });

    socket.on('call:ice-candidate', async (data) => {
      const pc = peerConnectionRef.current;
      const active = activeCallRef.current;
      if (!active || active.callId !== data.callId) return;

      console.log('[CallSocket Client] ICE candidate received for call=' + data.callId);
      if (pc && pc.remoteDescription && pc.remoteDescription.type) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (err) {
          console.warn('[CallSocket Client] Error adding ICE candidate:', err.message);
        }
      } else {
        if (!iceCandidateQueueRef.current[data.callId]) {
          iceCandidateQueueRef.current[data.callId] = [];
        }
        iceCandidateQueueRef.current[data.callId].push(data.candidate);
      }
    });

    socket.on('call:declined', (data) => {
      console.log('[CallSocket Client] call declined=' + data.callId);
      const active = activeCallRef.current;
      if (active && active.callId === data.callId) {
        setActiveCall((prev) => (prev && prev.callId === data.callId ? { ...prev, status: 'declined' } : prev));
        cleanupCallMedia();
        setTimeout(() => {
          setActiveCall((prev) => (prev && prev.callId === data.callId ? null : prev));
        }, 2000);
      }
    });

    socket.on('call:busy', (data) => {
      console.log('[CallSocket Client] recipient busy for call=' + data.callId);
      const active = activeCallRef.current;
      if (active && active.callId === data.callId) {
        setActiveCall((prev) => (prev && prev.callId === data.callId ? { ...prev, status: 'busy' } : prev));
        cleanupCallMedia();
        setTimeout(() => {
          setActiveCall((prev) => (prev && prev.callId === data.callId ? null : prev));
        }, 2500);
      }
    });

    socket.on('call:cancelled', (data) => {
      console.log('[CallSocket Client] incoming call cancelled by caller=' + data.callId);
      const incoming = incomingCallRef.current;
      if (incoming && incoming.callId === data.callId) {
        setIncomingCall(null);
      }
    });

    socket.on('call:ended', (data) => {
      console.log('[CallSocket Client] call ended=' + data.callId);
      const active = activeCallRef.current;
      if (active && active.callId === data.callId) {
        setActiveCall((prev) => (prev && prev.callId === data.callId ? { ...prev, status: 'ended' } : prev));
        cleanupCallMedia();
        setTimeout(() => {
          setActiveCall((prev) => (prev && prev.callId === data.callId ? null : prev));
        }, 1500);
      }
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('vaultMessage');
      socket.off('call:incoming');
      socket.off('call:ringing');
      socket.off('call:answer');
      socket.off('call:ice-candidate');
      socket.off('call:declined');
      socket.off('call:busy');
      socket.off('call:cancelled');
      socket.off('call:ended');
      cleanupCallMedia();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [viewState]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Call timer effect: ONLY increments duration when call is truly connected
  useEffect(() => {
    let timer = null;
    if (activeCall && activeCall.status === 'connected') {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => timer && clearInterval(timer);
  }, [activeCall?.status]);

  // Bind video and audio streams when activeCall changes
  useEffect(() => {
    if (activeCall && activeCall.type === 'video') {
      if (localVideoRef.current && localStreamRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }
      if (remoteVideoRef.current && remoteStreamRef.current) {
        remoteVideoRef.current.srcObject = remoteStreamRef.current;
      }
    }
    if (remoteAudioRef.current && remoteStreamRef.current) {
      remoteAudioRef.current.srcObject = remoteStreamRef.current;
    }
  }, [activeCall?.status, activeCall?.type]);

  // Format call duration helper (MM:SS)
  const formatSeconds = (sec) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // -------------------------------------------------------------------------
  // 1. PIN CREATION (MANDATORY RECOVERY METHOD & DATE)
  // -------------------------------------------------------------------------
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
      setTimeout(() => {
        setViewState('DASHBOARD');
        setVaultStatus((prev) => ({ ...prev, hasPin: true, recoveryMethod }));
        setPinInput('');
        setConfirmPinInput('');
        setRecoveryDate('');
      }, 500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to setup Secret Vault.');
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // 2. UNLOCK WITH 4-DIGIT PIN
  // -------------------------------------------------------------------------
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

  // -------------------------------------------------------------------------
  // 3. DATE-BASED PIN RECOVERY (STRICTLY NO OTP)
  // -------------------------------------------------------------------------
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
      if (res && res.resetToken) {
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

  // -------------------------------------------------------------------------
  // 4. SET NEW 4-DIGIT PIN AFTER DATE VERIFICATION
  // -------------------------------------------------------------------------
  const handleResetPinSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!newPin || !/^\d{4}$/.test(newPin.trim())) {
      setErrorMsg('New PIN must be exactly 4 numeric digits.');
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
      }, 600);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to reset PIN.');
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // 5. SEND PERSISTED USER-TO-USER MESSAGE
  // -------------------------------------------------------------------------
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!messageText.trim() || !activeConversation) return;

    const text = messageText.trim();
    setMessageText('');

    const optimisticMsg = {
      id: `temp-${Date.now()}`,
      conversationId: activeConversation.id,
      senderId: activeUser?.id,
      senderName: activeUser?.full_name || activeUser?.username || 'You',
      isUser: true,
      text,
      mediaUrl: null,
      mediaType: 'text',
      fileName: null,
      fileSize: null,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const res = await vaultApi.sendMessage(activeConversation.id, {
        messageText: text,
        mediaType: 'text'
      });

      if (res && res.message) {
        setMessages((prev) => {
          const alreadyDelivered = prev.some((m) => m.id === res.message.id);
          if (alreadyDelivered) {
            return prev.filter((m) => m.id !== optimisticMsg.id);
          }
          return prev.map((m) => (m.id === optimisticMsg.id ? res.message : m));
        });
        setConversations((prevConvs) => {
          const convIndex = prevConvs.findIndex(
            (c) => String(c.id) === String(activeConversation.id)
          );
          if (convIndex === -1) return prevConvs;
          const existing = prevConvs[convIndex];
          const updated = {
            ...existing,
            lastMessage: {
              id: res.message.id,
              text: res.message.text,
              mediaUrl: res.message.mediaUrl,
              mediaType: res.message.mediaType || 'text',
              fileName: res.message.fileName,
              time: res.message.createdAt,
              senderId: res.message.senderId,
              isUser: true
            },
            updatedAt: res.message.createdAt
          };
          const updatedList = [...prevConvs];
          updatedList.splice(convIndex, 1);
          return [updated, ...updatedList];
        });
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  // -------------------------------------------------------------------------
  // 6. ATTACHMENT HANDLERS (IMAGE, VIDEO, DOCUMENT, AUDIO, LOCATION)
  // -------------------------------------------------------------------------
  const handleFileUpload = (e, mediaType) => {
    const file = e.target.files?.[0];
    if (!file || !activeConversation) return;

    setShowAttachmentMenu(false);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result;
      const sizeFormatted = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      const optimisticMsg = {
        id: `temp-${Date.now()}`,
        conversationId: activeConversation.id,
        senderId: activeUser?.id,
        senderName: activeUser?.full_name || activeUser?.username || 'You',
        isUser: true,
        text: file.name,
        mediaUrl: base64Data,
        mediaType,
        fileName: file.name,
        fileSize: sizeFormatted,
        isRead: false,
        createdAt: new Date().toISOString()
      };

      setMessages((prev) => [...prev, optimisticMsg]);

      try {
        const res = await vaultApi.sendMessage(activeConversation.id, {
          messageText: file.name,
          mediaUrl: base64Data,
          mediaType,
          fileName: file.name,
          fileSize: sizeFormatted
        });
        if (res && res.message) {
          setMessages((prev) => {
            const alreadyDelivered = prev.some((m) => m.id === res.message.id);
            if (alreadyDelivered) {
              return prev.filter((m) => m.id !== optimisticMsg.id);
            }
            return prev.map((m) => (m.id === optimisticMsg.id ? res.message : m));
          });
          setConversations((prevConvs) => {
            const convIndex = prevConvs.findIndex(
              (c) => String(c.id) === String(activeConversation.id)
            );
            if (convIndex === -1) return prevConvs;
            const existing = prevConvs[convIndex];
            const updated = {
              ...existing,
              lastMessage: {
                id: res.message.id,
                text: res.message.text,
                mediaUrl: res.message.mediaUrl,
                mediaType: res.message.mediaType || mediaType,
                fileName: res.message.fileName,
                time: res.message.createdAt,
                senderId: res.message.senderId,
                isUser: true
              },
              updatedAt: res.message.createdAt
            };
            const updatedList = [...prevConvs];
            updatedList.splice(convIndex, 1);
            return [updated, ...updatedList];
          });
        }
      } catch (err) {
        console.error('Failed to send attachment:', err);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleShareLocation = () => {
    setShowAttachmentMenu(false);
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude.toFixed(5);
        const lng = pos.coords.longitude.toFixed(5);
        const locString = `Location: ${lat}, ${lng}`;
        const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;

        const optimisticMsg = {
          id: `temp-${Date.now()}`,
          conversationId: activeConversation.id,
          senderId: activeUser?.id,
          senderName: activeUser?.full_name || activeUser?.username || 'You',
          isUser: true,
          text: locString,
          mediaUrl: mapUrl,
          mediaType: 'location',
          fileName: 'Shared Location Coordinates',
          fileSize: null,
          isRead: false,
          createdAt: new Date().toISOString()
        };

        setMessages((prev) => [...prev, optimisticMsg]);

        try {
          const res = await vaultApi.sendMessage(activeConversation.id, {
            messageText: locString,
            mediaUrl: mapUrl,
            mediaType: 'location',
            fileName: 'Shared Location Coordinates'
          });
          if (res && res.message) {
            setMessages((prev) => {
              const alreadyDelivered = prev.some((m) => m.id === res.message.id);
              if (alreadyDelivered) {
                return prev.filter((m) => m.id !== optimisticMsg.id);
              }
              return prev.map((m) => (m.id === optimisticMsg.id ? res.message : m));
            });
            setConversations((prevConvs) => {
              const convIndex = prevConvs.findIndex(
                (c) => String(c.id) === String(activeConversation.id)
              );
              if (convIndex === -1) return prevConvs;
              const existing = prevConvs[convIndex];
              const updated = {
                ...existing,
                lastMessage: {
                  id: res.message.id,
                  text: res.message.text,
                  mediaUrl: res.message.mediaUrl,
                  mediaType: res.message.mediaType || 'location',
                  fileName: res.message.fileName,
                  time: res.message.createdAt,
                  senderId: res.message.senderId,
                  isUser: true
                },
                updatedAt: res.message.createdAt
              };
              const updatedList = [...prevConvs];
              updatedList.splice(convIndex, 1);
              return [updated, ...updatedList];
            });
          }
        } catch (err) {
          console.error('Failed to send location:', err);
        }
      },
      (err) => {
        alert('Could not retrieve GPS coordinates. Permission denied.');
      }
    );
  };

  // -------------------------------------------------------------------------
  // 7. SCHOLAR SEARCH & START CONVERSATION
  // -------------------------------------------------------------------------
  const handleSearchScholars = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await vaultApi.searchScholars(query.trim());
      if (res && res.users) {
        setSearchResults(res.users);
      }
    } catch (err) {
      console.warn('Scholar search error:', err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleStartConversationWithUser = async (targetUser) => {
    try {
      const res = await vaultApi.startConversation(targetUser.id);
      if (res && res.conversation) {
        await loadConversations();
        selectConversation(res.conversation);
        setActiveNav('inbox');
        setSearchQuery('');
        setSearchResults([]);
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Could not start conversation.');
    }
  };

  // -------------------------------------------------------------------------
  // 8. CALLS (AUDIO / VIDEO) & REAL WEBRTC SIGNALING
  // -------------------------------------------------------------------------
  const startCall = async (type) => {
    if (!activeConversation || !activeConversation.contact) return;
    if (!socketRef.current || !socketRef.current.connected) {
      alert('Encrypted socket connection is offline. Please wait a moment and try again.');
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Media devices (Microphone/Camera) are not supported in this browser context.');
      return;
    }

    const contact = activeConversation.contact;
    const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    // 1. Request microphone & camera permissions
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: type === 'video'
      });
    } catch (err) {
      console.warn('[CallSocket Client] Media permission denied:', err.message);
      alert(type === 'video'
        ? 'Camera and microphone access are required for encrypted video calls.'
        : 'Microphone access is required for encrypted audio calls.');
      return;
    }

    localStreamRef.current = stream;
    setCallMuted(false);
    setCallVideoOff(false);
    setCallDuration(0);

    setActiveCall({
      callId,
      type,
      direction: 'outgoing',
      contact,
      status: 'calling'
    });

    try {
      const pc = setupPeerConnection(callId, contact.id);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      if (localVideoRef.current && type === 'video') {
        localVideoRef.current.srcObject = stream;
      }

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      console.log('[CallSocket Client] outgoing call offer=' + callId + ' to=' + contact.id);
      socketRef.current.emit('call:offer', {
        callId,
        conversationId: activeConversation.id,
        recipientId: contact.id,
        callerId: activeUser?.id,
        callerName: activeUser?.full_name || activeUser?.username || 'Scholar',
        callType: type,
        sdp: offer
      });
    } catch (err) {
      console.error('[CallSocket Client] Error starting call:', err.message);
      cleanupCallMedia();
      setActiveCall(null);
    }
  };

  const handleAcceptCall = async () => {
    const incoming = incomingCallRef.current;
    if (!incoming || !socketRef.current) return;

    setIncomingCall(null);

    const callId = incoming.callId;
    const callerId = incoming.callerId;
    const callType = incoming.callType || 'audio';

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      socketRef.current.emit('call:decline', {
        callId,
        targetUserId: callerId,
        conversationId: incoming.conversationId,
        reason: 'unsupported'
      });
      alert('Media devices are not supported in this browser context.');
      return;
    }

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: callType === 'video'
      });
    } catch (err) {
      console.warn('[CallSocket Client] Permission error on accept:', err.message);
      socketRef.current.emit('call:decline', {
        callId,
        targetUserId: callerId,
        conversationId: incoming.conversationId,
        reason: 'permission_denied'
      });
      alert('Microphone/Camera permission is required to answer this call.');
      return;
    }

    localStreamRef.current = stream;
    setCallMuted(false);
    setCallVideoOff(false);
    setCallDuration(0);

    setActiveCall({
      callId,
      type: callType,
      direction: 'incoming',
      contact: { id: callerId, name: incoming.callerName, username: incoming.callerName },
      status: 'connecting'
    });

    try {
      const pc = setupPeerConnection(callId, callerId);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      if (localVideoRef.current && callType === 'video') {
        localVideoRef.current.srcObject = stream;
      }

      await pc.setRemoteDescription(new RTCSessionDescription(incoming.sdp));
      await processIceQueue(callId);

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      console.log('[CallSocket Client] answer emitted for call=' + callId + ' to=' + callerId);
      socketRef.current.emit('call:answer', {
        callId,
        targetUserId: callerId,
        sdp: answer
      });
    } catch (err) {
      console.error('[CallSocket Client] Error answering call:', err.message);
      cleanupCallMedia();
      setActiveCall(null);
    }
  };

  const handleDeclineCall = async () => {
    const incoming = incomingCallRef.current;
    if (!incoming) return;

    if (socketRef.current) {
      socketRef.current.emit('call:decline', {
        callId: incoming.callId,
        targetUserId: incoming.callerId,
        conversationId: incoming.conversationId,
        reason: 'declined'
      });
    }

    try {
      await vaultApi.recordCallLog({
        contactId: incoming.callerId,
        callType: incoming.callType,
        direction: 'incoming',
        status: 'declined',
        duration: 0
      });
      loadCallLogs();
    } catch (e) {
      console.warn('[CallLog] Error recording decline:', e.message);
    }

    setIncomingCall(null);
  };

  const handleEndCall = async () => {
    const active = activeCallRef.current;
    if (!active) {
      cleanupCallMedia();
      setActiveCall(null);
      return;
    }

    const callId = active.callId;
    const contactId = active.contact?.id;
    const callType = active.type;
    const duration = callDuration;
    const isConnected = active.status === 'connected';

    // If cancelling before answer
    if (active.direction === 'outgoing' && (active.status === 'calling' || active.status === 'ringing')) {
      if (socketRef.current && contactId) {
        socketRef.current.emit('call:cancel', {
          callId,
          targetUserId: contactId
        });
      }
      try {
        await vaultApi.recordCallLog({
          contactId,
          callType,
          direction: 'outgoing',
          status: 'cancelled',
          duration: 0
        });
        loadCallLogs();
      } catch (e) {}
    } else {
      // Ending an active or connecting call
      if (socketRef.current && contactId) {
        socketRef.current.emit('call:end', {
          callId,
          targetUserId: contactId,
          duration
        });
      }
      try {
        await vaultApi.recordCallLog({
          contactId,
          callType,
          direction: active.direction || 'outgoing',
          status: isConnected && duration > 0 ? 'completed' : 'cancelled',
          duration
        });
        loadCallLogs();
      } catch (e) {}
    }

    cleanupCallMedia();
    setActiveCall(null);
    setCallDuration(0);
  };

  const toggleMic = () => {
    const nextMuted = !callMuted;
    setCallMuted(nextMuted);
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !nextMuted;
      });
    }
  };

  const toggleVideo = () => {
    const nextVideoOff = !callVideoOff;
    setCallVideoOff(nextVideoOff);
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !nextVideoOff;
      });
    }
  };

  // -------------------------------------------------------------------------
  // 9. SETTINGS ACTIONS (CHANGE PIN & RECOVERY)
  // -------------------------------------------------------------------------
  const handleSettingsChangePin = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSettingsPinSuccess(null);

    if (!settingsNewPin || !/^\d{4}$/.test(settingsNewPin.trim())) {
      setErrorMsg('New PIN must be exactly 4 numeric digits.');
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
      setSettingsPinSuccess('Secret Vault PIN updated successfully!');
      setSettingsCurrentPin('');
      setSettingsNewPin('');
      setSettingsConfirmPin('');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to change PIN.');
    } finally {
      setLoading(false);
    }
  };

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
      setSettingsRecSuccess('Recovery details updated successfully!');
      setSettingsCurrentPin('');
      setSettingsRecDate('');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to update recovery method.');
    } finally {
      setLoading(false);
    }
  };

  const handleLockVault = () => {
    setViewState('PIN_ENTRY');
    setPinInput('');
    setActiveConversation(null);
    setMessages([]);
  };

  // -------------------------------------------------------------------------
  // SHARED CONTENT EXTRACTION FOR ACTIVE CONVERSATION
  // -------------------------------------------------------------------------
  const conversationMedia = messages.filter(
    (m) => m.mediaType === 'image' || m.mediaType === 'video'
  );
  const conversationDocs = messages.filter(
    (m) => m.mediaType === 'doc' || m.mediaType === 'document'
  );
  const conversationLinks = messages
    .filter((m) => m.text && /(https?:\/\/[^\s]+)/g.test(m.text))
    .flatMap((m) => {
      const urls = m.text.match(/(https?:\/\/[^\s]+)/g) || [];
      return urls.map((u) => ({ url: u, time: m.createdAt }));
    });

  // =========================================================================
  // RENDER: LOADING STATE
  // =========================================================================
  if (viewState === 'LOADING') {
    return (
      <div
        style={{
          flex: 1,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-primary)'
        }}
      >
        <Sparkles size={32} className="animate-spin" color="var(--accent-emerald)" />
      </div>
    );
  }

  // =========================================================================
  // RENDER: 1. NEW USER — CREATE PIN (STRICT RULE: NO BACK ARROW!)
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
          background: 'radial-gradient(circle at 50% 20%, rgba(5, 150, 105, 0.12), transparent 70%), var(--bg-primary)',
          height: '100%',
          overflowY: 'auto'
        }}
      >
        <div
          style={{
            maxWidth: '440px',
            width: '100%',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(5, 150, 105, 0.35)',
            borderRadius: '20px',
            padding: '32px 28px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6), 0 0 25px rgba(5, 150, 105, 0.15)'
          }}
        >
          {/* Header Icon */}
          <div style={{ textAlign: 'center', marginBottom: '22px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.25), rgba(16, 185, 129, 0.1))',
                border: '1px solid rgba(16, 185, 129, 0.45)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px'
              }}
            >
              <Shield size={30} color="var(--accent-emerald)" />
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: '800', margin: '0 0 6px 0', color: '#fff' }}>
              Create Secret Vault PIN
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-dim)', margin: 0 }}>
              Set a 4-digit PIN to establish your end-to-end encrypted private workspace.
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

          <form onSubmit={handleCreatePin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-dim)', marginBottom: '8px' }}>
                4-Digit PIN
              </label>
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
                  padding: '12px 16px',
                  fontSize: '1.25rem',
                  letterSpacing: '8px',
                  textAlign: 'center',
                  fontWeight: '700'
                }}
              />
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
                  fontSize: '1.25rem',
                  letterSpacing: '8px',
                  textAlign: 'center',
                  fontWeight: '700'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowPinMask(!showPinMask)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                {showPinMask ? <EyeOff size={14} /> : <Eye size={14} />}
                <span>{showPinMask ? 'Hide PIN' : 'Show PIN'}</span>
              </button>
            </div>

            {/* Mandatory Recovery Setup */}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px', marginTop: '6px' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
                Mandatory Recovery Setup
              </label>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', margin: '0 0 10px 0' }}>
                Required for resetting your PIN if forgotten. (No email OTP required).
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
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

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-dim)', marginBottom: '6px' }}>
                  Select your {recoveryMethod === 'birthday' ? 'Birthday' : 'Anniversary Date'} (DD / MM / YYYY)
                </label>
                <input
                  type="date"
                  value={recoveryDate}
                  onChange={(e) => setRecoveryDate(e.target.value)}
                  required
                  className="input-field"
                  style={{ width: '100%', padding: '10px 14px', fontSize: '0.88rem', color: '#fff' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || pinInput.length !== 4 || confirmPinInput.length !== 4 || !recoveryDate}
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
                marginTop: '10px'
              }}
            >
              {loading ? <Sparkles size={16} className="animate-spin" /> : <Lock size={16} />}
              <span>{loading ? 'Creating Vault...' : 'Create Vault & Open Dashboard'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: 2. EXISTING USER — PIN ENTRY (STRICT RULE: NO BACK ARROW!)
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
          background: 'radial-gradient(circle at 50% 20%, rgba(5, 150, 105, 0.12), transparent 70%), var(--bg-primary)',
          height: '100%'
        }}
      >
        <div
          style={{
            maxWidth: '400px',
            width: '100%',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(5, 150, 105, 0.35)',
            borderRadius: '20px',
            padding: '34px 28px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6), 0 0 25px rgba(5, 150, 105, 0.15)'
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.25), rgba(16, 185, 129, 0.1))',
                border: '1px solid rgba(16, 185, 129, 0.45)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px'
              }}
            >
              <Lock size={30} color="var(--accent-emerald)" />
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: '800', margin: '0 0 6px 0', color: '#fff' }}>
              Secret Vault
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-dim)', margin: 0 }}>
              Enter your 4-digit PIN to access encrypted transmissions.
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

          <form onSubmit={handleUnlockPin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <input
                type={showPinMask ? 'text' : 'password'}
                inputMode="numeric"
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="••••"
                autoFocus
                required
                className="input-field"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '1.4rem',
                  letterSpacing: '10px',
                  textAlign: 'center',
                  fontWeight: '700'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setShowPinMask(!showPinMask)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                {showPinMask ? <EyeOff size={14} /> : <Eye size={14} />}
                <span>{showPinMask ? 'Hide' : 'Show'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setViewState('FORGOT_PIN_DATE');
                }}
                style={{ background: 'none', border: 'none', color: 'var(--accent-emerald)', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' }}
              >
                Forgot PIN?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || pinInput.length !== 4}
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
              {loading ? <Sparkles size={16} className="animate-spin" /> : <Shield size={16} />}
              <span>{loading ? 'Decrypting...' : 'Unlock Vault'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: 3. FORGOT PIN DATE VERIFICATION (STRICT RULE: NO BACK ARROW, NO OTP!)
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
          background: 'radial-gradient(circle at 50% 20%, rgba(5, 150, 105, 0.12), transparent 70%), var(--bg-primary)',
          height: '100%'
        }}
      >
        <div
          style={{
            maxWidth: '420px',
            width: '100%',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(5, 150, 105, 0.35)',
            borderRadius: '20px',
            padding: '34px 28px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6), 0 0 25px rgba(5, 150, 105, 0.15)'
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.25), rgba(16, 185, 129, 0.1))',
                border: '1px solid rgba(16, 185, 129, 0.45)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px'
              }}
            >
              <KeyRound size={30} color="var(--accent-emerald)" />
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: '800', margin: '0 0 6px 0', color: '#fff' }}>
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
  // RENDER: 4. SET NEW PIN AFTER RECOVERY (STRICT RULE: NO BACK ARROW!)
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
          background: 'radial-gradient(circle at 50% 20%, rgba(5, 150, 105, 0.12), transparent 70%), var(--bg-primary)',
          height: '100%'
        }}
      >
        <div
          style={{
            maxWidth: '400px',
            width: '100%',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(5, 150, 105, 0.35)',
            borderRadius: '20px',
            padding: '34px 28px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6), 0 0 25px rgba(5, 150, 105, 0.15)'
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.25), rgba(16, 185, 129, 0.1))',
                border: '1px solid rgba(16, 185, 129, 0.45)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px'
              }}
            >
              <KeyRound size={30} color="var(--accent-emerald)" />
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: '800', margin: '0 0 6px 0', color: '#fff' }}>
              Set New Secret PIN
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-dim)', margin: 0 }}>
              Enter a new 4-digit PIN for your Secret Vault.
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
                New 4-Digit PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="••••"
                autoFocus
                required
                className="input-field"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '1.25rem',
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
                  fontSize: '1.25rem',
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
              <span>{loading ? 'Updating...' : 'Reset PIN & Open Dashboard'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: 5. FULL-PAGE SECRET VAULT DASHBOARD (UNLOCKED)
  // THE BACK ARROW [←] APPEARS ONLY HERE!
  // =========================================================================
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        background: '#0a0f1d',
        color: '#e2e8f0',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        border: '1px solid rgba(16, 185, 129, 0.2)'
      }}
    >
      {/* ----------------------------------------------------------------- */}
      {/* GLOBAL SECRET VAULT HEADER: [←] 🛡 Secret Vault [End-to-End Encrypted] */}
      {/* CRITICAL: NO AUDIO CALL OR VIDEO CALL BUTTONS IN THIS HEADER!      */}
      {/* ----------------------------------------------------------------- */}
      <div
        style={{
          padding: '12px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(10, 15, 29, 0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Dashboard-Only Back Arrow to return to normal AI Bots / Main Chat */}
          <button
            type="button"
            onClick={onClose}
            title="Return to Main Chat / AI Bots"
            aria-label="Return to Main Chat"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#fff',
              width: '36px',
              height: '36px',
              borderRadius: '9px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <ArrowLeft size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: '800', fontSize: '1.05rem', letterSpacing: '0.02em' }}>
            <Shield size={20} color="#10b981" />
            <span>Secret Vault</span>
          </div>

          <div
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#34d399',
              fontSize: '0.74rem',
              fontWeight: '700',
              letterSpacing: '0.02em'
            }}
          >
            End-to-End Encrypted
          </div>
        </div>

        {/* Global Header Actions: Lock/Logout ONLY (NO Audio/Video Call Buttons!) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={handleLockVault}
            title="Lock Secret Vault"
            style={{
              padding: '7px 12px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              fontSize: '0.8rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'background 0.2s ease'
            }}
          >
            <LogOut size={14} />
            <span>Lock</span>
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* DASHBOARD WORKSPACE BODY: 4 COLUMNS / PANELS                      */}
      {/* LEFT: Navigation | MIDDLE-LEFT: List | CENTER: Chat | RIGHT: Profile */}
      {/* ----------------------------------------------------------------- */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>

        {/* =============================================================== */}
        {/* PANEL 1: SECRET VAULT LEFT NAVIGATION (WIDTH: ~210px)          */}
        {/* =============================================================== */}
        <div
          style={{
            width: '210px',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(15, 23, 42, 0.85)',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0
          }}
        >
          {/* Vault Branding Pill */}
          <div style={{ padding: '16px 14px 12px 14px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={16} color="#10b981" />
              <span>Secret Vault</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: '600', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Lock size={11} />
              <span>Private & Encrypted</span>
            </div>
          </div>

          {/* Navigation Items */}
          <div style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
            {[
              { id: 'inbox', label: 'Inbox', icon: Shield, badge: conversations.reduce((acc, c) => acc + (c.unread || 0), 0) },
              { id: 'search', label: 'Search', icon: Search },
              { id: 'calls', label: 'Call Logs', icon: Phone }, // STRICTLY "Call Logs", NO "Files"
              { id: 'media', label: 'Media', icon: ImageIcon },
              { id: 'shared_files', label: 'Shared Files', icon: FileText },
              { id: 'starred', label: 'Starred', icon: Star },
              { id: 'archive', label: 'Archive', icon: FolderArchive },
              { id: 'settings', label: 'Settings', icon: SettingsIcon }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveNav(item.id);
                    if (item.id === 'search') {
                      setSearchQuery('');
                      setSearchResults([]);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: isActive ? 'rgba(16, 185, 129, 0.16)' : 'transparent',
                    color: isActive ? '#34d399' : '#94a3b8',
                    fontWeight: isActive ? '700' : '500',
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon size={16} color={isActive ? '#10b981' : 'currentColor'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span
                      style={{
                        padding: '2px 6px',
                        borderRadius: '10px',
                        background: '#10b981',
                        color: '#000',
                        fontSize: '0.68rem',
                        fontWeight: '800'
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Current User Card */}
          <div
            style={{
              padding: '12px 14px',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(0, 0, 0, 0.2)'
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                fontWeight: '700',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {(activeUser?.full_name || activeUser?.username || 'U')[0].toUpperCase()}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {activeUser?.full_name || activeUser?.username || 'Scholar'}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#10b981' }}>
                ● Active Encrypted
              </div>
            </div>
          </div>
        </div>

        {/* =============================================================== */}
        {/* PANEL 2: MIDDLE-LEFT LIST / INBOX (WIDTH: ~310px)               */}
        {/* =============================================================== */}
        <div
          style={{
            width: '310px',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0
          }}
        >
          {/* Top Panel Title & New Chat Action */}
          <div
            style={{
              padding: '14px 16px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <h3 style={{ fontSize: '0.96rem', fontWeight: '800', margin: 0, color: '#fff' }}>
              {activeNav === 'inbox' && 'Encrypted Inbox'}
              {activeNav === 'search' && 'Search Scholars'}
              {activeNav === 'calls' && 'Call Logs'}
              {activeNav === 'media' && 'Encrypted Media'}
              {activeNav === 'shared_files' && 'Shared Files'}
              {activeNav === 'starred' && 'Starred Messages'}
              {activeNav === 'archive' && 'Archive'}
              {activeNav === 'settings' && 'Vault Settings'}
            </h3>

            {/* New Chat Button */}
            <button
              type="button"
              onClick={() => {
                setActiveNav('search');
                setSearchQuery('');
                setSearchResults([]);
              }}
              title="New Private Chat"
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Quick Filter / Search input */}
          <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
            <div style={{ position: 'relative' }}>
              <Search
                size={14}
                style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}
              />
              <input
                type="text"
                placeholder={activeNav === 'search' ? 'Search users by name...' : 'Search users, groups, or messages...'}
                value={activeNav === 'search' ? searchQuery : ''}
                onChange={(e) => {
                  if (activeNav === 'search') {
                    handleSearchScholars(e.target.value);
                  } else {
                    setActiveNav('search');
                    handleSearchScholars(e.target.value);
                  }
                }}
                className="input-field"
                style={{
                  width: '100%',
                  padding: '7px 10px 7px 32px',
                  fontSize: '0.8rem',
                  borderRadius: '8px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#fff'
                }}
              />
            </div>
          </div>

          {/* List Content based on active navigation */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

            {/* --- INBOX LIST --- */}
            {activeNav === 'inbox' && (
              conversations.length === 0 ? (
                /* NEW USER EMPTY STATE PER SECTION 7: ZERO FAKE MESSAGES */
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '30px 20px',
                    textAlign: 'center'
                  }}
                >
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '16px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '14px'
                    }}
                  >
                    <Shield size={24} color="#10b981" />
                  </div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: '700', color: '#fff', margin: '0 0 6px 0' }}>
                    No conversations yet
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 16px 0', lineHeight: 1.4 }}>
                    Search for a scholar to start a private conversation.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveNav('search');
                      setSearchQuery('');
                    }}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      background: '#10b981',
                      border: 'none',
                      color: '#000',
                      fontWeight: '700',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Search size={14} />
                    <span>Search Scholars</span>
                  </button>
                </div>
              ) : (
                /* EXISTING REAL USER CONVERSATIONS */
                conversations.map((conv) => {
                  const isSelected = activeConversation?.id === conv.id;
                  const contact = conv.contact || {};
                  const lastMsg = conv.lastMessage;

                  // Derive message type indicator
                  let msgSnippet = lastMsg?.text || 'No messages yet';
                  if (lastMsg?.mediaType === 'image') msgSnippet = '📷 Photo';
                  else if (lastMsg?.mediaType === 'video') msgSnippet = '🎥 Video';
                  else if (lastMsg?.mediaType === 'doc' || lastMsg?.mediaType === 'document') msgSnippet = '📄 Document';
                  else if (lastMsg?.mediaType === 'audio') msgSnippet = '🎵 Audio Memo';
                  else if (lastMsg?.mediaType === 'location') msgSnippet = '📍 Shared Location';

                  return (
                    <div
                      key={conv.id}
                      onClick={() => selectConversation(conv)}
                      style={{
                        padding: '12px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                        borderLeft: isSelected ? '3px solid #10b981' : '3px solid transparent',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      {/* Contact Avatar */}
                      <div style={{ position: 'relative' }}>
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.4), rgba(5, 150, 105, 0.6))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.95rem',
                            fontWeight: '700',
                            color: '#fff',
                            border: '1px solid rgba(16, 185, 129, 0.3)'
                          }}
                        >
                          {contact.profile_image ? (
                            <img
                              src={contact.profile_image}
                              alt={contact.name}
                              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                            />
                          ) : (
                            contact.avatar || (contact.name || 'S')[0].toUpperCase()
                          )}
                        </div>
                        {contact.online && (
                          <div
                            style={{
                              position: 'absolute',
                              bottom: '0px',
                              right: '0px',
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              background: '#10b981',
                              border: '2px solid #0f172a'
                            }}
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                          <span style={{ fontSize: '0.86rem', fontWeight: '700', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {contact.name || contact.username || 'Scholar'}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                            {lastMsg?.time ? new Date(lastMsg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.78rem', color: isSelected ? '#cbd5e1' : '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {msgSnippet}
                          </span>
                          {conv.unread > 0 && (
                            <span
                              style={{
                                padding: '1px 6px',
                                borderRadius: '10px',
                                background: '#10b981',
                                color: '#000',
                                fontSize: '0.66rem',
                                fontWeight: '800'
                              }}
                            >
                              {conv.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )
            )}

            {/* --- SCHOLAR SEARCH TAB --- */}
            {activeNav === 'search' && (
              <div style={{ padding: '10px 14px' }}>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '10px' }}>
                  Search for any registered Nipix scholar by username or full name:
                </div>
                {isSearching ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#10b981' }}>
                    <Sparkles size={20} className="animate-spin" />
                  </div>
                ) : searchResults.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => handleStartConversationWithUser(user)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '10px',
                          background: 'rgba(0, 0, 0, 0.25)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #10b981, #059669)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              fontWeight: '700',
                              fontSize: '0.85rem'
                            }}
                          >
                            {(user.name || user.username || 'U')[0].toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#fff' }}>
                              {user.name}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                              @{user.username}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          style={{
                            padding: '5px 10px',
                            borderRadius: '6px',
                            background: '#10b981',
                            border: 'none',
                            color: '#000',
                            fontSize: '0.74rem',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          Chat
                        </button>
                      </div>
                    ))}
                  </div>
                ) : searchQuery.trim() ? (
                  <div style={{ padding: '24px 10px', textAlign: 'center', color: '#64748b', fontSize: '0.82rem' }}>
                    No scholars found matching "{searchQuery}"
                  </div>
                ) : (
                  <div style={{ padding: '24px 10px', textAlign: 'center', color: '#64748b', fontSize: '0.82rem' }}>
                    Type a username to find scholars.
                  </div>
                )}
              </div>
            )}

            {/* --- CALL LOGS TAB (SECTION 29: STRICTLY CALL LOGS, NO FILES) --- */}
            {activeNav === 'calls' && (
              callLogs.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.25)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '12px'
                    }}
                  >
                    <Phone size={22} color="#60a5fa" />
                  </div>
                  <h4 style={{ fontSize: '0.94rem', fontWeight: '700', color: '#fff', margin: '0 0 6px 0' }}>
                    No call logs yet
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
                    Encrypted audio and video calls will appear here.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {callLogs.map((log) => {
                    const isAudio = log.callType === 'audio';
                    const isOutgoing = log.direction === 'outgoing';
                    const contact = log.contact || {};

                    return (
                      <div
                        key={log.id}
                        style={{
                          padding: '12px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              background: 'rgba(255, 255, 255, 0.06)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.85rem',
                              fontWeight: '700',
                              color: '#fff'
                            }}
                          >
                            {(contact.name || contact.username || 'S')[0].toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#fff' }}>
                              {contact.name || contact.username || 'Scholar'}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#94a3b8' }}>
                              {isOutgoing ? (
                                <ArrowUpRight size={12} color="#10b981" />
                              ) : (
                                <ArrowDownLeft size={12} color="#60a5fa" />
                              )}
                              <span>{isOutgoing ? 'Outgoing' : 'Incoming'}</span>
                              <span>•</span>
                              <span>{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', color: isAudio ? '#10b981' : '#60a5fa', fontSize: '0.78rem', fontWeight: '700' }}>
                            {isAudio ? <Phone size={13} /> : <Video size={13} />}
                            <span>{isAudio ? 'Audio' : 'Video'}</span>
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                            {formatSeconds(log.duration || 0)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}

            {/* --- MEDIA TAB --- */}
            {activeNav === 'media' && (
              conversationMedia.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem' }}>
                  No media in this vault workspace yet.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', padding: '10px' }}>
                  {conversationMedia.map((m, idx) => (
                    <div
                      key={idx}
                      onClick={() => setPreviewMediaModal(m)}
                      style={{
                        position: 'relative',
                        paddingBottom: '100%',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        background: '#000'
                      }}
                    >
                      {m.mediaType === 'image' ? (
                        <img
                          src={m.mediaUrl}
                          alt="vault media"
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Video size={24} color="#60a5fa" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            )}

            {/* --- SHARED FILES TAB --- */}
            {activeNav === 'shared_files' && (
              conversationDocs.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem' }}>
                  No shared documents yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px' }}>
                  {conversationDocs.map((doc, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: 'rgba(0,0,0,0.2)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                    >
                      <FileText size={18} color="#10b981" />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {doc.fileName || doc.text}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{doc.fileSize || 'Encrypted File'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* --- STARRED TAB --- */}
            {activeNav === 'starred' && (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem' }}>
                No starred messages in vault.
              </div>
            )}

            {/* --- ARCHIVE TAB --- */}
            {activeNav === 'archive' && (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem' }}>
                Archive is empty.
              </div>
            )}

            {/* --- SETTINGS TAB --- */}
            {activeNav === 'settings' && (
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Change PIN Card */}
                <div style={{ background: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '0.88rem', fontWeight: '800', color: '#fff' }}>
                    Change 4-Digit PIN
                  </h4>
                  {settingsPinSuccess && (
                    <div style={{ color: '#34d399', fontSize: '0.78rem', marginBottom: '8px' }}>
                      {settingsPinSuccess}
                    </div>
                  )}
                  <form onSubmit={handleSettingsChangePin} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="Current 4-digit PIN"
                      value={settingsCurrentPin}
                      onChange={(e) => setSettingsCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      className="input-field"
                      style={{ fontSize: '0.82rem', padding: '8px 10px' }}
                    />
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="New 4-digit PIN"
                      value={settingsNewPin}
                      onChange={(e) => setSettingsNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      className="input-field"
                      style={{ fontSize: '0.82rem', padding: '8px 10px' }}
                    />
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="Confirm New PIN"
                      value={settingsConfirmPin}
                      onChange={(e) => setSettingsConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      className="input-field"
                      style={{ fontSize: '0.82rem', padding: '8px 10px' }}
                    />
                    <button
                      type="submit"
                      disabled={loading || settingsNewPin.length !== 4}
                      style={{
                        padding: '8px',
                        background: '#10b981',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#000',
                        fontWeight: '700',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      Update PIN
                    </button>
                  </form>
                </div>

                {/* Update Recovery Date */}
                <div style={{ background: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '0.88rem', fontWeight: '800', color: '#fff' }}>
                    Update Recovery Details
                  </h4>
                  {settingsRecSuccess && (
                    <div style={{ color: '#34d399', fontSize: '0.78rem', marginBottom: '8px' }}>
                      {settingsRecSuccess}
                    </div>
                  )}
                  <form onSubmit={handleSettingsUpdateRecovery} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="Current 4-digit PIN"
                      value={settingsCurrentPin}
                      onChange={(e) => setSettingsCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      className="input-field"
                      style={{ fontSize: '0.82rem', padding: '8px 10px' }}
                    />
                    <select
                      value={settingsRecMethod}
                      onChange={(e) => setSettingsRecMethod(e.target.value)}
                      className="input-field"
                      style={{ fontSize: '0.82rem', padding: '8px 10px', color: '#fff' }}
                    >
                      <option value="birthday" style={{ background: '#0f172a' }}>Birthday</option>
                      <option value="anniversary" style={{ background: '#0f172a' }}>Anniversary Date</option>
                    </select>
                    <input
                      type="date"
                      value={settingsRecDate}
                      onChange={(e) => setSettingsRecDate(e.target.value)}
                      className="input-field"
                      style={{ fontSize: '0.82rem', padding: '8px 10px', color: '#fff' }}
                    />
                    <button
                      type="submit"
                      disabled={loading || !settingsRecDate}
                      style={{
                        padding: '8px',
                        background: '#10b981',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#000',
                        fontWeight: '700',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      Save Recovery Details
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* =============================================================== */}
        {/* PANEL 3: CENTER ACTIVE CHAT WORKSPACE (FLEX: 1)                 */}
        {/* =============================================================== */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: '#0a0f1d' }}>

          {activeConversation ? (
            <>
              {/* Active Chat Header */}
              {/* IMPORTANT: AUDIO CALL & VIDEO CALL BUTTONS LIVE HERE! (NOT IN GLOBAL HEADER) */}
              <div
                style={{
                  padding: '12px 18px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  background: 'rgba(15, 23, 42, 0.75)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                {/* Contact Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.5), rgba(5, 150, 105, 0.8))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: '700',
                      fontSize: '0.95rem'
                    }}
                  >
                    {activeConversation.contact?.profile_image ? (
                      <img
                        src={activeConversation.contact.profile_image}
                        alt="Contact"
                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      activeConversation.contact?.avatar || (activeConversation.contact?.name || 'S')[0].toUpperCase()
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#fff' }}>
                      {activeConversation.contact?.name || activeConversation.contact?.username || 'Scholar'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Lock size={10} />
                      <span>Encrypted Peer • {activeConversation.contact?.online ? 'Online' : 'Offline'}</span>
                    </div>
                  </div>
                </div>

                {/* Chat Action Buttons: Audio Call, Video Call, Profile Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Audio Call Button (Only in chat header & contact profile!) */}
                  <button
                    type="button"
                    onClick={() => startCall('audio')}
                    title="Audio Call"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'rgba(16, 185, 129, 0.12)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      color: '#34d399',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <Phone size={16} />
                  </button>

                  {/* Video Call Button (Only in chat header & contact profile!) */}
                  <button
                    type="button"
                    onClick={() => startCall('video')}
                    title="Video Call"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'rgba(59, 130, 246, 0.12)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      color: '#60a5fa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <Video size={16} />
                  </button>

                  {/* Contact Profile Drawer Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowProfileDrawer(!showProfileDrawer)}
                    title="View Contact Profile"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: showProfileDrawer ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                      border: showProfileDrawer ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: showProfileDrawer ? '#34d399' : '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <Info size={16} />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.03), transparent 70%), #0a0f1d'
                }}
              >
                {/* Security Announcement */}
                <div style={{ textAlign: 'center', margin: '6px 0 14px 0' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '5px 12px',
                      borderRadius: '16px',
                      background: 'rgba(16, 185, 129, 0.08)',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      color: '#34d399',
                      fontSize: '0.72rem',
                      fontWeight: '600'
                    }}
                  >
                    <Lock size={12} />
                    <span>Messages are end-to-end encrypted with zero-knowledge keys.</span>
                  </div>
                </div>

                {loadingMessages ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#10b981' }}>
                    <Sparkles size={24} className="animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b', fontSize: '0.84rem' }}>
                    No messages yet in this encrypted conversation.
                    <div style={{ marginTop: '6px', color: '#94a3b8' }}>
                      Send the first message below to connect.
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isUser = activeUser?.id
                      ? String(msg.senderId) === String(activeUser?.id)
                      : Boolean(msg.isUser);

                    return (
                      <div
                        key={msg.id}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: isUser ? 'flex-end' : 'flex-start',
                          maxWidth: '78%',
                          alignSelf: isUser ? 'flex-end' : 'flex-start'
                        }}
                      >
                        <div
                          style={{
                            padding: '10px 14px',
                            borderRadius: isUser ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                            background: isUser
                              ? 'linear-gradient(135deg, #059669, #10b981)'
                              : 'rgba(255, 255, 255, 0.06)',
                            border: isUser ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                            color: '#fff',
                            fontSize: '0.88rem',
                            lineHeight: 1.45,
                            wordBreak: 'break-word',
                            boxShadow: isUser ? '0 4px 14px rgba(5, 150, 105, 0.3)' : 'none'
                          }}
                        >
                          {/* Image Attachment Preview */}
                          {msg.mediaType === 'image' && msg.mediaUrl && (
                            <div style={{ marginBottom: '8px', borderRadius: '10px', overflow: 'hidden' }}>
                              <img
                                src={msg.mediaUrl}
                                alt="attachment"
                                onClick={() => setPreviewMediaModal(msg)}
                                style={{ maxWidth: '280px', maxHeight: '200px', objectFit: 'cover', cursor: 'pointer', display: 'block' }}
                              />
                            </div>
                          )}

                          {/* Video Attachment Preview */}
                          {msg.mediaType === 'video' && msg.mediaUrl && (
                            <div style={{ marginBottom: '8px', borderRadius: '10px', overflow: 'hidden' }}>
                              <video
                                src={msg.mediaUrl}
                                controls
                                style={{ maxWidth: '280px', maxHeight: '200px', display: 'block' }}
                              />
                            </div>
                          )}

                          {/* Audio Attachment Preview */}
                          {msg.mediaType === 'audio' && msg.mediaUrl && (
                            <div style={{ marginBottom: '8px' }}>
                              <audio
                                src={msg.mediaUrl}
                                controls
                                style={{ maxWidth: '280px', height: '36px', display: 'block' }}
                              />
                            </div>
                          )}

                          {/* Document Attachment Preview */}
                          {(msg.mediaType === 'doc' || msg.mediaType === 'document') && (
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                background: 'rgba(0, 0, 0, 0.25)',
                                marginBottom: msg.text ? '6px' : 0
                              }}
                            >
                              <FileText size={22} color="#10b981" />
                              <div style={{ minWidth: 0, flex: 1 }}>
                                <div style={{ fontSize: '0.82rem', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {msg.fileName || msg.text}
                                </div>
                                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                                  {msg.fileSize || 'Encrypted Doc'}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Location Attachment Preview */}
                          {msg.mediaType === 'location' && (
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                background: 'rgba(0, 0, 0, 0.25)',
                                marginBottom: '6px'
                              }}
                            >
                              <MapPin size={20} color="#f87171" />
                              <div style={{ minWidth: 0, flex: 1 }}>
                                <div style={{ fontSize: '0.82rem', fontWeight: '700' }}>
                                  Encrypted Location
                                </div>
                                <a
                                  href={msg.mediaUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ fontSize: '0.74rem', color: '#38bdf8', textDecoration: 'underline' }}
                                >
                                  Open in Maps
                                </a>
                              </div>
                            </div>
                          )}

                          {/* Text Content */}
                          {msg.text && (
                            <div>{msg.text}</div>
                          )}

                          {/* Message Metadata */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              gap: '4px',
                              marginTop: '4px',
                              fontSize: '0.68rem',
                              color: isUser ? 'rgba(255, 255, 255, 0.75)' : '#94a3b8'
                            }}
                          >
                            <span>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isUser && (
                              <CheckCheck size={13} color="#fff" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Composer / Attachment Menu */}
              <div
                style={{
                  padding: '12px 18px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  background: 'rgba(15, 23, 42, 0.85)',
                  position: 'relative'
                }}
              >
                {/* Attachment Dropup Menu */}
                {showAttachmentMenu && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '68px',
                      left: '18px',
                      background: 'rgba(15, 23, 42, 0.98)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '14px',
                      padding: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      boxShadow: '0 15px 30px rgba(0, 0, 0, 0.6)',
                      backdropFilter: 'blur(16px)',
                      zIndex: 30
                    }}
                  >
                    {[
                      { label: 'Photo / Image', icon: ImageIcon, action: () => imageInputRef.current?.click() },
                      { label: 'Video', icon: Video, action: () => videoInputRef.current?.click() },
                      { label: 'Document', icon: FileText, action: () => docInputRef.current?.click() },
                      { label: 'Audio File', icon: Mic, action: () => audioInputRef.current?.click() },
                      { label: 'Share Location', icon: MapPin, action: handleShareLocation }
                    ].map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={item.action}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 14px',
                            background: 'none',
                            border: 'none',
                            color: '#e2e8f0',
                            fontSize: '0.82rem',
                            fontWeight: '600',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'background 0.15s ease'
                          }}
                        >
                          <Icon size={16} color="#10b981" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Hidden File Pickers */}
                <input
                  type="file"
                  ref={imageInputRef}
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileUpload(e, 'image')}
                />
                <input
                  type="file"
                  ref={videoInputRef}
                  accept="video/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileUpload(e, 'video')}
                />
                <input
                  type="file"
                  ref={docInputRef}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileUpload(e, 'doc')}
                />
                <input
                  type="file"
                  ref={audioInputRef}
                  accept="audio/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileUpload(e, 'audio')}
                />

                {/* Composer Form */}
                <form onSubmit={handleSendMessage} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* Attachment Button */}
                  <button
                    type="button"
                    onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                    title="Attach Media or File"
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      background: showAttachmentMenu ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                      border: showAttachmentMenu ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: showAttachmentMenu ? '#34d399' : '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <Paperclip size={18} />
                  </button>

                  <input
                    type="text"
                    placeholder="Type an encrypted message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="input-field"
                    style={{
                      flex: 1,
                      padding: '11px 16px',
                      fontSize: '0.88rem',
                      borderRadius: '10px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#fff'
                    }}
                  />

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={!messageText.trim()}
                    style={{
                      width: '42px',
                      height: '38px',
                      borderRadius: '8px',
                      background: messageText.trim() ? '#10b981' : 'rgba(255, 255, 255, 0.06)',
                      border: 'none',
                      color: messageText.trim() ? '#000' : '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: messageText.trim() ? 'pointer' : 'default',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            /* EMPTY WORKSPACE PLACEHOLDER */
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 20px',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '20px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}
              >
                <Shield size={32} color="#10b981" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', margin: '0 0 6px 0' }}>
                Secret Vault Workspace
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: '360px', margin: '0 0 20px 0', lineHeight: 1.5 }}>
                Select an existing conversation from your inbox or search for a scholar to begin private messaging.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveNav('search');
                  setSearchQuery('');
                }}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  background: '#10b981',
                  border: 'none',
                  color: '#000',
                  fontWeight: '700',
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Plus size={16} />
                <span>Start New Conversation</span>
              </button>
            </div>
          )}

        </div>

        {/* =============================================================== */}
        {/* PANEL 4: RIGHT CONTACT PROFILE DRAWER (WIDTH: ~320px)           */}
        {/* OPENS VIA PROFILE/INFO ICON; CLOSES VIA [X] WITHOUT LEAVING VAULT */}
        {/* =============================================================== */}
        {showProfileDrawer && activeConversation && (
          <div
            style={{
              width: '320px',
              borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(15, 23, 42, 0.95)',
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 0
            }}
          >
            {/* Header with [X] Close Button */}
            <div
              style={{
                padding: '14px 18px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800', color: '#fff' }}>
                Contact Profile
              </h4>
              <button
                type="button"
                onClick={() => setShowProfileDrawer(false)}
                title="Close Profile"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Profile Avatar & Info Card */}
            <div style={{ padding: '24px 20px', textAlign: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.6), rgba(5, 150, 105, 0.9))',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.6rem',
                  fontWeight: '800',
                  color: '#fff',
                  border: '2px solid #10b981',
                  marginBottom: '12px',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.25)'
                }}
              >
                {activeConversation.contact?.profile_image ? (
                  <img
                    src={activeConversation.contact.profile_image}
                    alt="Contact"
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  activeConversation.contact?.avatar || (activeConversation.contact?.name || 'S')[0].toUpperCase()
                )}
              </div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>
                {activeConversation.contact?.name || activeConversation.contact?.username}
              </h3>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '14px' }}>
                @{activeConversation.contact?.username || 'scholar'}
              </div>

              {/* Action Buttons: Audio Call, Video Call, View Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => startCall('audio')}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '8px',
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#34d399',
                    fontSize: '0.74rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Phone size={15} />
                  <span>Audio Call</span>
                </button>

                <button
                  type="button"
                  onClick={() => startCall('video')}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '8px',
                    background: 'rgba(59, 130, 246, 0.12)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    color: '#60a5fa',
                    fontSize: '0.74rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Video size={15} />
                  <span>Video Call</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert(`Scholar Profile Details:\nName: ${activeConversation.contact?.name}\nUsername: @${activeConversation.contact?.username}`)}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    fontSize: '0.74rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Info size={15} />
                  <span>View Info</span>
                </button>
              </div>
            </div>

            {/* Chat Summary Card */}
            <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>
                Chat Summary
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center' }}>
                <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '8px 4px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '1rem', fontWeight: '800', color: '#10b981' }}>{conversationMedia.length}</div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Media</div>
                </div>
                <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '8px 4px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '1rem', fontWeight: '800', color: '#60a5fa' }}>{conversationDocs.length}</div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Docs</div>
                </div>
                <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '8px 4px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '1rem', fontWeight: '800', color: '#a78bfa' }}>{conversationLinks.length}</div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Links</div>
                </div>
              </div>
            </div>

            {/* Conversation Tabs: Media, Documents, Links */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
              {[
                { id: 'media', label: `Media (${conversationMedia.length})` },
                { id: 'docs', label: `Documents (${conversationDocs.length})` },
                { id: 'links', label: `Links (${conversationLinks.length})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setProfileActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    padding: '10px 4px',
                    background: profileActiveTab === tab.id ? 'rgba(16, 185, 129, 0.12)' : 'none',
                    border: 'none',
                    borderBottom: profileActiveTab === tab.id ? '2px solid #10b981' : '2px solid transparent',
                    color: profileActiveTab === tab.id ? '#34d399' : '#94a3b8',
                    fontSize: '0.74rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content for Conversation Specific Shared Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
              {profileActiveTab === 'media' && (
                conversationMedia.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px 10px', color: '#64748b', fontSize: '0.78rem' }}>
                    No media shared in this conversation.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                    {conversationMedia.map((m, idx) => (
                      <div
                        key={idx}
                        onClick={() => setPreviewMediaModal(m)}
                        style={{
                          position: 'relative',
                          paddingBottom: '100%',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          background: '#000'
                        }}
                      >
                        {m.mediaType === 'image' ? (
                          <img
                            src={m.mediaUrl}
                            alt="shared"
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Video size={18} color="#60a5fa" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )
              )}

              {profileActiveTab === 'docs' && (
                conversationDocs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px 10px', color: '#64748b', fontSize: '0.78rem' }}>
                    No documents shared in this conversation.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {conversationDocs.map((doc, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '6px',
                          background: 'rgba(0, 0, 0, 0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <FileText size={16} color="#10b981" />
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {doc.fileName || doc.text}
                          </div>
                          <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>{doc.fileSize || 'Doc'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              {profileActiveTab === 'links' && (
                conversationLinks.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px 10px', color: '#64748b', fontSize: '0.78rem' }}>
                    No links shared in this conversation.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {conversationLinks.map((item, idx) => (
                      <a
                        key={idx}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '8px 10px',
                          borderRadius: '6px',
                          background: 'rgba(0, 0, 0, 0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          textDecoration: 'none',
                          color: '#38bdf8'
                        }}
                      >
                        <ExternalLink size={14} color="#38bdf8" />
                        <span style={{ fontSize: '0.76rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.url}
                        </span>
                      </a>
                    ))}
                  </div>
                )
              )}
            </div>

          </div>
        )}

      </div>

      {/* =============================================================== */}
      {/* INCOMING CALL MODAL (AUDIO & VIDEO NOTIFICATION)                 */}
      {/* =============================================================== */}
      {incomingCall && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000
          }}
        >
          <div
            style={{
              maxWidth: '400px',
              width: '90%',
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '24px',
              padding: '36px 24px',
              textAlign: 'center',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85)'
            }}
          >
            <div
              style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.6), rgba(5, 150, 105, 0.9))',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: '800',
                color: '#fff',
                border: '3px solid #10b981',
                marginBottom: '16px',
                boxShadow: '0 0 35px rgba(16, 185, 129, 0.5)'
              }}
            >
              {(incomingCall.callerName || 'S')[0].toUpperCase()}
            </div>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1.3rem', fontWeight: '800', color: '#fff' }}>
              {incomingCall.callerName || 'Scholar'}
            </h3>
            <div style={{ fontSize: '0.88rem', color: '#10b981', fontWeight: '600', marginBottom: '28px' }}>
              Incoming Encrypted {incomingCall.callType === 'video' ? 'Video' : 'Audio'} Call...
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
              <button
                type="button"
                onClick={handleDeclineCall}
                title="Decline Call"
                style={{
                  padding: '12px 24px',
                  borderRadius: '14px',
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#f87171',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <PhoneOff size={18} />
                <span>Decline</span>
              </button>
              <button
                type="button"
                onClick={handleAcceptCall}
                title="Accept Call"
                style={{
                  padding: '12px 28px',
                  borderRadius: '14px',
                  background: '#10b981',
                  border: 'none',
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 18px rgba(16, 185, 129, 0.4)'
                }}
              >
                {incomingCall.callType === 'video' ? <Video size={18} /> : <Phone size={18} />}
                <span>Accept</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =============================================================== */}
      {/* CALL MODAL (AUDIO & VIDEO CALL INTERFACE)                       */}
      {/* =============================================================== */}
      {activeCall && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
          {/* Hidden Remote Audio Element for Live Audio Transmission */}
          <audio ref={remoteAudioRef} autoPlay playsInline style={{ display: 'none' }} />

          <div
            style={{
              maxWidth: activeCall.type === 'video' ? '680px' : '400px',
              width: '90%',
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: '24px',
              padding: '32px 24px',
              textAlign: 'center',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)'
            }}
          >
            {/* Call State / Avatar */}
            {activeCall.type === 'audio' ? (
              <div style={{ marginBottom: '24px' }}>
                <div
                  style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.5), rgba(5, 150, 105, 0.8))',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: '800',
                    color: '#fff',
                    border: '3px solid #10b981',
                    marginBottom: '16px',
                    boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  {(activeCall.contact?.name || activeCall.contact?.username || 'S')[0].toUpperCase()}
                </div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.3rem', fontWeight: '800', color: '#fff' }}>
                  {activeCall.contact?.name || activeCall.contact?.username}
                </h3>
                <div style={{
                  fontSize: '0.84rem',
                  color: activeCall.status === 'connected' ? '#10b981' : (activeCall.status === 'declined' || activeCall.status === 'busy' || activeCall.status === 'failed' ? '#f87171' : '#38bdf8'),
                  fontWeight: '600'
                }}>
                  {activeCall.status === 'calling' && 'Encrypted Audio Transmission • Calling...'}
                  {activeCall.status === 'ringing' && 'Encrypted Audio Transmission • Ringing...'}
                  {activeCall.status === 'connecting' && 'Encrypted Audio Transmission • Establishing Secure Peer Link...'}
                  {activeCall.status === 'connected' && 'Encrypted Audio Transmission • Connected'}
                  {activeCall.status === 'declined' && 'Encrypted Audio Transmission • Call Declined'}
                  {activeCall.status === 'busy' && 'Encrypted Audio Transmission • User Busy'}
                  {activeCall.status === 'ended' && 'Encrypted Audio Transmission • Call Ended'}
                  {activeCall.status === 'failed' && 'Encrypted Audio Transmission • Connection Failed'}
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff', marginTop: '10px', letterSpacing: '0.05em' }}>
                  {activeCall.status === 'connected' ? formatSeconds(callDuration) : (activeCall.status === 'calling' || activeCall.status === 'ringing' || activeCall.status === 'connecting' ? 'Securing Channel...' : '')}
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: '20px' }}>
                <div
                  style={{
                    width: '100%',
                    height: '280px',
                    borderRadius: '16px',
                    background: '#020617',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}
                >
                  {/* Remote Video Stream Feed */}
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: activeCall.status === 'connected' ? 'block' : 'none'
                    }}
                  />

                  {/* Fallback / Connecting State Placeholder */}
                  {activeCall.status !== 'connected' ? (
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          width: '70px',
                          height: '70px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.6rem',
                          fontWeight: '800',
                          color: '#fff',
                          marginBottom: '8px'
                        }}
                      >
                        {(activeCall.contact?.name || activeCall.contact?.username || 'S')[0].toUpperCase()}
                      </div>
                      <div style={{ color: '#38bdf8', fontSize: '0.82rem', fontWeight: '600' }}>
                        {activeCall.status === 'calling' && 'Calling Remote Peer...'}
                        {activeCall.status === 'ringing' && 'Ringing Remote Peer...'}
                        {activeCall.status === 'connecting' && 'Negotiating Video Stream...'}
                        {activeCall.status === 'declined' && 'Call Declined'}
                        {activeCall.status === 'busy' && 'User Busy'}
                        {activeCall.status === 'ended' && 'Call Ended'}
                      </div>
                    </div>
                  ) : callVideoOff ? (
                    <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Camera Paused</div>
                  ) : null}

                  {/* Local Pip Video Feed */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '90px',
                      height: '68px',
                      borderRadius: '8px',
                      background: 'rgba(0, 0, 0, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.68rem',
                      color: '#fff'
                    }}
                  >
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: !callVideoOff ? 'block' : 'none'
                      }}
                    />
                    {callVideoOff && <span>You</span>}
                  </div>
                </div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>
                  {activeCall.contact?.name || activeCall.contact?.username}
                </h3>
                <div style={{
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  color: activeCall.status === 'connected' ? '#10b981' : (activeCall.status === 'declined' || activeCall.status === 'busy' || activeCall.status === 'failed' ? '#f87171' : '#38bdf8')
                }}>
                  {activeCall.status === 'connected' ? formatSeconds(callDuration) : (activeCall.status === 'calling' ? 'Calling...' : activeCall.status === 'ringing' ? 'Ringing...' : activeCall.status === 'connecting' ? 'Securing Video Feed...' : '')}
                </div>
              </div>
            )}

            {/* Controls Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
              <button
                type="button"
                onClick={toggleMic}
                title={callMuted ? 'Unmute Microphone' : 'Mute Microphone'}
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: callMuted ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: callMuted ? '#f87171' : '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                {callMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </button>

              {activeCall.type === 'video' && (
                <button
                  type="button"
                  onClick={toggleVideo}
                  title={callVideoOff ? 'Turn Video On' : 'Turn Video Off'}
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: callVideoOff ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: callVideoOff ? '#f87171' : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  {callVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
                </button>
              )}

              {/* End Call Button */}
              <button
                type="button"
                onClick={handleEndCall}
                title="End Encrypted Call"
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: '#ef4444',
                  border: 'none',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4)'
                }}
              >
                <PhoneOff size={24} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =============================================================== */}
      {/* MEDIA PREVIEW MODAL                                             */}
      {/* =============================================================== */}
      {previewMediaModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
          onClick={() => setPreviewMediaModal(null)}
        >
          <div
            style={{
              maxWidth: '85vw',
              maxHeight: '85vh',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewMediaModal(null)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              <X size={26} />
            </button>
            <img
              src={previewMediaModal.mediaUrl}
              alt="Media Preview"
              style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '12px', display: 'block' }}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default SecretVault;
