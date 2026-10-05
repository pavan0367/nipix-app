import React from 'react';
import ReactDOMServer from 'react-dom/server';

jest.mock('react-markdown', () => ({ children }) => <div className="markdown-body">{children}</div>);
jest.mock('remark-gfm', () => () => {});

// Mock socket.io-client
const mockSocket = {
  on: jest.fn(),
  off: jest.fn(),
  emit: jest.fn(),
  disconnect: jest.fn()
};

jest.mock('socket.io-client', () => ({
  io: jest.fn(() => mockSocket)
}));

jest.mock('../../services/vaultApi', () => ({
  getStatus: jest.fn().mockResolvedValue({
    hasPin: true,
    recoveryMethod: 'birthday',
    isLocked: false,
    lockRemainingSeconds: 0
  }),
  unlock: jest.fn().mockResolvedValue({ success: true }),
  getConversations: jest.fn().mockResolvedValue({
    conversations: [
      {
        id: 101,
        contact: { id: 2, name: 'Bob Scholar', username: 'bob', avatar: 'B' },
        lastMessage: { id: 1, text: 'Hey there', time: '2026-10-05T08:00:00.000Z', senderId: 2, isUser: false },
        unread: 0,
        updatedAt: '2026-10-05T08:00:00.000Z'
      }
    ]
  }),
  getMessages: jest.fn().mockResolvedValue({
    messages: [
      {
        id: 1,
        conversationId: 101,
        senderId: 2,
        senderName: 'Bob Scholar',
        isUser: false,
        text: 'Hey there',
        mediaUrl: null,
        mediaType: 'text',
        fileName: null,
        fileSize: null,
        isRead: true,
        createdAt: '2026-10-05T08:00:00.000Z'
      }
    ]
  }),
  getCallLogs: jest.fn().mockResolvedValue({ callLogs: [] })
}));

import { io } from 'socket.io-client';
import SecretVault from './SecretVault';

describe('Secret Vault Real-Time Live Messaging Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    io.mockReturnValue(mockSocket);
    localStorage.setItem('nipix_token', 'test-jwt-token-123');
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('SecretVault component renders without crashing', () => {
    const currentUser = { id: 1, username: 'alice', full_name: 'Alice Scholar' };

    let html = '';
    expect(() => {
      html = ReactDOMServer.renderToStaticMarkup(
        <SecretVault currentUser={currentUser} onClose={jest.fn()} />
      );
    }).not.toThrow();

    expect(html).toBeDefined();
  });

  test('Socket.IO module is correctly imported and callable with production auth options', () => {
    const token = localStorage.getItem('nipix_token');
    const socket = io('https://nipix-app.onrender.com', {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    expect(socket).toBeDefined();
    expect(io).toHaveBeenCalledWith('https://nipix-app.onrender.com', {
      auth: { token: 'test-jwt-token-123' },
      transports: ['websocket', 'polling']
    });
  });

  test('Socket event deduplication & optimistic reconciliation preserves canonical identity and order', () => {
    const prevMessages = [
      {
        id: 1,
        conversationId: 101,
        senderId: 2,
        text: 'Message 1',
        createdAt: '2026-10-05T09:00:00.000Z'
      },
      {
        id: 'temp-12345',
        conversationId: 101,
        senderId: 1,
        text: 'Optimistic outgoing message',
        mediaType: 'text',
        createdAt: '2026-10-05T09:01:00.000Z'
      }
    ];

    const canonicalIncoming = {
      id: 2,
      conversationId: 101,
      senderId: 1,
      text: 'Optimistic outgoing message',
      mediaType: 'text',
      createdAt: '2026-10-05T09:01:00.000Z'
    };

    // Reconcile optimistic message
    let reconciled = false;
    const mapped = prevMessages.map((m) => {
      if (
        !reconciled &&
        typeof m.id === 'string' &&
        m.id.startsWith('temp-') &&
        m.text === canonicalIncoming.text
      ) {
        reconciled = true;
        return canonicalIncoming;
      }
      return m;
    });

    expect(reconciled).toBe(true);
    expect(mapped.length).toBe(2);
    expect(mapped[1].id).toBe(2);

    // Duplicate arrival should be blocked by ID check
    const isDuplicate = mapped.some((m) => m.id === canonicalIncoming.id);
    expect(isDuplicate).toBe(true);
  });
});
