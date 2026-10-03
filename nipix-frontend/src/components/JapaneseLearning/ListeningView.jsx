import React, { useState } from 'react';
import { LISTENING_LESSONS } from '../../data/japanese/listeningData';
import { Headphones, Volume2, CheckCircle2, Sparkles, HelpCircle, Award, RotateCcw } from 'lucide-react';
import useLearningProgress from '../../hooks/useLearningProgress';

const ListeningView = () => {
  const { isActivityCompleted, recordActivityCompletion } = useLearningProgress();
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  const lesson = LISTENING_LESSONS[activeLessonIdx] || LISTENING_LESSONS[0];
  const isCompleted = isActivityCompleted(lesson.id);

  // Native speech synthesis for authentic Japanese pronunciation
  const speakJapanese = (text) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis not supported in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.9; // natural cadence for learners
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleSelectAnswer = (qIdx, optIdx) => {
    if (submittedQuiz) return;
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitComprehension = () => {
    let score = 0;
    lesson.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) {
        score += 1;
      }
    });

    const passed = score >= Math.ceil(lesson.questions.length * 0.7);
    setSubmittedQuiz(true);

    if (passed) {
      recordActivityCompletion(lesson.id, 'japanese', 'languages', 'listening', lesson.points, {
        score,
        totalQuestions: lesson.questions.length
      });
    }
  };

  const handleReset = () => {
    setAnswers({});
    setSubmittedQuiz(false);
    window.speechSynthesis?.cancel();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Listening Header */}
      <div className="glass-card" style={{ padding: '22px', borderLeft: '4px solid #ec4899' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Headphones size={22} color="#ec4899" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Japanese Listening Comprehension & Native Speech
              </h2>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
              Listen to realistic situational Japanese dialogues, follow along with furigana transcripts, and solve comprehension drills.
            </p>
          </div>

          {isCompleted && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: '700' }}>
              <CheckCircle2 size={16} /> Completed (+{lesson.points} pts)
            </div>
          )}
        </div>

        {/* Lesson Selector Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
          {LISTENING_LESSONS.map((item, idx) => {
            const completed = isActivityCompleted(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveLessonIdx(idx);
                  handleReset();
                }}
                className={`category-pill ${activeLessonIdx === idx ? 'active' : ''}`}
                style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {completed ? <CheckCircle2 size={13} color="#10b981" /> : <Headphones size={13} />}
                <span>Track {idx + 1}: {item.title.split('&')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dialogue Player */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
          <div>
            <span style={{ fontSize: '0.72rem', background: 'rgba(236, 72, 153, 0.12)', color: '#f472b6', padding: '3px 10px', borderRadius: '4px', fontWeight: '700' }}>
              {lesson.level}
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', margin: '6px 0 2px 0' }}>
              {lesson.title}
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-dim)', margin: 0 }}>
              Scenario: {lesson.scenario}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              const fullText = lesson.transcript.map(t => `${t.speaker}。${t.japanese}`).join(' ');
              speakJapanese(fullText);
            }}
            className="btn-primary"
            style={{
              padding: '10px 20px',
              fontSize: '0.84rem',
              gap: '8px',
              background: 'linear-gradient(135deg, #ec4899, #be185d)'
            }}
          >
            <Volume2 size={16} />
            <span>{isPlaying ? 'Playing Audio...' : 'Play Entire Dialogue'}</span>
          </button>
        </div>

        {/* Transcript Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {lesson.transcript.map((line, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '14px'
              }}
            >
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                  {line.speaker}
                </span>
                <p style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff', margin: '4px 0', fontFamily: '"Noto Sans JP", sans-serif' }}>
                  {line.japanese}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: '0 0 2px 0' }}>
                  {line.romaji}
                </p>
                <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: 0 }}>
                  {line.english}
                </p>
              </div>

              <button
                type="button"
                onClick={() => speakJapanese(line.japanese)}
                className="btn-secondary"
                style={{ padding: '8px', borderRadius: '50%', flexShrink: 0 }}
                title="Listen to this line"
              >
                <Volume2 size={15} color="var(--accent-cyan)" />
              </button>
            </div>
          ))}
        </div>

        {/* Key Vocabulary in this Dialogue */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: 'var(--radius-sm)', marginBottom: '24px' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-emerald)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 10px 0' }}>
            Featured Dialogue Vocabulary:
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
            {lesson.vocabulary.map((v, vIdx) => (
              <div key={vIdx} style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <strong style={{ color: '#ffffff' }}>{v.word}</strong> ({v.reading}) — {v.meaning}
              </div>
            ))}
          </div>
        </div>

        {/* Comprehension Check Questions */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HelpCircle size={18} color="var(--accent-amber)" /> Listening Comprehension Questions
            </h4>
            <button
              type="button"
              onClick={handleReset}
              className="btn-secondary"
              style={{ fontSize: '0.76rem', padding: '4px 10px', gap: '4px' }}
            >
              <RotateCcw size={12} /> Reset
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {lesson.questions.map((q, qIdx) => {
              const selected = answers[qIdx];
              const isCorrect = selected === q.correctIndex;

              return (
                <div key={qIdx} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <p style={{ fontSize: '0.92rem', fontWeight: '700', color: '#ffffff', margin: '0 0 12px 0' }}>
                    {qIdx + 1}. {q.question}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
                    {q.options.map((opt, oIdx) => {
                      let bg = 'rgba(255, 255, 255, 0.04)';
                      let border = 'rgba(255, 255, 255, 0.08)';

                      if (submittedQuiz) {
                        if (oIdx === q.correctIndex) {
                          bg = 'rgba(16, 185, 129, 0.2)';
                          border = '#10b981';
                        } else if (selected === oIdx) {
                          bg = 'rgba(239, 68, 68, 0.2)';
                          border = '#ef4444';
                        }
                      } else if (selected === oIdx) {
                        bg = 'rgba(236, 72, 153, 0.2)';
                        border = '#ec4899';
                      }

                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => handleSelectAnswer(qIdx, oIdx)}
                          style={{
                            padding: '10px 14px',
                            borderRadius: '8px',
                            background: bg,
                            border: `1px solid ${border}`,
                            color: 'var(--text-main)',
                            fontSize: '0.84rem',
                            fontWeight: '600',
                            textAlign: 'left',
                            cursor: submittedQuiz ? 'default' : 'pointer'
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {submittedQuiz && (
                    <div style={{ marginTop: '10px', fontSize: '0.8rem', color: isCorrect ? '#34d399' : '#f87171' }}>
                      {isCorrect ? '✓ Correct!' : '✗ Incorrect:'} {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={handleSubmitComprehension}
              disabled={Object.keys(answers).length < lesson.questions.length}
              className="btn-primary"
              style={{
                padding: '10px 24px',
                fontSize: '0.86rem',
                opacity: Object.keys(answers).length < lesson.questions.length ? 0.5 : 1,
                background: 'linear-gradient(135deg, #10b981, #059669)'
              }}
            >
              Submit Listening Answers & Complete (+{lesson.points} pts)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListeningView;
