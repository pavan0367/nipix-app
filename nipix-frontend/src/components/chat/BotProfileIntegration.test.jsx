import React from 'react';
import ReactDOMServer from 'react-dom/server';
import BotProfileDashboard from './BotProfileDashboard';

describe('Bot Profile Navigation State Tests', () => {
  const sampleBot = {
    id: 'aether',
    name: 'Aether',
    role: 'Science / Innovation / Technology',
    avatar: '🌌',
    badgeClass: 'badge-spark',
    accentColor: '#06b6d4',
    specialty: 'Science, Innovation, Emerging Tech & Future Engineering'
  };

  test('generates complete dashboard markup for Aether including username, subject, 4 circular buttons and 5 options', () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      <BotProfileDashboard
        bot={sampleBot}
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
    expect(html).toContain('Aether');
    expect(html).toContain('@aether');
    expect(html).toContain('Science / Innovation / Technology');

    // 4 Action Buttons
    expect(html).toContain('Profile');
    expect(html).toContain('Search');
    expect(html).toContain('Mute');
    expect(html).toContain('Options');

    // Options rows
    expect(html).toContain('Theme');
    expect(html).toContain('AI theme');
    expect(html).toContain('Chat controls');
    expect(html).toContain('Privacy &amp; safety');
    expect(html).toContain('Nicknames');
    expect(html).toContain('Create a group chat');
  });
});
