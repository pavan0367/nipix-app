import React, { useState, useRef, useEffect } from 'react';
import { WRITING_EXERCISES } from '../../data/japanese/writingData';
import { Edit3, CheckCircle2, RotateCcw, Sparkles, BookOpen, Layers } from 'lucide-react';
import useLearningProgress from '../../hooks/useLearningProgress';

const WritingView = () => {
  const { isActivityCompleted, recordActivityCompletion } = useLearningProgress();
  const [activeExIdx, setActiveExIdx] = useState(0);
  const [selectedCharIdx, setSelectedCharIdx] = useState(0);
  const [userTranslations, setUserTranslations] = useState({});
  const [translationChecked, setTranslationChecked] = useState(false);

  const canvasRef = useRef(null);
  const isDrawing = useRef(false);

  const exercise = WRITING_EXERCISES[activeExIdx] || WRITING_EXERCISES[0];
  const isCompleted = isActivityCompleted(exercise.id);

  // Setup simple interactive HTML5 drawing canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#ec4899';
  }, [activeExIdx, selectedCharIdx]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const getEventPos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const touch = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]);
    const clientX = touch ? touch.clientX : e.clientX;
    const clientY = touch ? touch.clientY : e.clientY;
    const scaleX = canvas.width / (rect.width || 1);
    const scaleY = canvas.height / (rect.height || 1);
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    if (e.touches && e.cancelable) {
      e.preventDefault();
    }
    isDrawing.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pos = getEventPos(e);
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    if (e.touches && e.cancelable) {
      e.preventDefault();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pos = getEventPos(e);
    const ctx = canvas.getContext('2d');
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const handleCompleteWritingExercise = () => {
    recordActivityCompletion(exercise.id, 'japanese', 'languages', 'writing', exercise.points);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header */}
      <div className="glass-card" style={{ padding: '22px', borderLeft: '4px solid #ec4899' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Edit3 size={22} color="#ec4899" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Japanese Character & Sentence Writing Studio
              </h2>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
              Practice stroke balance, stroke orders, Kana tracing, and practical sentence translation writing.
            </p>
          </div>

          {isCompleted && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: '700' }}>
              <CheckCircle2 size={16} /> Completed (+{exercise.points} pts)
            </div>
          )}
        </div>

        {/* Exercise Switcher */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
          {WRITING_EXERCISES.map((ex, idx) => (
            <button
              key={ex.id}
              type="button"
              onClick={() => {
                setActiveExIdx(idx);
                setSelectedCharIdx(0);
                clearCanvas();
                setTranslationChecked(false);
              }}
              className={`category-pill ${activeExIdx === idx ? 'active' : ''}`}
              style={{ fontSize: '0.8rem' }}
            >
              {ex.title}
            </button>
          ))}
        </div>
      </div>

      {/* Character Stroke Tracing Board (If characters exist) */}
      {exercise.characters && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center' }}>
            {/* Left: Stroke Guidelines */}
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                {exercise.characters.map((ch, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedCharIdx(idx);
                      clearCanvas();
                    }}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      background: selectedCharIdx === idx ? 'linear-gradient(135deg, #ec4899, #be185d)' : 'rgba(255, 255, 255, 0.05)',
                      color: '#ffffff',
                      border: '1px solid var(--border-color)',
                      fontSize: '1.4rem',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    {ch.char}
                  </button>
                ))}
              </div>

              {exercise.characters[selectedCharIdx] && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: '800', color: '#ffffff', fontFamily: '"Noto Sans JP", sans-serif' }}>
                      {exercise.characters[selectedCharIdx].char}
                    </span>
                    <div>
                      <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                        /{exercise.characters[selectedCharIdx].romaji}/
                      </span>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', margin: 0 }}>
                        {exercise.characters[selectedCharIdx].strokes} Strokes
                      </p>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: '700', color: '#f472b6', textTransform: 'uppercase' }}>
                      Stroke Order Guide:
                    </span>
                    <p style={{ fontSize: '0.84rem', color: '#e2e8f0', margin: '4px 0 0 0', lineHeight: 1.5 }}>
                      {exercise.characters[selectedCharIdx].guide}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Digital Handwriting Pad */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{
                position: 'relative',
                width: '260px',
                height: '260px',
                background: '#0d1117',
                border: '2px dashed rgba(236, 72, 153, 0.4)',
                borderRadius: '16px',
                overflow: 'hidden'
              }}>
                {/* Background Tracing Ghost Character */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '9rem',
                  fontWeight: '800',
                  color: 'rgba(255, 255, 255, 0.06)',
                  fontFamily: '"Noto Sans JP", sans-serif',
                  userSelect: 'none',
                  pointerEvents: 'none'
                }}>
                  {exercise.characters[selectedCharIdx]?.char}
                </div>

                <canvas
                  ref={canvasRef}
                  width={260}
                  height={260}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  onTouchCancel={stopDrawing}
                  style={{ width: '100%', height: '100%', cursor: 'crosshair', position: 'relative', zIndex: 2, touchAction: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="btn-secondary"
                  style={{ padding: '6px 14px', fontSize: '0.8rem', gap: '6px' }}
                >
                  <RotateCcw size={13} /> Clear Canvas
                </button>

                <button
                  type="button"
                  onClick={handleCompleteWritingExercise}
                  className="btn-primary"
                  style={{ padding: '6px 18px', fontSize: '0.8rem', background: 'linear-gradient(135deg, #10b981, #059669)' }}
                >
                  <CheckCircle2 size={13} /> Mark Character Practiced (+{exercise.points} pts)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sentence Translation & Practical Writing (If prompts exist) */}
      {exercise.prompts && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '16px' }}>
            Practical Translation Drills
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {exercise.prompts.map((p, pIdx) => (
              <div key={pIdx} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <p style={{ fontSize: '0.92rem', fontWeight: '700', color: '#ffffff', margin: '0 0 10px 0' }}>
                  {pIdx + 1}. {p.prompt}
                </p>

                <input
                  type="text"
                  placeholder="Type Japanese translation here (e.g. はじめまして...)"
                  value={userTranslations[pIdx] || ''}
                  onChange={(e) => setUserTranslations(prev => ({ ...prev, [pIdx]: e.target.value }))}
                  className="input-field"
                  style={{ marginBottom: '10px' }}
                />

                {translationChecked && (
                  <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '10px 14px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#34d399', marginBottom: '2px' }}>
                      Model Answer:
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff', fontFamily: '"Noto Sans JP", sans-serif' }}>
                      {p.target}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                      {p.romaji}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setTranslationChecked(true)}
              className="btn-secondary"
              style={{ padding: '9px 18px', fontSize: '0.84rem' }}
            >
              Verify Answers
            </button>

            <button
              type="button"
              onClick={handleCompleteWritingExercise}
              className="btn-primary"
              style={{ padding: '9px 22px', fontSize: '0.84rem', background: 'linear-gradient(135deg, #10b981, #059669)' }}
            >
              Submit & Complete (+{exercise.points} pts)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WritingView;
