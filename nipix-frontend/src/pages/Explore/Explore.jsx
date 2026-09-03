import React, { useState } from 'react';
import {
  Compass,
  Bookmark,
  Share2,
  Sparkles,
  HelpCircle,
  Lightbulb,
  ExternalLink,
  Code2,
  Atom,
  Check
} from 'lucide-react';

const EXPLORE_STUDY_CARDS = [
  {
    id: 1,
    title: 'How Operating Systems Handle Page Faults & Virtual Memory',
    category: 'Infographic / Systems',
    author: 'OS Insights Hub',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    summary: 'Step-by-step visual sequence of MMU address translation, TLB cache miss, kernel trap handling, swapping frame from disk, and updating page table PTE flags.',
    likes: 342,
    badge: 'Educational Visual',
    tags: ['VirtualMemory', 'OperatingSystems', 'ComputerArchitecture']
  },
  {
    id: 2,
    title: 'Daily Science Puzzle: The Twin Paradox in Special Relativity',
    category: 'Physics & STEM',
    author: 'Relativity Lab',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    summary: 'Why is the traveling twin physically younger upon return? Breakdown of asymmetric acceleration frames and Minkowski spacetime interval invariants: Δs² = c²Δt² - Δx².',
    likes: 512,
    badge: 'Concept Puzzle',
    tags: ['Physics', 'SpaceTime', 'Calculus']
  },
  {
    id: 3,
    title: 'SQL Window Functions Cheat Sheet: ROW_NUMBER vs RANK vs DENSE_RANK',
    category: 'Database Cheatsheet',
    author: 'Data Mastery',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80',
    summary: 'Quick visual comparison of partition ranking semantics when ties occur, with real-world examples for percentile calculations and rolling revenue sums.',
    likes: 890,
    badge: 'Cheatsheet',
    tags: ['SQL', 'Databases', 'Analytics']
  },
  {
    id: 4,
    title: 'Binary Search Tree Balancing: AVL Rotations Demystified',
    category: 'Algorithms',
    author: 'Algo Daily',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
    summary: 'Single Left/Right rotations versus Double Left-Right (LR) rotations when balance factor exceeds [-1, 0, 1]. Preserving logarithmic height guarantees.',
    likes: 420,
    badge: 'Infographic',
    tags: ['DataStructures', 'Trees', 'Algorithms']
  }
];

const Explore = () => {
  const [copiedCardId, setCopiedCardId] = useState(null);
  const [savedCards, setSavedCards] = useState({});

  const handleShare = (id) => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedCardId(id);
    setTimeout(() => setCopiedCardId(null), 2000);
  };

  const handleToggleSave = (id) => {
    setSavedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="page-theme-study" style={{ minHeight: '100vh', padding: '30px 20px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        
        {/* Explore Header */}
        <div className="glass-card" style={{ padding: '24px', marginBottom: '28px', borderLeft: '4px solid var(--accent-cyan)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(0, 242, 254, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Compass size={24} color="#00f2fe" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Explore Educational Visuals & Science Cards
              </h1>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                Curated public educational infographics, coding cheatsheets, and science flashcards.
              </p>
            </div>
          </div>
        </div>

        {/* Visual Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '22px' }}>
          {EXPLORE_STUDY_CARDS.map(card => (
            <div key={card.id} className="glass-card glass-card-interactive" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                <img src={card.image} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'rgba(0, 0, 0, 0.8)',
                  backdropFilter: 'blur(8px)',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  color: 'var(--accent-cyan)'
                }}>
                  {card.badge}
                </div>
              </div>

              <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontWeight: '600' }}>
                    {card.author} • {card.category}
                  </span>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', margin: '8px 0 10px 0', lineHeight: '1.4' }}>
                    {card.title}
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                    {card.summary}
                  </p>
                </div>

                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {card.tags.slice(0, 2).map(t => (
                      <span key={t} style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.04)', color: 'var(--text-dim)', padding: '2px 6px', borderRadius: '4px' }}>
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleToggleSave(card.id)}
                      className="btn-secondary"
                      style={{ padding: '6px', borderRadius: '50%' }}
                      title="Bookmark card"
                    >
                      <Bookmark size={15} fill={savedCards[card.id] ? "var(--accent-cyan)" : "none"} color={savedCards[card.id] ? "var(--accent-cyan)" : "#94a3b8"} />
                    </button>
                    <button
                      onClick={() => handleShare(card.id)}
                      className="btn-secondary"
                      style={{ padding: '6px', borderRadius: '50%' }}
                      title="Share link"
                    >
                      {copiedCardId === card.id ? <Check size={15} color="#34d399" /> : <Share2 size={15} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Explore;
