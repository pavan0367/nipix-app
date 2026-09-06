import React, { useState } from 'react';
import {
  WRITING_SYSTEMS_INFO,
  HIRAGANA_DATA,
  HIRAGANA_DAKUTEN,
  HIRAGANA_YOON,
  KATAKANA_DATA,
  PRONUNCIATION_RULES,
  GREETINGS_DATA,
  SELF_INTRODUCTION_GUIDE,
  NUMBERS_DATA,
  CALENDAR_DATA,
  TIME_AND_COUNTERS_DATA
} from '../../data/japanese/basicsData';
import { Sparkles, Copy, Check, Volume2, BookOpen, Layers } from 'lucide-react';

const BasicsView = () => {
  const [subTab, setSubTab] = useState('hiragana');
  const [selectedKana, setSelectedKana] = useState(HIRAGANA_DATA[0]);
  const [copiedText, setCopiedText] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Sub-navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingBottom: '4px' }}>
        {[
          { id: 'hiragana', label: 'あ Hiragana (46)' },
          { id: 'katakana', label: 'ア Katakana (46)' },
          { id: 'pronunciation', label: '🔊 Sounds & Rules' },
          { id: 'greetings', label: '👋 Greetings & Intro' },
          { id: 'calendar', label: '📅 Numbers & Calendar' },
          { id: 'time', label: '⏰ Time & Counters' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSubTab(tab.id)}
            className={`category-pill ${subTab === tab.id ? 'active' : ''}`}
            style={{ fontSize: '0.82rem' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* -------------------------------------------------- */}
      {/* TAB 1: HIRAGANA                                     */}
      {/* -------------------------------------------------- */}
      {subTab === 'hiragana' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Active Kana Spotlight Card */}
          {selectedKana && (
            <div
              className="glass-card"
              style={{
                padding: '24px',
                borderLeft: '4px solid #ec4899',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(168, 85, 247, 0.15))',
                    border: '1px solid rgba(236, 72, 153, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.8rem',
                    fontWeight: '800',
                    color: '#ffffff',
                    fontFamily: '"Noto Sans JP", sans-serif'
                  }}
                >
                  {selectedKana.kana}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#f8fafc' }}>
                      {selectedKana.romaji}
                    </span>
                    <span style={{ fontSize: '0.78rem', background: 'rgba(255,255,255,0.06)', color: 'var(--text-dim)', padding: '2px 8px', borderRadius: '4px' }}>
                      {selectedKana.strokes} {selectedKana.strokes === 1 ? 'stroke' : 'strokes'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Pronunciation: <strong style={{ color: 'var(--accent-cyan)' }}>{selectedKana.guide}</strong>
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-dim)' }}>
                    Sample word: <strong style={{ color: '#f472b6' }}>{selectedKana.word}</strong> — {selectedKana.meaning}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(selectedKana.kana, 'kana-spotlight')}
                className="btn-secondary"
                style={{ fontSize: '0.8rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {copiedText === 'kana-spotlight' ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                <span>{copiedText === 'kana-spotlight' ? 'Copied' : 'Copy Kana'}</span>
              </button>
            </div>
          )}

          {/* 46 Basic Hiragana Grid */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="#ec4899" /> 46 Standard Hiragana Characters (五十音図 - Gojūon)
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))',
                gap: '10px'
              }}
            >
              {HIRAGANA_DATA.map((item) => {
                const isSelected = selectedKana?.kana === item.kana;
                return (
                  <button
                    key={item.kana}
                    type="button"
                    onClick={() => setSelectedKana(item)}
                    style={{
                      padding: '12px 6px',
                      borderRadius: '12px',
                      background: isSelected
                        ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.25), rgba(168, 85, 247, 0.25))'
                        : 'rgba(255, 255, 255, 0.03)',
                      border: isSelected ? '1px solid #ec4899' : '1px solid rgba(255, 255, 255, 0.07)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ fontSize: '1.7rem', fontWeight: '800', color: isSelected ? '#ffffff' : 'var(--text-main)', fontFamily: '"Noto Sans JP", sans-serif' }}>
                      {item.kana}
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: '600', color: isSelected ? '#ec4899' : 'var(--text-dim)' }}>
                      {item.romaji}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dakuten / Handakuten Grid */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '12px' }}>
              Dakuten ゛ & Handakuten ゜ (が, ざ, だ, ば, ぱ rows)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
              {HIRAGANA_DAKUTEN.map((d) => (
                <div
                  key={d.kana}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#f8fafc' }}>{d.kana}</span>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>{d.romaji}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{d.meaning}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Combination Sounds (Yōon 拗音) */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '12px' }}>
              Combination Sounds (Yōon 拗音: きゃ, しゃ, ちゃ...)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px' }}>
              {HIRAGANA_YOON.slice(0, 18).map((y) => (
                <div
                  key={y.kana}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <span style={{ fontSize: '1.3rem', fontWeight: '800', color: '#ec4899' }}>{y.kana}</span>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#ffffff' }}>{y.romaji}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{y.word}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* TAB 2: KATAKANA                                     */}
      {/* -------------------------------------------------- */}
      {subTab === 'katakana' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={16} color="var(--accent-cyan)" /> 46 Standard Katakana Characters (Foreign Loanwords & Emphasis)
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))',
                gap: '10px'
              }}
            >
              {KATAKANA_DATA.map((item) => (
                <div
                  key={item.kana}
                  style={{
                    padding: '12px 6px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.07)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span style={{ fontSize: '1.7rem', fontWeight: '800', color: 'var(--text-main)', fontFamily: '"Noto Sans JP", sans-serif' }}>
                    {item.kana}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--accent-cyan)' }}>
                    {item.romaji}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textAlign: 'center', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.word.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* TAB 3: PRONUNCIATION & RULES                        */}
      {/* -------------------------------------------------- */}
      {subTab === 'pronunciation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {PRONUNCIATION_RULES.map((rule, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '22px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--accent-emerald)', margin: '0 0 8px 0' }}>
                {rule.title}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: '1.5' }}>
                {rule.rule}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                {rule.examples.map((ex, exIdx) => (
                  <div
                    key={exIdx}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}
                  >
                    <div style={{ fontSize: '1rem', fontWeight: '700', color: '#f8fafc' }}>{ex.jp}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', marginBottom: '2px' }}>{ex.romaji}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{ex.meaning}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* TAB 4: GREETINGS & SELF-INTRODUCTION                */}
      {/* -------------------------------------------------- */}
      {subTab === 'greetings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Self-Introduction Master Template */}
          <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid var(--accent-cyan)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  {SELF_INTRODUCTION_GUIDE.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                  {SELF_INTRODUCTION_GUIDE.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(SELF_INTRODUCTION_GUIDE.sampleFullIntro.jp, 'intro-full')}
                className="btn-secondary"
                style={{ fontSize: '0.78rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {copiedText === 'intro-full' ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                <span>{copiedText === 'intro-full' ? 'Copied' : 'Copy Full Intro'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              {SELF_INTRODUCTION_GUIDE.template.map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-amber)', marginBottom: '4px' }}>
                    {step.step}
                  </div>
                  <div style={{ fontSize: '0.98rem', fontWeight: '700', color: '#f8fafc', marginBottom: '2px' }}>
                    {step.jp}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', marginBottom: '2px' }}>
                    {step.romaji}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                    {step.en}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--code-bg)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '6px', fontWeight: '700' }}>
                COMPLETE EXAMPLE:
              </div>
              <div style={{ fontSize: '0.92rem', color: '#f8fafc', fontWeight: '600', lineHeight: '1.6' }}>
                {SELF_INTRODUCTION_GUIDE.sampleFullIntro.jp}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', marginTop: '4px' }}>
                {SELF_INTRODUCTION_GUIDE.sampleFullIntro.romaji}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {SELF_INTRODUCTION_GUIDE.sampleFullIntro.en}
              </div>
            </div>
          </div>

          {/* Everyday Greetings Grid */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '14px' }}>
              Essential Everyday Greetings (挨拶 - Aisatsu)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
              {GREETINGS_DATA.map((g, idx) => (
                <div key={idx} className="glass-card" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#f8fafc', marginBottom: '2px' }}>
                      {g.japanese}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(g.japanese, `greet-${idx}`)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '2px' }}
                      title="Copy"
                    >
                      {copiedText === `greet-${idx}` ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: '600', marginBottom: '6px' }}>
                    {g.romaji}
                  </div>
                  <div style={{ fontSize: '0.86rem', color: 'var(--text-main)', fontWeight: '600', marginBottom: '6px' }}>
                    {g.english}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', lineHeight: '1.4' }}>
                    {g.situation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* TAB 5: NUMBERS & CALENDAR                           */}
      {/* -------------------------------------------------- */}
      {subTab === 'calendar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Numbers Grid */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '14px' }}>
              Numbers (0 to 10,000+)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
              {NUMBERS_DATA.map((n) => (
                <div
                  key={n.num}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}
                >
                  <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--accent-amber)' }}>{n.num}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc' }}>{n.kanji}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>{n.romaji}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Days of the Week */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '14px' }}>
              Days of the Week (曜日 - Youbi)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
              {CALENDAR_DATA.daysOfWeek.map((d) => (
                <div
                  key={d.kanji}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)'
                  }}
                >
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff' }}>{d.kanji}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)' }}>{d.romaji}</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-main)', marginTop: '4px' }}>{d.english}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{d.element}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Special Days of the Month */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '14px' }}>
              Special Days of the Month (1st to 10th, 14th, 20th, 24th)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
              {CALENDAR_DATA.specialDaysOfMonth.map((s) => (
                <div
                  key={s.day}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: '700' }}>{s.day}</div>
                  <div style={{ fontSize: '1rem', fontWeight: '700', color: '#f8fafc' }}>{s.kanji} ({s.kana})</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>{s.romaji}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* TAB 6: TIME & COUNTERS                              */}
      {/* -------------------------------------------------- */}
      {subTab === 'time' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Time Units */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '14px' }}>
              Telling Time (時間 - Jikan)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
              {TIME_AND_COUNTERS_DATA.timeUnits.map((t, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}
                >
                  <div style={{ fontSize: '1rem', fontWeight: '800', color: '#f8fafc' }}>{t.jp}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)' }}>{t.romaji}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>{t.en}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Counters */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '14px' }}>
              Japanese Counting Words (助数詞 - Joshūshi)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
              {TIME_AND_COUNTERS_DATA.counters.map((c, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}
                >
                  <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--accent-amber)', marginBottom: '4px' }}>
                    {c.counter}
                  </div>
                  <div style={{ fontSize: '0.84rem', fontWeight: '600', color: '#f8fafc', marginBottom: '4px' }}>
                    Used for: {c.usage}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: '1.4' }}>
                    Examples: {c.examples}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicsView;
