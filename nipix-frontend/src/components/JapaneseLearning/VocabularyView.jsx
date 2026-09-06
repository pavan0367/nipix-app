import React, { useState } from 'react';
import { VOCAB_CATEGORIES, VOCABULARY_DATA } from '../../data/japanese/vocabularyData';
import { Search, Copy, Check, BookOpen, Volume2 } from 'lucide-react';

const VocabularyView = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Words');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const filteredVocab = VOCABULARY_DATA.filter((item) => {
    const matchesCategory = selectedCategory === 'All Words' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.japanese.includes(q) ||
      item.romaji.toLowerCase().includes(q) ||
      item.english.toLowerCase().includes(q) ||
      item.sentence.jp.includes(q) ||
      item.sentence.en.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header & Filters */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={20} color="var(--accent-emerald)" /> Japanese Vocabulary Library
        </h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '0 0 16px 0' }}>
          Over 25+ curated real-world domains with Kanji, Furigana, Romaji, English meanings, and contextual sentences.
        </p>

        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <Search size={17} color="var(--text-dim)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search words by Japanese, Romaji, or English definition..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '44px', borderRadius: 'var(--radius-full)' }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {VOCAB_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              style={{ fontSize: '0.78rem', padding: '5px 12px' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Vocabulary Cards List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '16px' }}>
        {filteredVocab.map((item) => (
          <div
            key={item.id}
            className="glass-card glass-card-interactive"
            style={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.74rem', background: 'rgba(79, 172, 254, 0.12)', color: 'var(--accent-cyan)', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                  {item.category}
                </span>

                <button
                  type="button"
                  onClick={() => handleCopy(item.japanese, item.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '2px' }}
                  title="Copy word"
                >
                  {copiedId === item.id ? <Check size={15} color="#34d399" /> : <Copy size={15} />}
                </button>
              </div>

              {/* Japanese Word + Romaji */}
              <div style={{ marginBottom: '10px' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff', margin: '0 0 2px 0', fontFamily: '"Noto Sans JP", sans-serif' }}>
                  {item.japanese}
                </h3>
                <div style={{ fontSize: '0.82rem', fontWeight: '600', color: '#f472b6' }}>
                  {item.romaji}
                </div>
              </div>

              {/* English Definition */}
              <div style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '14px' }}>
                {item.english}
              </div>
            </div>

            {/* Contextual Sentence Box */}
            <div style={{ background: 'var(--code-bg)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '10px 12px' }}>
              <div style={{ fontSize: '0.82rem', color: '#f8fafc', fontWeight: '600', marginBottom: '2px', lineHeight: '1.4' }}>
                {item.sentence.jp}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--accent-cyan)', marginBottom: '2px' }}>
                {item.sentence.romaji}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                {item.sentence.en}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VocabularyView;
