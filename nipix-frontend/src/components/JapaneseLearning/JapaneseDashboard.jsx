import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Sparkles,
  Award,
  Layers,
  Search,
  MessageSquare,
  ArrowRight,
  GraduationCap,
  Languages,
  CheckCircle2,
  Bookmark,
  Volume2
} from 'lucide-react';
import NipixLogo from '../NipixLogo';
import BasicsView from './BasicsView';
import KanjiView from './KanjiView';
import VocabularyView from './VocabularyView';
import GrammarView from './GrammarView';
import JlptView from './JlptView';
import ReadingView from './ReadingView';
import ConversationView from './ConversationView';
import QuizzesView from './QuizzesView';
import JapaneseSearch from './JapaneseSearch';

const MODULE_TABS = [
  { id: 'overview', label: '🧭 Dashboard' },
  { id: 'basics', label: 'あ Basics (Kana)' },
  { id: 'kanji', label: '漢 Kanji' },
  { id: 'vocab', label: '📖 Vocabulary' },
  { id: 'grammar', label: '📐 Grammar' },
  { id: 'jlpt', label: '🎯 JLPT (N5-N1)' },
  { id: 'reading', label: '📑 Reading' },
  { id: 'conversation', label: '💬 Conversation' },
  { id: 'quizzes', label: '✍️ Quizzes' },
  { id: 'search', label: '🔍 Search' }
];

const JapaneseDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleStartAiChat = () => {
    navigate('/chat/sakura');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* ---------------------------------------------------- */}
      {/* 1. JAPANESE LEARNING HERO HUB BANNER                 */}
      {/* ---------------------------------------------------- */}
      <div
        className="glass-card"
        style={{
          padding: '28px',
          borderLeft: '4px solid #ec4899',
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.08), rgba(15, 23, 42, 0.6))',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #ec4899, #be185d)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                boxShadow: '0 8px 24px rgba(236, 72, 153, 0.35)',
                flexShrink: 0
              }}
            >
              🇯🇵
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  Japanese Language Learning Platform
                </h1>
                <span style={{ fontSize: '0.74rem', background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', padding: '3px 10px', borderRadius: '9999px', fontWeight: '700' }}>
                  Complete N5 → N1
                </span>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '6px 0 0 0' }}>
                Comprehensive curriculum covering Hiragana, Katakana, Kanji, Vocabulary, Grammar, JLPT prep, reading, conversations, and interactive quizzes.
              </p>
            </div>
          </div>

          {/* Quick AI Sensei Chat Button in Header */}
          <button
            type="button"
            onClick={handleStartAiChat}
            className="btn-primary"
            style={{
              padding: '10px 20px',
              fontSize: '0.86rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #ec4899, #be185d)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(236, 72, 153, 0.3)',
              cursor: 'pointer'
            }}
          >
            <Sparkles size={16} />
            <span>Chat with Sakura AI</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. DEDICATED AI TUTOR CALLOUT CARD (REQUIREMENT #20) */}
      {/* ---------------------------------------------------- */}
      <div
        className="glass-card glass-card-interactive"
        style={{
          padding: '22px 26px',
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.12), rgba(59, 130, 246, 0.08))',
          border: '1px solid rgba(236, 72, 153, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'rgba(236, 72, 153, 0.2)',
              border: '2px solid #ec4899',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              boxShadow: '0 0 16px rgba(236, 72, 153, 0.35)'
            }}
          >
            🌸
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <h3 style={{ fontSize: '1.18rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                🇯🇵 Japanese AI Tutor (Sakura)
              </h3>
              <span style={{ fontSize: '0.72rem', background: 'rgba(56, 189, 248, 0.12)', color: 'var(--accent-cyan)', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                @sakura_jp
              </span>
            </div>
            <p style={{ fontSize: '0.86rem', color: '#cbd5e1', margin: 0 }}>
              Ask Sakura anything about Japanese grammar, vocabulary, kanji stroke order, translations, or JLPT questions.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleStartAiChat}
          style={{
            padding: '10px 22px',
            fontSize: '0.88rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #ec4899, #be185d)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '9999px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(236, 72, 153, 0.35)',
            transition: 'all 0.2s ease'
          }}
        >
          <span>Start Japanese AI</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. PRIMARY MODULE NAVIGATION PILLS                  */}
      {/* ---------------------------------------------------- */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {MODULE_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`category-pill ${activeTab === tab.id ? 'active' : ''}`}
            style={{ fontSize: '0.84rem', padding: '7px 16px' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ---------------------------------------------------- */}
      {/* 4. TAB CONTENTS                                     */}
      {/* ---------------------------------------------------- */}

      {/* OVERVIEW / DASHBOARD HOME */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Learning Progress / Milestone Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
            <div className="glass-card" style={{ padding: '18px' }}>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase' }}>Kana Writing Systems</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ffffff', margin: '4px 0' }}>92 Characters</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)' }}>46 Hiragana + 46 Katakana</div>
            </div>
            <div className="glass-card" style={{ padding: '18px' }}>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase' }}>Essential Kanji</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ffffff', margin: '4px 0' }}>JLPT N5 – N1</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)' }}>On/Kun readings & radicals</div>
            </div>
            <div className="glass-card" style={{ padding: '18px' }}>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase' }}>Vocabulary Library</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ffffff', margin: '4px 0' }}>25+ Categories</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--accent-amber)' }}>Tech, college, everyday</div>
            </div>
            <div className="glass-card" style={{ padding: '18px' }}>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase' }}>Grammar Lessons</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ffffff', margin: '4px 0' }}>3 Levels</div>
              <div style={{ fontSize: '0.78rem', color: '#f472b6' }}>Beginner to Keigo Honorifics</div>
            </div>
          </div>

          {/* Quick Launch Cards */}
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '14px' }}>
              Core Learning Tracks
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {[
                {
                  id: 'basics',
                  icon: 'あ',
                  title: 'Start with Basics',
                  desc: 'Learn Hiragana, Katakana, correct pronunciation, long vowels, double consonants, numbers, and greetings.',
                  tag: 'Beginner Essential',
                  color: '#ec4899'
                },
                {
                  id: 'kanji',
                  icon: '漢',
                  title: 'Kanji Explorer',
                  desc: 'Master character stroke orders, radicals, On\'yomi & Kun\'yomi readings, and compound words.',
                  tag: 'JLPT N5-N1',
                  color: 'var(--accent-cyan)'
                },
                {
                  id: 'vocab',
                  icon: '📖',
                  title: 'Vocabulary Library',
                  desc: 'Over 25+ everyday, academic, technological, programming, and travel categories with full sentences.',
                  tag: 'Word Power',
                  color: 'var(--accent-emerald)'
                },
                {
                  id: 'grammar',
                  icon: '📐',
                  title: 'Grammar Mastery',
                  desc: 'Clear explanations for particles (は, が, を, に), conjugations (て-form, た-form), and honorifics (Keigo).',
                  tag: 'Foundations',
                  color: 'var(--accent-amber)'
                },
                {
                  id: 'jlpt',
                  icon: '🎯',
                  title: 'JLPT Preparation',
                  desc: 'Targeted study tracks for N5, N4, N3, N2, and N1 with official syllabus breakdowns and strategies.',
                  tag: 'Exam Focused',
                  color: '#8b5cf6'
                },
                {
                  id: 'reading',
                  icon: '📑',
                  title: 'Reading Practice',
                  desc: 'Graded passages with furigana, romaji toggles, English reveal, and sentence-by-sentence grammar breakdowns.',
                  tag: 'Comprehension',
                  color: '#38bdf8'
                },
                {
                  id: 'conversation',
                  icon: '💬',
                  title: 'Practical Conversations',
                  desc: 'Situational dialogues for restaurants, train stations, universities, asking directions, and the workplace.',
                  tag: 'Real-world Spoken',
                  color: 'var(--accent-emerald)'
                },
                {
                  id: 'quizzes',
                  icon: '✍️',
                  title: 'Interactive Quizzes',
                  desc: 'Multi-category question bank with immediate feedback, detailed explanations, and score tracking.',
                  tag: 'Test Yourself',
                  color: '#ec4899'
                }
              ].map((card) => (
                <div
                  key={card.id}
                  onClick={() => setActiveTab(card.id)}
                  className="glass-card glass-card-interactive"
                  style={{ padding: '22px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '10px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.4rem',
                          fontWeight: '800'
                        }}
                      >
                        {card.icon}
                      </span>
                      <span style={{ fontSize: '0.72rem', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-dim)', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                        {card.tag}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.12rem', fontWeight: '800', color: '#f8fafc', margin: '0 0 6px 0' }}>
                      {card.title}
                    </h4>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                      {card.desc}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '700', color: card.color, marginTop: '16px' }}>
                    <span>Explore Track</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BASICS TAB */}
      {activeTab === 'basics' && <BasicsView />}

      {/* KANJI TAB */}
      {activeTab === 'kanji' && <KanjiView />}

      {/* VOCABULARY TAB */}
      {activeTab === 'vocab' && <VocabularyView />}

      {/* GRAMMAR TAB */}
      {activeTab === 'grammar' && <GrammarView />}

      {/* JLPT TAB */}
      {activeTab === 'jlpt' && <JlptView />}

      {/* READING TAB */}
      {activeTab === 'reading' && <ReadingView />}

      {/* CONVERSATION TAB */}
      {activeTab === 'conversation' && <ConversationView />}

      {/* QUIZZES TAB */}
      {activeTab === 'quizzes' && <QuizzesView />}

      {/* SEARCH TAB */}
      {activeTab === 'search' && <JapaneseSearch onNavigateTab={(tab) => setActiveTab(tab)} />}
    </div>
  );
};

export default JapaneseDashboard;
