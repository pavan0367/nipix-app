import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../utils/constants';
import vaultApi from '../services/vaultApi';

const CallContext = createContext(null);

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    return {
      activeCall: null,
      incomingCall: null,
      callDuration: 0,
      callMuted: false,
      callVideoOff: false,
      isReconnecting: false,
      connectionLostReason: null,
      onlineUsers: new Set(),
      showOnCallPopover: false,
      setShowOnCallPopover: () => {},
      startCall: () => {},
      handleAcceptCall: () => {},
      handleDeclineCall: () => {},
      handleEndCall: () => {},
      toggleMic: () => {},
      toggleVideo: () => {},
      unlockAudio: () => {},
      markMessagesAsRead: () => {},
      subscribeToMessages: () => () => {},
      subscribeToReadReceipts: () => () => {},
      localVideoRef: { current: null },
      remoteVideoRef: { current: null },
      remoteAudioRef: { current: null },
      localStreamRef: { current: null },
      remoteStreamRef: { current: null },
      socketRef: { current: null },
      formatDuration: (sec) => {
        const mins = Math.floor((sec || 0) / 60);
        const s = (sec || 0) % 60;
        return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      }
    };
  }
  return context;
};

// Production STUN & TURN Relay Configuration
const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:stun3.l.google.com:19302' },
  { urls: 'stun:stun4.l.google.com:19302' },
  ...(process.env.REACT_APP_TURN_SERVER_URL
    ? [
        {
          urls: process.env.REACT_APP_TURN_SERVER_URL.split(','),
          username: process.env.REACT_APP_TURN_USERNAME || undefined,
          credential: process.env.REACT_APP_TURN_CREDENTIAL || undefined
        }
      ]
    : [
        {
          urls: [
            'turn:openrelay.metered.ca:80',
            'turn:openrelay.metered.ca:443',
            'turn:openrelay.metered.ca:443?transport=tcp'
          ],
          username: 'openrelayproject',
          credential: 'openrelayproject'
        }
      ])
];

