import React, { useState } from 'react';
import { QUIZ_CATEGORIES, QUIZ_QUESTIONS } from '../../data/japanese/quizzesData';
import { Award, CheckCircle2, XCircle, RotateCcw, Sparkles, HelpCircle } from 'lucide-react';

const QuizzesView = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Quizzes');
  const [userAnswers, setUserAnswers] = useState({});
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

  const filteredQuestions = QUIZ_QUESTIONS.filter(
    (q) => selectedCategory === 'All Quizzes' || q.category === selectedCategory
  );

  const activeQuestion = filteredQuestions[currentQuestionIdx] || filteredQuestions[0];
  const questionKey = activeQuestion?.id;
  const selectedAnswer = userAnswers[questionKey];
  const isAnswered = selectedAnswer !== undefined;

  // Calculate score
  const answeredCount = Object.keys(userAnswers).length;
  let score = 0;
  filteredQuestions.forEach((q) => {
    if (userAnswers[q.id] === q.correctIndex) {
      score += 1;
    }
  });

  const handleSelectOption = (idx) => {
    if (isAnswered) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionKey]: idx
    }));
  };

  const handleReset = () => {
    setUserAnswers({});
    setCurrentQuestionIdx(0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header & Category Selection */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '14px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={22} color="var(--accent-amber)" /> Japanese Interactive Knowledge Quizzes
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
              Test your proficiency across Hiragana, Katakana, Kanji readings, vocabulary, grammar, and JLPT exams.
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RotateCcw size={14} />
            <span>Reset Quiz</span>
          </button>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
          {QUIZ_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentQuestionIdx(0);
              }}
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              style={{ fontSize: '0.78rem', padding: '5px 12px' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Progress Bar & Score Counter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '8px' }}>
          <span>
            Question {currentQuestionIdx + 1} of {filteredQuestions.length}
          </span>
          <span>
            Current Score: <strong style={{ color: 'var(--accent-emerald)' }}>{score}</strong> / {filteredQuestions.length}
          </span>
        </div>

        <div style={{ width: '100%', height: '6px', borderRadius: '9999px', background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${((currentQuestionIdx + 1) / filteredQuestions.length) * 100}%`,
              background: 'linear-gradient(90deg, #ec4899, var(--accent-cyan))',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>

      {/* Active Question Box */}
      {activeQuestion && (
        <div className="glass-card" style={{ padding: '26px', borderLeft: '4px solid #ec4899' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.74rem', background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
              {activeQuestion.category}
            </span>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
              {activeQuestion.type}
            </span>
          </div>

          <h3 style={{ fontSize: '1.28rem', fontWeight: '800', color: '#ffffff', marginBottom: '20px', lineHeight: '1.5' }}>
            {activeQuestion.question}
          </h3>

          {/* Options Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {activeQuestion.options.map((optionText, optIdx) => {
              const isSelected = selectedAnswer === optIdx;
              const isCorrect = optIdx === activeQuestion.correctIndex;

              let bg = 'rgba(255, 255, 255, 0.03)';
              let border = 'rgba(255, 255, 255, 0.08)';
              let color = 'var(--text-main)';

              if (isAnswered) {
                if (isCorrect) {
                  bg = 'rgba(16, 185, 129, 0.2)';
                  border = '#10b981';
                  color = '#34d399';
                } else if (isSelected) {
                  bg = 'rgba(239, 68, 68, 0.2)';
                  border = '#ef4444';
                  color = '#f87171';
                }
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(optIdx)}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '10px',
                    background: bg,
                    border: `1px solid ${border}`,
                    color: color,
                    fontSize: '0.94rem',
                    fontWeight: '600',
                    cursor: isAnswered ? 'default' : 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{optionText}</span>
                  {isAnswered && isCorrect && <CheckCircle2 size={18} color="#10b981" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle size={18} color="#ef4444" />}
                </button>
              );
            })}
          </div>

          {/* Immediate Feedback & Explanation Box */}
          {isAnswered && (
            <div
              style={{
                background: selectedAnswer === activeQuestion.correctIndex ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                border: `1px solid ${selectedAnswer === activeQuestion.correctIndex ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
                borderRadius: '10px',
                padding: '14px 18px',
                marginBottom: '20px'
              }}
            >
              <div style={{ fontSize: '0.92rem', fontWeight: '800', color: selectedAnswer === activeQuestion.correctIndex ? '#34d399' : '#f87171', marginBottom: '4px' }}>
                {selectedAnswer === activeQuestion.correctIndex ? '✓ Excellent! Correct Answer' : '✗ Incorrect'}
              </div>
              <div style={{ fontSize: '0.86rem', color: '#e2e8f0', lineHeight: '1.5' }}>
                {activeQuestion.explanation}
              </div>
            </div>
          )}

          {/* Next / Prev Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setCurrentQuestionIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIdx === 0}
              className="btn-secondary"
              style={{ padding: '8px 16px', opacity: currentQuestionIdx === 0 ? 0.5 : 1 }}
            >
              Previous
            </button>

            <button
              type="button"
              onClick={() => setCurrentQuestionIdx((prev) => Math.min(filteredQuestions.length - 1, prev + 1))}
              disabled={currentQuestionIdx === filteredQuestions.length - 1}
              className="btn-primary"
              style={{ padding: '8px 20px', background: 'linear-gradient(135deg, #ec4899, #be185d)' }}
            >
              {currentQuestionIdx === filteredQuestions.length - 1 ? 'Quiz Completed' : 'Next Question'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizzesView;
