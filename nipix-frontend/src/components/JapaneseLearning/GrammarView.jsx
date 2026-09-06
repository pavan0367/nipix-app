import React, { useState } from 'react';
import { GRAMMAR_LEVELS, GRAMMAR_DATA } from '../../data/japanese/grammarData';
import { BookOpen, Check, X, AlertCircle, ChevronDown, ChevronUp, Sparkles, HelpCircle } from 'lucide-react';

const GrammarView = () => {
  const [selectedLevel, setSelectedLevel] = useState('Beginner (N5)');
  const [expandedId, setExpandedId] = useState('g-1');
  const [quizAnswers, setQuizAnswers] = useState({});

  const filteredGrammar = GRAMMAR_DATA.filter((g) => g.level === selectedLevel);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleSelectAnswer = (lessonId, qIdx, optIdx) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [`${lessonId}_${qIdx}`]: optIdx
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header & Level Tabs */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} color="var(--accent-cyan)" /> Japanese Grammar Mastery
        </h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '0 0 16px 0' }}>
          From essential sentence particles and verb conjugations to intermediate conditionals and advanced Keigo honorifics.
        </p>

        {/* Level Switcher */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {GRAMMAR_LEVELS.map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => {
                setSelectedLevel(lvl);
                const firstMatch = GRAMMAR_DATA.find((g) => g.level === lvl);
                if (firstMatch) setExpandedId(firstMatch.id);
              }}
              className={`category-pill ${selectedLevel === lvl ? 'active' : ''}`}
              style={{ fontSize: '0.82rem', padding: '6px 16px' }}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Grammar Lessons List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredGrammar.map((lesson) => {
          const isExpanded = expandedId === lesson.id;
          return (
            <div
              key={lesson.id}
              className="glass-card"
              style={{
                padding: '20px',
                borderLeft: isExpanded ? '4px solid var(--accent-cyan)' : '4px solid transparent',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Card Header Accordion */}
              <div
                onClick={() => toggleExpand(lesson.id)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.74rem', background: 'rgba(56, 189, 248, 0.12)', color: 'var(--accent-cyan)', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                      {lesson.category}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                      {lesson.level}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                    {lesson.title}
                  </h3>
                </div>

                <button
                  type="button"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: isExpanded ? 'var(--accent-cyan)' : 'var(--text-dim)',
                    cursor: 'pointer',
                    padding: '6px'
                  }}
                >
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>

              {/* Collapsible Lesson Content */}
              {isExpanded && (
                <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* 1. Explanation */}
                  <div style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                    {lesson.explanation}
                  </div>

                  {/* 2. Usage Rules */}
                  <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '14px 16px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--accent-emerald)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
                      Usage Rules & Construction:
                    </span>
                    <ul style={{ margin: 0, paddingLeft: '18px' }}>
                      {lesson.usageRules.map((rule, rIdx) => (
                        <li key={rIdx} style={{ fontSize: '0.84rem', color: '#cbd5e1', marginBottom: '4px' }}>
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 3. Japanese Examples */}
                  <div>
                    <span style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
                      Japanese Examples & Romaji:
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {lesson.examples.map((ex, exIdx) => (
                        <div
                          key={exIdx}
                          style={{
                            background: 'var(--code-bg)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '10px 14px'
                          }}
                        >
                          <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f8fafc', marginBottom: '2px' }}>
                            {ex.jp}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', marginBottom: '2px' }}>
                            {ex.romaji}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                            {ex.en}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4. Common Mistakes */}
                  {lesson.commonMistakes && lesson.commonMistakes.length > 0 && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '12px 14px', borderRadius: '8px' }}>
                      <span style={{ fontSize: '0.74rem', fontWeight: '700', color: '#f87171', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <AlertCircle size={14} /> Common Learner Pitfalls:
                      </span>
                      <ul style={{ margin: 0, paddingLeft: '18px' }}>
                        {lesson.commonMistakes.map((mis, mIdx) => (
                          <li key={mIdx} style={{ fontSize: '0.82rem', color: '#fca5a5', marginBottom: '2px' }}>
                            {mis}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 5. Practice Questions */}
                  {lesson.practiceQuestions && lesson.practiceQuestions.length > 0 && (
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <span style={{ fontSize: '0.76rem', fontWeight: '700', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                        <HelpCircle size={15} /> Quick Practice Question:
                      </span>

                      {lesson.practiceQuestions.map((pq, qIdx) => {
                        const answerKey = `${lesson.id}_${qIdx}`;
                        const selectedAnswer = quizAnswers[answerKey];
                        const isSubmitted = selectedAnswer !== undefined;

                        return (
                          <div key={qIdx}>
                            <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#f8fafc', marginBottom: '10px' }}>
                              {pq.question}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', marginBottom: '10px' }}>
                              {pq.options.map((opt, optIdx) => {
                                const isOptSelected = selectedAnswer === optIdx;
                                const isCorrect = optIdx === pq.answer;

                                let btnBg = 'rgba(255, 255, 255, 0.04)';
                                let btnBorder = 'rgba(255, 255, 255, 0.1)';
                                let btnColor = 'var(--text-main)';

                                if (isSubmitted) {
                                  if (isCorrect) {
                                    btnBg = 'rgba(16, 185, 129, 0.2)';
                                    btnBorder = '#10b981';
                                    btnColor = '#34d399';
                                  } else if (isOptSelected) {
                                    btnBg = 'rgba(239, 68, 68, 0.2)';
                                    btnBorder = '#ef4444';
                                    btnColor = '#f87171';
                                  }
                                } else if (isOptSelected) {
                                  btnBg = 'rgba(56, 189, 248, 0.15)';
                                  btnBorder = '#38bdf8';
                                }

                                return (
                                  <button
                                    key={optIdx}
                                    type="button"
                                    onClick={() => handleSelectAnswer(lesson.id, qIdx, optIdx)}
                                    style={{
                                      padding: '8px 12px',
                                      borderRadius: '8px',
                                      background: btnBg,
                                      border: `1px solid ${btnBorder}`,
                                      color: btnColor,
                                      fontSize: '0.82rem',
                                      fontWeight: '600',
                                      cursor: isSubmitted ? 'default' : 'pointer',
                                      textAlign: 'center',
                                      transition: 'all 0.15s ease'
                                    }}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>

                            {isSubmitted && (
                              <div style={{ fontSize: '0.8rem', color: selectedAnswer === pq.answer ? '#34d399' : '#f87171', padding: '6px 10px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                                {selectedAnswer === pq.answer ? '✓ Correct! ' : '✗ Not quite. '}
                                {pq.explanation}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GrammarView;
