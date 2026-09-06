import React, { useState } from 'react';
import { KANJI_DATA, KANJI_RADICALS_INTRO } from '../../data/japanese/kanjiData';
import { Search, Sparkles, Filter, Copy, Check, BookOpen } from 'lucide-react';

const KanjiView = () => {
  const [selectedJlpt, setSelectedJlpt] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [showRadicals, setShowRadicals] = useState(false);

  const filteredKanji = KANJI_DATA.filter((item) => {
    const matchesLevel = selectedJlpt === 'All' || item.jlpt === selectedJlpt;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.kanji.includes(q) ||
      item.meaning.toLowerCase().includes(q) ||
      item.onyomi.toLowerCase().includes(q) ||
      item.kunyomi.toLowerCase().includes(q) ||
      item.exampleWords.some((w) => w.word.includes(q) || w.meaning.toLowerCase().includes(q));
    return matchesLevel && matchesSearch;
  });

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Search & Filter Header */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.4rem' }}>漢</span> Kanji Exploration Library
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
              Discover characters, stroke orders, On'yomi & Kun'yomi readings, and contextual vocabulary.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowRadicals(!showRadicals)}
            className="btn-secondary"
            style={{ fontSize: '0.82rem', padding: '6px 14px' }}
          >
            <BookOpen size={15} />
            <span>{showRadicals ? 'Hide Radicals Guide' : 'View Core Radicals (部首)'}</span>
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <Search size={17} color="var(--text-dim)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search kanji, English meaning, reading (on/kun), or example word..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '44px', borderRadius: 'var(--radius-full)' }}
          />
        </div>

        {/* JLPT Level Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-dim)', marginRight: '4px' }}>
            Filter by JLPT:
          </span>
          {['All', 'N5', 'N4', 'N3', 'N2', 'N1'].map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setSelectedJlpt(lvl)}
              className={`category-pill ${selectedJlpt === lvl ? 'active' : ''}`}
              style={{ fontSize: '0.8rem', padding: '5px 14px' }}
            >
              {lvl === 'All' ? 'All Levels' : `JLPT ${lvl}`}
            </button>
          ))}
        </div>
      </div>

      {/* Radicals Dropdown Guide */}
      {showRadicals && (
        <div className="glass-card" style={{ padding: '22px', borderLeft: '4px solid var(--accent-amber)' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--accent-amber)', marginBottom: '12px' }}>
            Common Kanji Radicals (部首 - Bushu)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
            {KANJI_RADICALS_INTRO.map((r, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', marginBottom: '2px' }}>
                  {r.radical} — <span style={{ fontSize: '0.88rem', color: 'var(--accent-cyan)' }}>{r.name}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  {r.meaning}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                  Examples: {r.examples}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kanji Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '18px' }}>
        {filteredKanji.map((item) => (
          <div
            key={item.id}
            className="glass-card glass-card-interactive"
            style={{
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}
          >
            <div>
              {/* Header: Large Kanji + JLPT Badge & Strokes */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '68px',
                      height: '68px',
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.12), rgba(59, 130, 246, 0.12))',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2.4rem',
                      fontWeight: '800',
                      color: '#ffffff',
                      fontFamily: '"Noto Sans JP", sans-serif'
                    }}
                  >
                    {item.kanji}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#f8fafc', margin: '0 0 4px 0' }}>
                      {item.meaning}
                    </h3>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: '700', background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', padding: '2px 8px', borderRadius: '4px' }}>
                        JLPT {item.jlpt}
                      </span>
                      <span style={{ fontSize: '0.72rem', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-dim)', padding: '2px 8px', borderRadius: '4px' }}>
                        {item.strokeCount} strokes
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(item.kanji, item.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '4px' }}
                  title="Copy Kanji"
                >
                  {copiedId === item.id ? <Check size={16} color="#34d399" /> : <Copy size={16} />}
                </button>
              </div>

              {/* Readings: On'yomi & Kun'yomi */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  <strong style={{ color: 'var(--accent-cyan)' }}>音読み (On):</strong> {item.onyomi}
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  <strong style={{ color: 'var(--accent-emerald)' }}>訓読み (Kun):</strong> {item.kunyomi}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                  Radical: {item.radical}
                </div>
              </div>

              {/* Example Vocabulary */}
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 12px', borderRadius: '8px', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
                  Example Vocabulary:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {item.exampleWords.map((w, wIdx) => (
                    <div key={wIdx} style={{ fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                      <span style={{ fontWeight: '700', color: '#ffffff' }}>{w.word} ({w.reading.split(' ')[0]})</span>
                      <span style={{ color: 'var(--text-dim)' }}>{w.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Example Sentence */}
            <div style={{ background: 'var(--code-bg)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: '600', color: '#f8fafc', marginBottom: '2px' }}>
                {item.exampleSentence.jp}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--accent-cyan)', marginBottom: '2px' }}>
                {item.exampleSentence.romaji}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                {item.exampleSentence.en}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanjiView;
