import React, { useState } from 'react';
import { JLPT_LEVELS_DATA } from '../../data/japanese/jlptData';
import { Award, Target, BookOpen, Headphones, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';

const JlptView = () => {
  const [selectedLevelId, setSelectedLevelId] = useState('N5');
  const [testAnswers, setTestAnswers] = useState({});

  const currentLevel = JLPT_LEVELS_DATA.find((l) => l.level === selectedLevelId) || JLPT_LEVELS_DATA[0];

  const handleSelectAnswer = (qIdx, optIdx) => {
    setTestAnswers((prev) => ({
      ...prev,
      [`${selectedLevelId}_${qIdx}`]: optIdx
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Level Selection Bar */}
      <div className="glass-card" style={{ padding: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={22} color="var(--accent-amber)" /> JLPT Official Examination Preparation
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
              Tailored preparation tracks from N5 (Beginner) to N1 (Advanced Native Equivalence).
            </p>
          </div>

          <span style={{ fontSize: '0.78rem', background: 'rgba(245, 158, 11, 0.12)', color: 'var(--accent-amber)', padding: '4px 12px', borderRadius: '12px', fontWeight: '700' }}>
            Official Standard Syllabus
          </span>
        </div>

        {/* N5 to N1 Selector */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {JLPT_LEVELS_DATA.map((lvl) => {
            const isSelected = lvl.level === selectedLevelId;
            return (
              <button
                key={lvl.level}
                type="button"
                onClick={() => setSelectedLevelId(lvl.level)}
                style={{
                  flex: '1 1 120px',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(236, 72, 153, 0.15))'
                    : 'rgba(255, 255, 255, 0.03)',
                  border: isSelected ? '1px solid var(--accent-amber)' : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontSize: '1.3rem', fontWeight: '800', color: isSelected ? 'var(--accent-amber)' : '#f8fafc', marginBottom: '2px' }}>
                  JLPT {lvl.level}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                  {lvl.tagline}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Level Deep-Dive */}
      <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid var(--accent-amber)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--accent-amber)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
              Active Level Track:
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ffffff', margin: '0 0 6px 0' }}>
              JLPT {currentLevel.level} — {currentLevel.tagline}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, maxWidth: '700px', lineHeight: '1.5' }}>
              {currentLevel.summary}
            </p>
          </div>

          {/* Exam Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Kanji Target</div>
              <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#f8fafc' }}>{currentLevel.stats.kanjiCount}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Vocabulary Target</div>
              <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#f8fafc' }}>{currentLevel.stats.vocabCount}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Study Hours</div>
              <div style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>{currentLevel.stats.studyHours}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Passing Benchmark</div>
              <div style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--accent-emerald)' }}>{currentLevel.stats.passingScore}</div>
            </div>
          </div>
        </div>

        {/* Key Syllabus Topics */}
        <div style={{ marginBottom: '22px' }}>
          <h4 style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Target size={16} color="var(--accent-emerald)" /> Core Knowledge & Grammar Topics:
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px' }}>
            {currentLevel.keyTopics.map((topic, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  fontSize: '0.84rem',
                  color: '#cbd5e1'
                }}
              >
                <CheckCircle2 size={14} color="var(--accent-emerald)" style={{ flexShrink: 0 }} />
                <span>{topic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Kanji & Grammar Highlights */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '22px' }}>
          {/* Kanji Spotlight */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--accent-cyan)', marginBottom: '10px' }}>
              REPRESENTATIVE KANJI SAMPLES:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {currentLevel.sampleKanji.map((k, idx) => (
                <span
                  key={idx}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    color: '#ffffff'
                  }}
                >
                  {k}
                </span>
              ))}
            </div>
          </div>

          {/* Grammar Patterns Spotlight */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#f472b6', marginBottom: '10px' }}>
              FREQUENT GRAMMAR PATTERNS:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {currentLevel.sampleGrammar.map((sg, idx) => (
                <div key={idx} style={{ fontSize: '0.82rem', display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                  <strong style={{ color: '#f8fafc' }}>{sg.pattern}</strong>
                  <span style={{ color: 'var(--text-dim)' }}>{sg.meaning}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section Tips: Reading & Listening */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '22px' }}>
          <div style={{ background: 'var(--code-bg)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <BookOpen size={14} /> Reading Comprehension Strategy:
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px' }}>
              {currentLevel.readingStrategies.map((rs, idx) => (
                <li key={idx} style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  {rs}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ background: 'var(--code-bg)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Headphones size={14} /> Listening Section Strategy:
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px' }}>
              {currentLevel.listeningTips.map((lt, idx) => (
                <li key={idx} style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  {lt}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mini Practice Test */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '18px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#f8fafc', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <HelpCircle size={16} color="var(--accent-cyan)" /> JLPT {currentLevel.level} Simulated Mini-Exam
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {currentLevel.practiceTest.map((testItem, qIdx) => {
              const testKey = `${selectedLevelId}_${qIdx}`;
              const selectedOpt = testAnswers[testKey];
              const isAnswered = selectedOpt !== undefined;

              return (
                <div
                  key={qIdx}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                >
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#f8fafc', marginBottom: '10px' }}>
                    Q{qIdx + 1}. {testItem.question}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', marginBottom: '8px' }}>
                    {testItem.options.map((opt, optIdx) => {
                      const isCorrect = optIdx === testItem.answer;
                      const isChosen = selectedOpt === optIdx;

                      let bg = 'rgba(255,255,255,0.04)';
                      let border = 'rgba(255,255,255,0.08)';
                      let color = 'var(--text-main)';

                      if (isAnswered) {
                        if (isCorrect) {
                          bg = 'rgba(16, 185, 129, 0.2)';
                          border = '#10b981';
                          color = '#34d399';
                        } else if (isChosen) {
                          bg = 'rgba(239, 68, 68, 0.2)';
                          border = '#ef4444';
                          color = '#f87171';
                        }
                      } else if (isChosen) {
                        bg = 'rgba(56, 189, 248, 0.15)';
                        border = '#38bdf8';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectAnswer(qIdx, optIdx)}
                          style={{
                            padding: '8px',
                            borderRadius: '6px',
                            background: bg,
                            border: `1px solid ${border}`,
                            color: color,
                            fontSize: '0.84rem',
                            fontWeight: '600',
                            cursor: isAnswered ? 'default' : 'pointer'
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && (
                    <div style={{ fontSize: '0.78rem', color: selectedOpt === testItem.answer ? '#34d399' : '#f87171', marginTop: '6px' }}>
                      {selectedOpt === testItem.answer ? '✓ Correct! ' : '✗ Incorrect. '}
                      {testItem.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JlptView;