export const CallProvider = ({ children }) => {
  // Global Call States
  const [activeCall, setActiveCall] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [callMuted, setCallMuted] = useState(false);
  const [callVideoOff, setCallVideoOff] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [connectionLostReason, setConnectionLostReason] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [showOnCallPopover, setShowOnCallPopover] = useState(false);
  const [audioPlaybackBlocked, setAudioPlaybackBlocked] = useState(false);

  // References
  const socketRef = useRef(null);
  const activeCallRef = useRef(activeCall);
  const incomingCallRef = useRef(incomingCall);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const iceCandidateQueueRef = useRef({});
  const remoteAudioRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localVideoRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const messageListenersRef = useRef(new Set());
  const readReceiptListenersRef = useRef(new Set());

  useEffect(() => {
    activeCallRef.current = activeCall;
  }, [activeCall]);

  useEffect(() => {
    incomingCallRef.current = incomingCall;
  }, [incomingCall]);

  // Synchronous mobile audio unlock helper
  const unlockAudio = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          if (!window.__nipixAudioCtx) {
            window.__nipixAudioCtx = new AudioContextClass();
          }
          if (window.__nipixAudioCtx.state === 'suspended') {
            window.__nipixAudioCtx.resume().catch(() => {});
          }
        }
      }
      if (remoteAudioRef.current) {
        remoteAudioRef.current.play().catch(() => {});
      }
      setAudioPlaybackBlocked(false);
    } catch (e) {}
  }, []);

  // Persistent Socket Connection
  useEffect(() => {
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
      console.log('[CallContext Socket] connected:', socket.id);
    });

    socket.on('presence:sync', (data) => {
      if (data && Array.isArray(data.onlineUserIds)) {
        setOnlineUsers(new Set(data.onlineUserIds.map(Number)));
      }
    });

    socket.on('presence:update', (data) => {
      if (!data || !data.userId) return;
      const uid = Number(data.userId);
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        if (data.status === 'online') {
          next.add(uid);
        } else {
          next.delete(uid);
        }
        return next;
      });
    });

    socket.on('message:read', (data) => {
      readReceiptListenersRef.current.forEach((listener) => {
        try { listener(data); } catch (e) {}
      });
    });

    socket.on('vaultMessage', (data) => {
      messageListenersRef.current.forEach((listener) => {
        try { listener(data); } catch (e) {}
      });
    });

    // WebRTC Signaling
    socket.on('call:incoming', (data) => {
      console.log('[CallContext Socket] incoming call:', data.callId);
      const active = activeCallRef.current;
      if (active && ['calling', 'ringing', 'connecting', 'connected', 'reconnecting'].includes(active.status)) {
        socket.emit('call:busy', { callId: data.callId, targetUserId: data.callerId });
        return;
      }
      setIncomingCall(data);
    });

    socket.on('call:ringing', (data) => {
      setActiveCall((prev) => (prev && prev.callId === data.callId && prev.status === 'calling' ? { ...prev, status: 'ringing' } : prev));
    });

    socket.on('call:answer', async (data) => {
      const pc = peerConnectionRef.current;
      const active = activeCallRef.current;
      if (!pc || !active || active.callId !== data.callId) return;

      setActiveCall((prev) => (prev && prev.callId === data.callId ? { ...prev, status: 'connecting' } : prev));
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        await processIceQueue(data.callId);
      } catch (err) {
        console.warn('[CallContext] Error setting remote answer:', err.message);
      }
    });

    socket.on('call:ice-candidate', async (data) => {
      const pc = peerConnectionRef.current;
      const active = activeCallRef.current;
      const incoming = incomingCallRef.current;
      const isCallMatch = (active && active.callId === data.callId) || (incoming && incoming.callId === data.callId);
      if (!isCallMatch) return;

      const candidateObj = data.candidate && data.candidate.candidate !== undefined
        ? data.candidate
        : (data.candidate && data.candidate.toJSON ? data.candidate.toJSON() : data.candidate);

      if (pc && pc.remoteDescription && pc.remoteDescription.type) {
        if (candidateObj && (candidateObj.candidate || candidateObj.sdpMid !== null || candidateObj.sdpMLineIndex !== null)) {
          try {
            await pc.addIceCandidate(candidateObj);
          } catch (err) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(candidateObj));
            } catch (fallbackErr) {
              console.warn('[CallContext] Error adding ICE candidate:', fallbackErr.message);
            }
          }
        }
      } else {
        if (!iceCandidateQueueRef.current[data.callId]) {
          iceCandidateQueueRef.current[data.callId] = [];
        }
        iceCandidateQueueRef.current[data.callId].push(candidateObj);
      }
    });

    socket.on('call:declined', (data) => {
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
      const incoming = incomingCallRef.current;
      if (incoming && incoming.callId === data.callId) {
        setIncomingCall(null);
      }
    });

    socket.on('call:ended', (data) => {
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
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  // Continuous Call Duration Timer
  useEffect(() => {
    let timer = null;
    if (activeCall && activeCall.status === 'connected') {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else if (!activeCall) {
      setCallDuration(0);
    }
    return () => timer && clearInterval(timer);
  }, [activeCall?.status, Boolean(activeCall)]);

  const cleanupCallMedia = useCallback(() => {
    console.log('[CallContext] Cleaning up media tracks and peer connection');
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
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
    setIsReconnecting(false);
    setAudioPlaybackBlocked(false);
  }, []);

  const processIceQueue = async (callId) => {
    const queue = iceCandidateQueueRef.current[callId] || [];
    iceCandidateQueueRef.current[callId] = [];
    for (const candidate of queue) {
      try {
        if (peerConnectionRef.current && peerConnectionRef.current.remoteDescription) {
          const candObj = candidate && candidate.candidate !== undefined ? candidate : (candidate && candidate.toJSON ? candidate.toJSON() : candidate);
          if (candObj && (candObj.candidate || candObj.sdpMid !== null || candObj.sdpMLineIndex !== null)) {
            try {
              await peerConnectionRef.current.addIceCandidate(candObj);
            } catch (err) {
              await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candObj));
            }
          }
        }
      } catch (err) {
        console.warn('[CallContext] Error applying queued ICE candidate:', err.message);
      }
    }
  };

  const setupPeerConnection = useCallback((callId, targetUserId, callType) => {
    if (peerConnectionRef.current) {
      try { peerConnectionRef.current.close(); } catch (e) {}
      peerConnectionRef.current = null;
    }
    remoteStreamRef.current = null;
    iceCandidateQueueRef.current = {};

    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    peerConnectionRef.current = pc;

    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        const candidateData = event.candidate.toJSON ? event.candidate.toJSON() : {
          candidate: event.candidate.candidate,
          sdpMid: event.candidate.sdpMid,
          sdpMLineIndex: event.candidate.sdpMLineIndex,
          usernameFragment: event.candidate.usernameFragment
        };
        socketRef.current.emit('call:ice-candidate', {
          callId,
          targetUserId,
          candidate: candidateData
        });
      }
    };

    pc.ontrack = (event) => {
      console.log('[CallContext] remote track received:', event.track.kind);
      let stream = remoteStreamRef.current;
      if (!stream) {
        stream = new MediaStream();
        remoteStreamRef.current = stream;
      }
      if (event.streams && event.streams[0]) {
        event.streams[0].getTracks().forEach((track) => {
          if (!stream.getTracks().some((t) => t.id === track.id)) {
            stream.addTrack(track);
          }
        });
      }
      if (event.track && !stream.getTracks().some((t) => t.id === event.track.id)) {
        stream.addTrack(event.track);
      }

      event.track.onunmute = () => {
        console.log('[CallContext] remote track unmuted:', event.track.kind);
        playRemoteMedia(stream, callType);
      };

      playRemoteMedia(stream, callType);
    };

    const handleConnected = () => {
      console.log(`[CallContext] Call connected for call=${callId}`);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      setIsReconnecting(false);
      setActiveCall((prev) => (prev && prev.callId === callId ? { ...prev, status: 'connected', reconnecting: false } : prev));
      if (remoteStreamRef.current) {
        playRemoteMedia(remoteStreamRef.current, callType);
      }
    };

    const handleReconnecting = () => {
      console.warn(`[CallContext] Network quality degraded / Reconnecting for call=${callId}`);
      setIsReconnecting(true);
      setActiveCall((prev) => (prev && prev.callId === callId ? { ...prev, reconnecting: true } : prev));

      if (!reconnectTimeoutRef.current) {
        // Bounded 20-second recovery timeout for unstable connection
        reconnectTimeoutRef.current = setTimeout(() => {
          console.error(`[CallContext] Reconnection timeout exceeded for call=${callId}. Ending call.`);
          handleEndCall('Connection Lost');
        }, 20000);
      }
    };

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      console.log(`[CallContext] peerConnection state=${state}`);
      if (state === 'connected') {
        handleConnected();
      } else if (state === 'disconnected') {
        handleReconnecting();
      } else if (state === 'failed') {
        if (!navigator.onLine) {
          handleReconnecting();
        } else {
          setActiveCall((prev) => (prev && prev.callId === callId ? { ...prev, status: 'failed' } : prev));
          cleanupCallMedia();
          setTimeout(() => {
            setActiveCall((prev) => (prev && prev.callId === callId ? null : prev));
          }, 2000);
        }
      }
    };

    pc.oniceconnectionstatechange = () => {
      const iceState = pc.iceConnectionState;
      console.log(`[CallContext] iceConnectionState=${iceState}`);
      if (iceState === 'connected' || iceState === 'completed') {
        handleConnected();
      } else if (iceState === 'disconnected') {
        handleReconnecting();
      }
    };

    return pc;
  }, [cleanupCallMedia]);

  const playRemoteMedia = (stream, callType) => {
    // 1. Audio Call: route directly through dedicated remoteAudioRef
    if (callType === 'audio') {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = stream;
        remoteAudioRef.current.muted = false;
        remoteAudioRef.current.volume = 1.0;
        const playPromise = remoteAudioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('[CallContext] Remote audio playback blocked:', err.message);
            setAudioPlaybackBlocked(true);
          });
        }
      }
    } else {
      // 2. Video Call: on mobile browsers, remoteVideoRef plays video AND audio directly through device speaker
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
        remoteVideoRef.current.muted = false;
        remoteVideoRef.current.volume = 1.0;
        const playPromise = remoteVideoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('[CallContext] Remote video play error:', err.message);
          });
        }
      }
      // Backup audio element for video call
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = stream;
        // Kept muted during active video playback to prevent double-audio/echo
        remoteAudioRef.current.muted = true;
      }
    }
  };

  const startCall = async (type, conversation, contact, activeUser) => {
    if (!conversation || !contact) return;
    if (!socketRef.current || !socketRef.current.connected) {
      alert('Encrypted socket connection is offline. Please wait a moment and try again.');
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Media devices (Microphone/Camera) are not supported in this browser context.');
      return;
    }

    // Synchronous audio unlock on user gesture
    unlockAudio();
    cleanupCallMedia();

    const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        video: type === 'video' ? { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } : false
      });
    } catch (err) {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: type === 'video'
        });
      } catch (fallbackErr) {
        alert(type === 'video'
          ? 'Camera and microphone access are required for encrypted video calls.'
          : 'Microphone access is required for encrypted audio calls.');
        return;
      }
    }

    localStreamRef.current = stream;
    setCallMuted(false);
    setCallVideoOff(false);
    setCallDuration(0);
    setConnectionLostReason(null);

    setActiveCall({
      callId,
      type,
      direction: 'outgoing',
      contact,
      status: 'calling'
    });

    try {
      const pc = setupPeerConnection(callId, contact.id, type);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.getTransceivers().forEach((tr) => {
        if (tr.direction === 'recvonly') tr.direction = 'sendrecv';
      });

      if (localVideoRef.current && type === 'video') {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch(() => {});
      }

      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: type === 'video'
      });
      await pc.setLocalDescription(offer);

      socketRef.current.emit('call:offer', {
        callId,
        conversationId: conversation.id,
        recipientId: contact.id,
        callerId: activeUser?.id,
        callerName: activeUser?.full_name || activeUser?.username || 'Scholar',
        callType: type,
        sdp: offer
      });
    } catch (err) {
      console.error('[CallContext] Error starting call:', err.message);
      cleanupCallMedia();
      setActiveCall(null);
    }
  };

  const handleAcceptCall = async () => {
    const incoming = incomingCallRef.current;
    if (!incoming || !socketRef.current) return;

    setIncomingCall(null);
    unlockAudio();
    cleanupCallMedia();

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
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        video: callType === 'video' ? { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } : false
      });
    } catch (err) {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: callType === 'video'
        });
      } catch (fallbackErr) {
        socketRef.current.emit('call:decline', {
          callId,
          targetUserId: callerId,
          conversationId: incoming.conversationId,
          reason: 'permission_denied'
        });
        alert('Microphone/Camera permission is required to answer this call.');
        return;
      }
    }

    localStreamRef.current = stream;
    setCallMuted(false);
    setCallVideoOff(false);
    setCallDuration(0);
    setConnectionLostReason(null);

    setActiveCall({
      callId,
      type: callType,
      direction: 'incoming',
      contact: { id: callerId, name: incoming.callerName, username: incoming.callerName },
      status: 'connecting'
    });

    try {
      const pc = setupPeerConnection(callId, callerId, callType);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.getTransceivers().forEach((tr) => {
        if (tr.direction === 'recvonly') tr.direction = 'sendrecv';
      });

      if (localVideoRef.current && callType === 'video') {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch(() => {});
      }

      await pc.setRemoteDescription(new RTCSessionDescription(incoming.sdp));
      await processIceQueue(callId);

      const answer = await pc.createAnswer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: callType === 'video'
      });
      await pc.setLocalDescription(answer);

      socketRef.current.emit('call:answer', {
        callId,
        targetUserId: callerId,
        sdp: answer
      });
    } catch (err) {
      console.error('[CallContext] Error answering call:', err.message);
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
    } catch (e) {}

    setIncomingCall(null);
  };

  const handleEndCall = async (reason) => {
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

    if (active.direction === 'outgoing' && (active.status === 'calling' || active.status === 'ringing')) {
      if (socketRef.current && contactId) {
        socketRef.current.emit('call:cancel', { callId, targetUserId: contactId });
      }
      try {
        await vaultApi.recordCallLog({
          contactId,
          callType,
          direction: 'outgoing',
          status: 'cancelled',
          duration: 0
        });
      } catch (e) {}
    } else {
      if (socketRef.current && contactId) {
        socketRef.current.emit('call:end', { callId, targetUserId: contactId, duration });
      }
      try {
        await vaultApi.recordCallLog({
          contactId,
          callType,
          direction: active.direction || 'outgoing',
          status: reason === 'Connection Lost' ? 'failed' : (isConnected && duration > 0 ? 'completed' : 'cancelled'),
          duration
        });
      } catch (e) {}
    }

    if (reason === 'Connection Lost') {
      setConnectionLostReason('Connection Lost');
      setActiveCall((prev) => (prev ? { ...prev, status: 'ended', endReason: 'Connection Lost' } : null));
    } else {
      setActiveCall((prev) => (prev ? { ...prev, status: 'ended' } : null));
    }

    cleanupCallMedia();
    setTimeout(() => {
      setActiveCall(null);
      setCallDuration(0);
      setConnectionLostReason(null);
    }, reason === 'Connection Lost' ? 3000 : 1500);
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

  const markMessagesAsRead = useCallback((conversationId, messageIds) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('message:read', { conversationId, messageIds });
    }
  }, []);

  const subscribeToMessages = useCallback((handler) => {
    messageListenersRef.current.add(handler);
    return () => { messageListenersRef.current.delete(handler); };
  }, []);

  const subscribeToReadReceipts = useCallback((handler) => {
    readReceiptListenersRef.current.add(handler);
    return () => { readReceiptListenersRef.current.delete(handler); };
  }, []);

  return (
    <CallContext.Provider
      value={{
        activeCall,
        incomingCall,
        callDuration,
        callMuted,
        callVideoOff,
        isReconnecting,
        connectionLostReason,
        onlineUsers,
        showOnCallPopover,
        setShowOnCallPopover,
        startCall,
        handleAcceptCall,
        handleDeclineCall,
        handleEndCall,
        toggleMic,
        toggleVideo,
        unlockAudio,
        markMessagesAsRead,
        subscribeToMessages,
        subscribeToReadReceipts,
        localVideoRef,
        remoteVideoRef,
        remoteAudioRef,
        localStreamRef,
        remoteStreamRef,
        socketRef,
        formatDuration: (sec) => {
          const mins = Math.floor((sec || 0) / 60);
          const s = (sec || 0) % 60;
          return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
      }}
    >
      {/* Root Permanent Remote Audio Element */}
      <audio
        ref={remoteAudioRef}
        autoPlay
        playsInline
        style={{
          position: 'fixed',
          width: '1px',
          height: '1px',
          opacity: 0.001,
          pointerEvents: 'none',
          bottom: 0,
          right: 0,
          zIndex: -1
        }}
      />

      {/* Floating Mobile Tap-to-Enable Sound Banner if Autoplay Suspended */}
      {audioPlaybackBlocked && activeCall && activeCall.status === 'connected' && (
        <button
          type="button"
          onClick={unlockAudio}
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#fff',
            border: 'none',
            borderRadius: '9999px',
            padding: '10px 22px',
            fontSize: '0.85rem',
            fontWeight: '700',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
            zIndex: 10000,
            cursor: 'pointer'
          }}
        >
          🔊 Tap to enable audio
        </button>
      )}

      {children}
    </CallContext.Provider>
  );
};
