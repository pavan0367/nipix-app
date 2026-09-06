import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';

jest.mock('react-markdown', () => ({ children }) => <div className="markdown-body">{children}</div>);
jest.mock('remark-gfm', () => () => {});

import Chat, { AI_BOTS, CHAT_THEMES, getCurrentSystemTime, createBotWelcomeMessage } from '../../pages/Chat';
import BotProfileDashboard from './BotProfileDashboard';

// Mock Redux store
const createMockStore = () =>
  configureStore({
    reducer: {
      auth: () => ({
        user: { id: 'u1', username: 'test_scholar' },
        token: 'fake_jwt_token',
        isAuthenticated: true
      })
    }
  });

describe('Nipix AI Bots UX Consistency & Feature Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('1. Dynamic System Time & Intro Message Generators', () => {
    test('getCurrentSystemTime returns valid formatted time string with AM/PM', () => {
      const timeStr = getCurrentSystemTime();
      expect(timeStr).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/i);
    });

    test('createBotWelcomeMessage dynamically generates greeting with live local system time', () => {
      const sampleBot = AI_BOTS[0]; // ByteBot AI
      const msg = createBotWelcomeMessage(sampleBot);
      expect(msg.sender).toBe(sampleBot.name);
      expect(msg.isUser).toBe(false);
      expect(msg.text).toBe(sampleBot.introText);
      expect(msg.time).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/i);
    });
  });

  describe('2. All AI Bots Have Domain-Specific Personalized Intro Messages', () => {
    test('all 7 bots exist in AI_BOTS registry', () => {
      expect(AI_BOTS.length).toBe(7);
      const botIds = AI_BOTS.map((b) => b.id);
      expect(botIds).toContain('bytebot_ai');
      expect(botIds).toContain('cipher_09');
      expect(botIds).toContain('spark_x');
      expect(botIds).toContain('archivist');
      expect(botIds).toContain('novamind');
      expect(botIds).toContain('aether');
      expect(botIds).toContain('sakura');
    });

    test.each(AI_BOTS)('bot %s has personalized greeting asking what help is needed', (bot) => {
      expect(bot.introText).toBeDefined();
      expect(typeof bot.introText).toBe('string');
      expect(bot.introText.length).toBeGreaterThan(20);
      expect(bot.introText.toLowerCase()).toContain('what would you like me to help you with today?');
      expect(bot.description).toBeDefined();
      expect(Array.isArray(bot.specialtiesList)).toBe(true);
      expect(bot.specialtiesList.length).toBeGreaterThanOrEqual(5);
    });

    test('Sakura intro specifically references Japanese Language & JLPT', () => {
      const sakura = AI_BOTS.find((b) => b.id === 'sakura');
      expect(sakura.introText).toBe("Hello! 🌸 I'm Sakura, your Japanese Language & JLPT assistant. What would you like me to help you with today?");
      expect(sakura.specialtiesList).toContain('Japanese Grammar');
      expect(sakura.specialtiesList).toContain('JLPT N5 to N1 Preparation');
    });

    test('Aether intro specifically references Science, Innovation & Technology', () => {
      const aether = AI_BOTS.find((b) => b.id === 'aether');
      expect(aether.introText).toBe("Hello! I'm Aether, your Science, Innovation & Technology assistant. What would you like me to help you with today?");
    });

    test('ByteBot AI intro specifically references Programming & Software Engineering', () => {
      const bytebot = AI_BOTS.find((b) => b.id === 'bytebot_ai');
      expect(bytebot.introText).toBe("Hello! I'm ByteBot AI, your Programming & Software Engineering assistant. What would you like me to help you with today?");
    });
  });

  describe('3. Chat Themes System', () => {
    test('CHAT_THEMES defines 6 complete theme palettes including sakura', () => {
      const themeKeys = Object.keys(CHAT_THEMES);
      expect(themeKeys).toContain('cyber');
      expect(themeKeys).toContain('neon');
      expect(themeKeys).toContain('emerald');
      expect(themeKeys).toContain('amber');
      expect(themeKeys).toContain('obsidian');
      expect(themeKeys).toContain('sakura');

      themeKeys.forEach((key) => {
        const theme = CHAT_THEMES[key];
        expect(theme.id).toBe(key);
        expect(theme.color).toBeDefined();
        expect(theme.bg).toBeDefined();
        expect(theme.headerBg).toBeDefined();
        expect(theme.userBubble).toBeDefined();
        expect(theme.aiBubble).toBeDefined();
      });
    });

    test('BotProfileDashboard includes sakura theme in selectable options', () => {
      const sampleBot = AI_BOTS.find((b) => b.id === 'sakura');
      const html = ReactDOMServer.renderToStaticMarkup(
        <BotProfileDashboard
          bot={sampleBot}
          onBack={() => {}}
          onClearChat={() => {}}
          onOpenSearch={() => {}}
          customNickname=""
          onUpdateNickname={() => {}}
          activeTheme="sakura"
          onSelectTheme={() => {}}
          streamingEnabled={true}
          onToggleStreaming={() => {}}
        />
      );
      expect(html).toContain('Sakura');
    });
  });

  describe('4. Chat Component Markup Rendering & UX Controls', () => {
    test('renders chat header with options button and initial personalized message for default bot', () => {
      const store = createMockStore();
      const html = ReactDOMServer.renderToStaticMarkup(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/chat']}>
            <Chat />
          </MemoryRouter>
        </Provider>
      );

      // Default active bot is ByteBot AI
      expect(html).toContain('ByteBot AI');
      // Options button exists with aria-label
      expect(html).toContain('aria-label="Chat options"');
      // Contains the personalized intro text
      expect(html).toContain("Hello! I&#x27;m ByteBot AI, your Programming &amp; Software Engineering assistant. What would you like me to help you with today?");
      // Timestamp styling has smaller font size 0.62rem inside message bubble
      expect(html).toContain('font-size:0.62rem');
      expect(html).toContain('opacity:0.65');
      // Left-side bot list has subtle small timestamp with bot-meta-right class and 0.64rem
      expect(html).toContain('bot-meta-right');
      expect(html).toContain('font-size:0.64rem');
    });

    test('AI bots registry contains ZERO hardcoded static lastTime timestamps', () => {
      AI_BOTS.forEach((bot) => {
        expect(bot.lastTime).toBeUndefined();
      });
    });
  });

  describe('5. 1-Hour Inactivity Timeout & Session Reset Architecture', () => {
    test('INACTIVITY_TIMEOUT_MS is 3,600,000 ms (exactly 1 hour)', () => {
      const { INACTIVITY_TIMEOUT_MS } = require('../../pages/Chat');
      expect(INACTIVITY_TIMEOUT_MS).toBe(3600000);
      expect(INACTIVITY_TIMEOUT_MS).toBe(60 * 60 * 1000);
    });

    test('when user returns after > 1 hour of inactivity, previous messages remain intact and fresh intro is appended', () => {
      const store = createMockStore();
      const oneHourAgo = Date.now() - (3600 * 1000 + 10000); // 1 hr + 10s

      // Simulate prior conversation with Spark_X stored in localStorage
      const priorHistory = {
        spark_x: [
          { id: '1', sender: 'Spark_X', isUser: false, text: 'Hello! I am Spark_X...', time: '10:00 AM' },
          { id: '2', sender: 'Learner', isUser: true, text: "What is Ohm's Law?", time: '10:01 AM' },
          { id: '3', sender: 'Spark_X', isUser: false, text: 'Ohm\'s law states V = I * R.', time: '10:01 AM' }
        ]
      };
      localStorage.setItem('nipix_chat_messages_v6', JSON.stringify(priorHistory));
      localStorage.setItem('nipix_bot_last_interaction', JSON.stringify({ spark_x: oneHourAgo }));

      const html = ReactDOMServer.renderToStaticMarkup(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/chat/spark_x']}>
            <Routes>
              <Route path="/chat/:botId" element={<Chat />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      // Verify old conversation is 100% preserved
      expect(html).toContain("What is Ohm&#x27;s Law?");
      expect(html).toContain("Ohm&#x27;s law states V = I * R.");
      // Verify fresh session intro for Spark_X is displayed
      expect(html).toContain("What would you like me to help you with today?");
    });
  });

  describe('6. Navbar Theme Controls Hiding on Chat', () => {
    test('Navbar does NOT render Light/Dark/Device theme controls when on /chat', () => {
      const Navbar = require('../Navbar/Navbar').default;
      const { ThemeProvider } = require('../../context/ThemeContext');
      const html = ReactDOMServer.renderToStaticMarkup(
        <ThemeProvider>
          <MemoryRouter initialEntries={['/chat']}>
            <Navbar />
          </MemoryRouter>
        </ThemeProvider>
      );
      expect(html).not.toContain('theme-segmented-control');
      expect(html).not.toContain('aria-label="Light Mode"');
      expect(html).not.toContain('aria-label="Device Theme"');
    });

    test('Navbar DOES render Light/Dark/Device theme controls on non-chat pages', () => {
      const Navbar = require('../Navbar/Navbar').default;
      const { ThemeProvider } = require('../../context/ThemeContext');
      const html = ReactDOMServer.renderToStaticMarkup(
        <ThemeProvider>
          <MemoryRouter initialEntries={['/home']}>
            <Navbar />
          </MemoryRouter>
        </ThemeProvider>
      );
      expect(html).toContain('theme-segmented-control');
      expect(html).toContain('Light');
      expect(html).toContain('Dark');
      expect(html).toContain('Device');
    });
  });
});
