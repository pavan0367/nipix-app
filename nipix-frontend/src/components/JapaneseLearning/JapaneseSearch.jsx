import React, { useState } from 'react';
import { Search, Sparkles, BookOpen, Layers, ArrowRight } from 'lucide-react';
import { HIRAGANA_DATA, KATAKANA_DATA } from '../../data/japanese/basicsData';
import { KANJI_DATA } from '../../data/japanese/kanjiData';
import { VOCABULARY_DATA } from '../../data/japanese/vocabularyData';
import { GRAMMAR_DATA } from '../../data/japanese/grammarData';

const JapaneseSearch = ({ onNavigateTab }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const q = searchTerm.trim().toLowerCase();

  // Search results
  const kanjiResults = q
    ? KANJI_DATA.filter(
        (k) =>
          k.kanji.includes(q) ||
          k.meaning.toLowerCase().includes(q) ||
          k.onyomi.toLowerCase().includes(q) ||
          k.kunyomi.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const vocabResults = q
    ? VOCABULARY_DATA.filter(
        (v) =>
          v.japanese.includes(q) ||
          v.romaji.toLowerCase().includes(q) ||
          v.english.toLowerCase().includes(q) ||
          v.sentence.jp.includes(q)
      ).slice(0, 6)
    : [];

  const kanaResults = q
    ? [...HIRAGANA_DATA, ...KATAKANA_DATA]
        .filter(
          (kana) =>
            kana.kana.includes(q) ||
            kana.romaji.toLowerCase().includes(q) ||
            kana.meaning.toLowerCase().includes(q) ||
            kana.word.toLowerCase().includes(q)
        )
        .slice(0, 4)
    : [];

  const grammarResults = q
    ? GRAMMAR_DATA.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.explanation.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const hasResults = kanjiResults.length > 0 || vocabResults.length > 0 || kanaResults.length > 0 || grammarResults.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Search Input Box */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search size={18} color="#ec4899" /> Universal Japanese Learning Search
        </h3>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '0 0 16px 0' }}>
          Search instantly across Kanji characters, Hiragana, Katakana, Vocabulary, Romaji, and Grammar concepts.
        </p>

        <div style={{ position: 'relative' }}>
          <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Try searching: ありがとう, 学, Sensei, は, Katakana, Shinkansen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '46px', borderRadius: 'var(--radius-full)', fontSize: '0.94rem' }}
          />
        </div>

        {/* Example Search Chips */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginTop: '12px' }}>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>Popular searches:</span>
          {['ありがとう', '学', 'こんにちは', '新幹線', 'は (wa)', 'AI'].map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => setSearchTerm(term.split(' ')[0])}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '9999px',
                padding: '3px 10px',
                color: '#cbd5e1',
                fontSize: '0.74rem',
                cursor: 'pointer'
              }}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Results View */}
      {q && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!hasResults && (
            <div className="glass-card" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No matches found for "{searchTerm}". Try searching by English meaning, Romaji, or Japanese characters.
            </div>
          )}

          {/* 1. Kanji Matches */}
          {kanjiResults.length > 0 && (
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: '800', color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                  Kanji Matches ({kanjiResults.length})
                </span>
                {onNavigateTab && (
                  <button type="button" onClick={() => onNavigateTab('kanji')} className="btn-secondary" style={{ fontSize: '0.74rem', padding: '4px 10px' }}>
                    View in Kanji Hub <ArrowRight size={12} />
                  </button>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                {kanjiResults.map((k) => (
                  <div key={k.id} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff' }}>{k.kanji}</span>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#f8fafc' }}>{k.meaning}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>On: {k.onyomi} • JLPT {k.jlpt}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Vocabulary Matches */}
          {vocabResults.length > 0 && (
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: '800', color: 'var(--accent-emerald)', textTransform: 'uppercase' }}>
                  Vocabulary Matches ({vocabResults.length})
                </span>
                {onNavigateTab && (
                  <button type="button" onClick={() => onNavigateTab('vocab')} className="btn-secondary" style={{ fontSize: '0.74rem', padding: '4px 10px' }}>
                    View Vocabulary <ArrowRight size={12} />
                  </button>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                {vocabResults.map((v) => (
                  <div key={v.id} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff' }}>{v.japanese}</span>
                      <span style={{ fontSize: '0.76rem', color: 'var(--accent-cyan)' }}>{v.romaji}</span>
                    </div>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-main)', marginBottom: '4px' }}>{v.english}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>{v.sentence.jp}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Grammar Matches */}
          {grammarResults.length > 0 && (
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: '800', color: 'var(--accent-amber)', textTransform: 'uppercase' }}>
                  Grammar Lessons ({grammarResults.length})
                </span>
                {onNavigateTab && (
                  <button type="button" onClick={() => onNavigateTab('grammar')} className="btn-secondary" style={{ fontSize: '0.74rem', padding: '4px 10px' }}>
                    View Grammar <ArrowRight size={12} />
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {grammarResults.map((g) => (
                  <div key={g.id} style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}>
                    <div style={{ fontSize: '0.94rem', fontWeight: '800', color: '#f8fafc', marginBottom: '2px' }}>{g.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{g.explanation}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Kana Matches */}
          {kanaResults.length > 0 && (
            <div className="glass-card" style={{ padding: '20px' }}>
              <span style={{ fontSize: '0.84rem', fontWeight: '800', color: '#f472b6', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                Kana Matches ({kanaResults.length})
              </span>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {kanaResults.map((item, idx) => (
                  <div key={idx} style={{ padding: '10px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ffffff' }}>{item.kana}</span>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>{item.romaji}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{item.word}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JapaneseSearch;
