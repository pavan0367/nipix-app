import React from 'react';
import ReactDOMServer from 'react-dom/server';
import BotProfileDashboard from './BotProfileDashboard';

describe('BotProfileDashboard Component HTML Rendering', () => {
  const bots = [
    {
      id: 'bytebot_ai',
      name: 'ByteBot AI',
      role: 'Programming & Software Engineering',
      avatar: '🤖',
      badgeClass: 'badge-bytebot',
      accentColor: '#3b82f6',
      specialty: 'Programming, Software Engineering & Code Intelligence'
    },
    {
      id: 'cipher_09',
      name: 'Cipher_09',
      role: 'Research, Cryptography & Cybersecurity',
      avatar: '🔮',
      badgeClass: 'badge-cipher',
      accentColor: '#8b5cf6',
      specialty: 'Research, Cryptography, Security & Logic'
    },
    {
      id: 'spark_x',
      name: 'Spark_X',
      role: 'Electrical Engineering, Physics & Circuit Theory',
      avatar: '⚡',
      badgeClass: 'badge-spark',
      accentColor: '#f59e0b',
      specialty: 'Electrical Engineering, Electronics, Circuits & Physics'
    },
    {
      id: 'archivist',
      name: 'Archivist',
      role: 'Study, Knowledge & Research',
      avatar: '📚',
      badgeClass: 'badge-mentor',
      accentColor: '#10b981',
      specialty: 'Study Materials, History, Literature & General Knowledge'
    },
    {
      id: 'novamind',
      name: 'NovaMind',
      role: 'General AI / Learning Assistant',
      avatar: '🧠',
      badgeClass: 'badge-cipher',
      accentColor: '#ec4899',
      specialty: 'General Learning, Educational Guidance & Logical Reasoning'
    },
    {
      id: 'aether',
      name: 'Aether',
      role: 'Science / Innovation / Technology',
      avatar: '🌌',
      badgeClass: 'badge-spark',
      accentColor: '#06b6d4',
      specialty: 'Science, Innovation, Emerging Tech & Future Engineering'
    }
  ];

  test.each(bots)('renders valid profile dashboard for %s', (bot) => {
    const html = ReactDOMServer.renderToStaticMarkup(
      <BotProfileDashboard
        bot={bot}
        onBack={() => {}}
        onClearChat={() => {}}
        onOpenSearch={() => {}}
        customNickname=""
        onUpdateNickname={() => {}}
        activeTheme="cyber"
        onSelectTheme={() => {}}
        streamingEnabled={true}
        onToggleStreaming={() => {}}
      />
    );

    // Profile header
    expect(html).toContain(bot.name);
    expect(html).toContain(`@${bot.id}`);
    expect(html).toContain(bot.role.replace(/&/g, '&amp;'));
    expect(html).toContain(bot.avatar);
    expect(html).toContain('Active now');

    // 4 circular buttons
    expect(html).toContain('Profile');
    expect(html).toContain('Search');
    expect(html).toContain('Mute');
    expect(html).toContain('Options');

    // Options list
    expect(html).toContain('Theme');
    expect(html).toContain('AI theme');
    expect(html).toContain('Chat controls');
    expect(html).toContain('Privacy &amp; safety');
    expect(html).toContain('Nicknames');
    expect(html).toContain('Create a group chat');
  });

  test('renders custom nickname when provided', () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      <BotProfileDashboard
        bot={bots[0]}
        customNickname="Super Coder"
        onBack={() => {}}
      />
    );

    expect(html).toContain('Super Coder');
    expect(html).toContain('Active: Super Coder');
  });
});
