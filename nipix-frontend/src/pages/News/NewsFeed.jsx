import React, { useState } from 'react';
import {
  Newspaper,
  ExternalLink,
  Clock,
  Tag,
  Share2,
  BookOpen,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';

const NEWS_CATEGORIES = [
  'All News',
  'AI & Robotics',
  'Space & Physics',
  'Software & Dev',
  'Engineering',
  'Current Affairs'
];

const NEWS_ARTICLES = [
  {
    id: 1,
    title: 'Breakthrough in Quantum Error Correction: Logical Qubits Outperform Physical Qubits',
    source: 'Nature Quantum Information',
    sourceUrl: 'https://nature.com',
    date: '2 hours ago',
    category: 'Space & Physics',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    summary: 'Physicists demonstrate fault-tolerant quantum algorithms operating with surface code error syndromes, paving the path toward practical, noise-resilient quantum computers.',
    fullContent: `Researchers have demonstrated that redundant topological encoding across physical superconducting transmon qubits can suppress environmental decoherence below threshold levels. 
    
Key Takeaways for Students:
- Physical error rates per gate were suppressed by a factor of 2.4.
- Surface code distances d=3 and d=5 were tested simultaneously.
- Demonstrates feasibility of scaling beyond current NISQ (Noisy Intermediate-Scale Quantum) limitations to execute Shor's and Grover's algorithms.`
  },
  {
    id: 2,
    title: 'Open Source Reasoning Models Reach Frontier Benchmark Parity in Mathematics',
    source: 'MIT Technology Review',
    sourceUrl: 'https://technologyreview.com',
    date: '5 hours ago',
    category: 'AI & Robotics',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    summary: 'Novel reinforcement learning methods based on test-time search and Chain-of-Thought tree pruning achieve 90%+ scores on the American Invitational Mathematics Examination (AIME).',
    fullContent: `By training language models to reflect, verify intermediate algebraic assertions, and backtrack upon error detection, small open-weights models are competing directly with multi-billion parameter proprietary systems.

Educational Insights:
- Introduces "Test-Time Compute" scaling where token allocation expands dynamically based on problem difficulty.
- Reinforcement learning with verifiable reward signals (RLVR) guarantees mathematical soundness without hallucination.`
  },
  {
    id: 3,
    title: 'Solid-State Electrolytes Double Energy Density in Experimental Electric Aircraft Batteries',
    source: 'IEEE Spectrum',
    sourceUrl: 'https://spectrum.ieee.org',
    date: 'Yesterday',
    category: 'Engineering',
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80',
    summary: 'Materials engineers replace volatile liquid electrolytes with inorganic ceramic sulfide matrices, enabling safe silicon-anode cells yielding over 500 Wh/kg.',
    fullContent: `This electrochemical breakthrough eliminates thermal runaway risks while substantially reducing battery pack weight, bringing regional electric commuter flights into commercial feasibility within the decade.`
  },
  {
    id: 4,
    title: 'Linux Kernel 6.12 Mainlines Real-Time (PREEMPT_RT) Capability After Decades of Development',
    source: 'Kernel.org / Ars Technica',
    sourceUrl: 'https://arstechnica.com',
    date: '1 day ago',
    category: 'Software & Dev',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    summary: 'The long-standing real-time patch set is officially unified into the upstream kernel tree, unlocking deterministic microsecond latency for industrial robotics and aerospace systems.',
    fullContent: `For decades, developers building avionics, industrial automation, and robotic controllers had to maintain out-of-tree PREEMPT_RT patches. The merge guarantees bounded latency guarantees in stock Linux installations.`
  },
  {
    id: 5,
    title: 'Global Semiconductor Supply Chains: Advanced Packaging Becomes Key Geopolitical Strategic Asset',
    source: 'Financial Times / CSIS',
    sourceUrl: 'https://ft.com',
    date: '2 days ago',
    category: 'Current Affairs',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    summary: 'As silicon lithography nears physical atomic scaling limits, multi-die 2.5D/3D chiplet integration emerges as the decisive factor in high-performance computing supremacy.',
    fullContent: `Chip manufacturers are investing over $40B in chiplet packaging facilities worldwide to stack memory (HBM3e) directly adjacent to compute dies using silicon interposers and micro-bumps.`
  }
];

const NewsFeed = () => {
  const [selectedCategory, setSelectedCategory] = useState('All News');
  const [readingArticle, setReadingArticle] = useState(null);

  const filteredNews = NEWS_ARTICLES.filter(item => 
    selectedCategory === 'All News' || item.category === selectedCategory
  );

  return (
    <div className="page-theme-news" style={{ minHeight: '100vh', padding: '30px 20px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        
        {/* News Editorial Header */}
        <div className="glass-card" style={{ padding: '28px', marginBottom: '28px', borderLeft: '4px solid var(--accent-amber)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Newspaper size={24} color="#f59e0b" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Science & Technology News Wire
              </h1>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                Curated educational reporting across AI research, quantum physics, software architecture, and engineering.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {NEWS_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* News Stream */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '20px' }}>
          {filteredNews.map(article => (
            <article
              key={article.id}
              className="glass-card glass-card-interactive"
              style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ height: '170px', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={article.image}
                  alt={article.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'rgba(0, 0, 0, 0.75)',
                  backdropFilter: 'blur(8px)',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  color: 'var(--accent-amber)'
                }}>
                  {article.category}
                </div>
              </div>

              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    <span style={{ fontWeight: '600', color: 'var(--text-muted)' }}>{article.source}</span>
                    <span>{article.date}</span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', lineHeight: '1.4', marginBottom: '10px' }}>
                    {article.title}
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                    {article.summary}
                  </p>
                </div>

                <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    onClick={() => setReadingArticle(article)}
                    className="btn-primary"
                    style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                  >
                    Read In-App <ArrowRight size={14} />
                  </button>
                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontSize: '0.78rem' }}
                  >
                    Source <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* In-App Reader Modal */}
      {readingArticle && (
        <div className="modal-backdrop" onClick={() => setReadingArticle(null)}>
          <div className="glass-card" onClick={(e) => e.stopPropagation()} style={{
            maxWidth: '680px',
            width: '100%',
            maxHeight: '85vh',
            overflowY: 'auto',
            padding: '32px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)', padding: '3px 10px', borderRadius: '12px', fontWeight: '700' }}>
                  {readingArticle.category}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginLeft: '10px' }}>
                  {readingArticle.source} • {readingArticle.date}
                </span>
              </div>
              <button onClick={() => setReadingArticle(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1.3', marginBottom: '16px' }}>
              {readingArticle.title}
            </h2>

            <img
              src={readingArticle.image}
              alt={readingArticle.title}
              style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '20px' }}
            />

            <div style={{ fontSize: '0.94rem', color: 'var(--text-main)', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
              {readingArticle.fullContent}
            </div>

            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                Attribution: Indexed from {readingArticle.source}
              </span>
              <a
                href={readingArticle.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                style={{ padding: '6px 14px', fontSize: '0.82rem' }}
              >
                Visit Original Publisher <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default NewsFeed;
