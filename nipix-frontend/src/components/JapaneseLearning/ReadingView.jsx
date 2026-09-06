import React, { useState } from 'react';
import { READING_PASSAGES } from '../../data/japanese/readingData';
import { BookOpen, Eye, EyeOff, Sparkles, BookMarked } from 'lucide-react';

const ReadingView = () => {
  const [activePassageId, setActivePassageId] = useState(READING_PASSAGES[0].id);
  const [showRomaji, setShowRomaji] = useState(true);
  const [showTranslation, setShowTranslation] = useState(false);

  const activePassage = READING_PASSAGES.find((p) => p.id === activePassageId) || READING_PASSAGES[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Passage Selector Bar */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookMarked size={20} color="#ec4899" /> Japanese Reading Practice & Comprehension
        </h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '0 0 16px 0' }}>
          Graded reading passages from pure beginner kana routines to cultural essays and technological journalism.
        </p>

        {/* Passage Selection Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {READING_PASSAGES.map((p) => {
            const isSelected = p.id === activePassageId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePassageId(p.id)}
                className={`category-pill ${isSelected ? 'active' : ''}`}
                style={{ fontSize: '0.8rem', padding: '6px 14px' }}
              >
                {p.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Reading Workspace */}
      <div className="glass-card" style={{ padding: '26px', borderLeft: '4px solid #ec4899' }}>
        {/* Workspace Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.74rem', background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                {activePassage.level}
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                Genre: {activePassage.genre}
              </span>
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
              {activePassage.title}
            </h3>
          </div>

          {/* Reading Toggles */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setShowRomaji(!showRomaji)}
              className="btn-secondary"
              style={{ fontSize: '0.78rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {showRomaji ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>{showRomaji ? 'Hide Romaji' : 'Show Romaji'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowTranslation(!showTranslation)}
              className="btn-secondary"
              style={{ fontSize: '0.78rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {showTranslation ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>{showTranslation ? 'Hide English' : 'Reveal English'}</span>
            </button>
          </div>
        </div>

        {/* 1. Japanese Original Text Box */}
        <div
          style={{
            background: 'var(--code-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            padding: '20px',
            marginBottom: '18px'
          }}
        >
          <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginBottom: '8px', fontWeight: '700', textTransform: 'uppercase' }}>
            日本語本文 (Japanese Text):
          </div>
          <p
            style={{
              fontSize: '1.12rem',
              color: '#f8fafc',
              lineHeight: '1.9',
              margin: 0,
              fontFamily: '"Noto Sans JP", sans-serif',
              whiteSpace: 'pre-line'
            }}
          >
            {activePassage.japanese}
          </p>
        </div>

        {/* 2. Romaji Reading Box */}
        {showRomaji && (
          <div
            style={{
              background: 'rgba(56, 189, 248, 0.04)',
              border: '1px solid rgba(56, 189, 248, 0.15)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px 20px',
              marginBottom: '18px'
            }}
          >
            <div style={{ fontSize: '0.74rem', color: 'var(--accent-cyan)', marginBottom: '6px', fontWeight: '700', textTransform: 'uppercase' }}>
              Romaji Transliteration:
            </div>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.7', margin: 0, whiteSpace: 'pre-line' }}>
              {activePassage.romaji}
            </p>
          </div>
        )}

        {/* 3. English Translation Box */}
        {showTranslation && (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.04)',
              border: '1px solid rgba(16, 185, 129, 0.15)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px 20px',
              marginBottom: '22px'
            }}
          >
            <div style={{ fontSize: '0.74rem', color: 'var(--accent-emerald)', marginBottom: '6px', fontWeight: '700', textTransform: 'uppercase' }}>
              English Translation:
            </div>
            <p style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: '1.7', margin: 0, whiteSpace: 'pre-line' }}>
              {activePassage.english}
            </p>
          </div>
        )}

        {/* 4. Vocabulary Breakdown Table */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '10px' }}>
            Key Vocabulary in this Passage:
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
            {activePassage.vocabulary.map((vocab, vIdx) => (
              <div
                key={vIdx}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span style={{ fontSize: '0.86rem', fontWeight: '700', color: '#ffffff' }}>{vocab.word}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{vocab.meaning}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Grammar Points in this Passage */}
        <div>
          <h4 style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
            Grammar Points Explained:
          </h4>
          <ul style={{ margin: 0, paddingLeft: '18px' }}>
            {activePassage.grammarNotes.map((note, nIdx) => (
              <li key={nIdx} style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '4px', lineHeight: '1.5' }}>
                {note}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReadingView;
