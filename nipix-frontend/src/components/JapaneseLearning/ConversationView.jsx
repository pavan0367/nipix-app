import React, { useState } from 'react';
import { CONVERSATION_SCENARIOS } from '../../data/japanese/conversationData';
import { MessageSquare, Volume2, Sparkles, User, Info, Check, Copy } from 'lucide-react';

const ConversationView = () => {
  const [activeScenarioId, setActiveScenarioId] = useState(CONVERSATION_SCENARIOS[0].id);
  const [copiedLine, setCopiedLine] = useState(null);

  const activeScenario = CONVERSATION_SCENARIOS.find((c) => c.id === activeScenarioId) || CONVERSATION_SCENARIOS[0];

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedLine(id);
    setTimeout(() => setCopiedLine(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header & Scenario Selection */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={20} color="var(--accent-emerald)" /> Practical Japanese Conversation Situations
        </h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '0 0 16px 0' }}>
          Master authentic, real-world spoken Japanese with native phraseology, polite conventions, and natural turn-taking.
        </p>

        {/* Scenario Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {CONVERSATION_SCENARIOS.map((scenario) => {
            const isSelected = scenario.id === activeScenarioId;
            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => setActiveScenarioId(scenario.id)}
                className={`category-pill ${isSelected ? 'active' : ''}`}
                style={{ fontSize: '0.8rem', padding: '6px 14px' }}
              >
                {scenario.title.split(' (')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Conversation Dialogue Box */}
      <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid var(--accent-emerald)' }}>
        {/* Scenario Banner */}
        <div style={{ marginBottom: '18px' }}>
          <span style={{ fontSize: '0.74rem', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--accent-emerald)', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
            {activeScenario.category}
          </span>
          <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#f8fafc', margin: '6px 0 4px 0' }}>
            {activeScenario.title}
          </h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: 0 }}>
            Situation: {activeScenario.situation}
          </p>
        </div>

        {/* Cultural Etiquette Tip */}
        <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '10px', padding: '12px 16px', marginBottom: '22px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <Info size={18} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.84rem', color: '#fde68a', lineHeight: '1.5' }}>
            <strong>Cultural & Conversational Tip:</strong> {activeScenario.culturalTip}
          </div>
        </div>

        {/* Dialogue Stream */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {activeScenario.dialogue.map((turn, tIdx) => {
            const isServerOrStaff = turn.role === 'Server' || turn.role === 'Staff' || turn.role === 'Professor';
            return (
              <div
                key={tIdx}
                style={{
                  display: 'flex',
                  gap: '14px',
                  padding: '16px',
                  borderRadius: '12px',
                  background: isServerOrStaff ? 'rgba(255, 255, 255, 0.02)' : 'rgba(56, 189, 248, 0.04)',
                  border: isServerOrStaff ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(56, 189, 248, 0.15)'
                }}
              >
                {/* Speaker Avatar Icon */}
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: isServerOrStaff ? 'rgba(255,255,255,0.08)' : 'rgba(56, 189, 248, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '0.9rem',
                    fontWeight: '800',
                    color: isServerOrStaff ? '#cbd5e1' : 'var(--accent-cyan)'
                  }}
                >
                  <User size={18} />
                </div>

                {/* Speaker Speech Bubble */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: '800', color: isServerOrStaff ? 'var(--text-dim)' : 'var(--accent-cyan)' }}>
                      {turn.speaker}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(turn.jp, `line-${tIdx}`)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '2px' }}
                      title="Copy line"
                    >
                      {copiedLine === `line-${tIdx}` ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                    </button>
                  </div>

                  {/* Japanese Line */}
                  <div style={{ fontSize: '1.02rem', fontWeight: '700', color: '#ffffff', marginBottom: '4px', lineHeight: '1.5', fontFamily: '"Noto Sans JP", sans-serif' }}>
                    {turn.jp}
                  </div>

                  {/* Romaji */}
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', marginBottom: '4px' }}>
                    {turn.romaji}
                  </div>

                  {/* English */}
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                    {turn.en}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ConversationView;
