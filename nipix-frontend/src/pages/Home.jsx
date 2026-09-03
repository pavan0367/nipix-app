import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  BookOpen,
  Newspaper,
  Film,
  Compass,
  MessageSquare,
  ArrowRight,
  Flame,
  CheckCircle2,
  Clock,
  Send,
  Code2,
  Zap,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';

const Home = () => {
  const currentUser = useSelector((state) => state.auth?.user);
  const navigate = useNavigate();
  const [quickAiPrompt, setQuickAiPrompt] = useState('');

  const handleAiPromptSubmit = (e) => {
    e.preventDefault();
    if (!quickAiPrompt.trim()) return;
    navigate('/chat');
  };

  return (
    <div className="page-theme-home" style={{ minHeight: '100vh', padding: '30px 20px' }}>
      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
        
        {/* Welcome Hero / AI Scholar Banner */}
        <div className="glass-card" style={{
          padding: '36px 32px',
          marginBottom: '28px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '640px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: 'var(--radius-full)', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--accent-blue)', fontSize: '0.78rem', fontWeight: '700', marginBottom: '14px', border: '1px solid var(--border-color)' }}>
              <BrainCircuit size={14} /> AI STUDY CO-PILOT ACTIVE
            </div>
            
            <h1 style={{ fontSize: '2.1rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1.25', margin: '0 0 10px 0' }}>
              Accelerate Your Studies with <span style={{ background: 'var(--scholar-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Nipix Scholar</span>
            </h1>

            <p style={{ fontSize: '0.94rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: '0 0 24px 0' }}>
              Access peer-reviewed study notes, explore cutting-edge science and tech news, stream university video lectures, and consult the AI study terminal.
            </p>

            {/* Quick AI Study Prompter Form */}
            <form onSubmit={handleAiPromptSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Ask AI: Explain Dijkstra's algorithm or summarize quantum qubits..."
                value={quickAiPrompt}
                onChange={(e) => setQuickAiPrompt(e.target.value)}
                className="input-field"
                style={{ borderRadius: 'var(--radius-full)', padding: '14px 20px', background: 'var(--bg-input)' }}
              />
              <button type="submit" className="btn-primary" style={{ borderRadius: 'var(--radius-full)', padding: '14px 24px', flexShrink: 0 }}>
                <Sparkles size={16} /> Consult AI
              </button>
            </form>
          </div>
        </div>

        {/* Dashboard Stats & Quick Navigation Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          
          <Link to="/study" className="glass-card glass-card-interactive" style={{ padding: '20px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={22} color="#10b981" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>Study Notes</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', margin: '2px 0 0 0' }}>Algorithms & Math Sheets</p>
            </div>
          </Link>

          <Link to="/news" className="glass-card glass-card-interactive" style={{ padding: '20px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Newspaper size={22} color="#f59e0b" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>Tech News</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', margin: '2px 0 0 0' }}>Daily Science Wire</p>
            </div>
          </Link>

          <Link to="/youtube" className="glass-card glass-card-interactive" style={{ padding: '20px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Film size={22} color="#f43f5e" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>Lectures</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', margin: '2px 0 0 0' }}>In-App YouTube Studio</p>
            </div>
          </Link>

          <Link to="/chat" className="glass-card glass-card-interactive" style={{ padding: '20px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={22} color="#818cf8" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>Private Chat</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', margin: '2px 0 0 0' }}>Encrypted Vault Channel</p>
            </div>
          </Link>

        </div>

        {/* Highlighted Study Tracks */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }} className="theatre-layout">
          
          {/* Left Column: Recommended Learning Tracks */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={18} color="var(--accent-cyan)" /> Recommended Study Modules
              </h2>
              <Link to="/study" style={{ fontSize: '0.82rem', color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: '600' }}>
                View All
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="glass-card glass-card-interactive" style={{ padding: '18px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: '700' }}>COMPUTER SCIENCE</span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', margin: '4px 0 6px 0' }}>
                  Deep Learning & Transformer Mechanics
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '0 0 12px 0' }}>
                  Detailed mathematical formulations of self-attention matrices, positional encodings, and gradient propagation.
                </p>
                <Link to="/study" className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                  Open Study Guide <ArrowRight size={12} />
                </Link>
              </div>

              <div className="glass-card glass-card-interactive" style={{ padding: '18px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', fontWeight: '700' }}>MATHEMATICS</span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', margin: '4px 0 6px 0' }}>
                  Multivariable Calculus & Green’s Vector Theorem
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '0 0 12px 0' }}>
                  Planar vector integrals, divergence theorem, and Maxwell equations visual foundations.
                </p>
                <Link to="/study" className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                  Open Study Guide <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Scholar Progress & Daily Streak */}
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={18} color="#f59e0b" /> Daily Learning Streak
            </h2>

            <div className="glass-card" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div>
                  <span style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)' }}>5 Days</span>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>Keep the momentum going!</p>
                </div>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Flame size={24} color="#f59e0b" />
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#cbd5e1', display: 'block', marginBottom: '8px' }}>
                  Today's Milestones:
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#34d399', marginBottom: '6px' }}>
                  <CheckCircle2 size={14} /> 1 Algorithm Review Completed
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                  <Clock size={14} /> 1 Video Lecture Scheduled
                </div>
              </div>

              <Link to="/study" className="btn-primary" style={{ width: '100%', fontSize: '0.84rem' }}>
                Continue Learning Track
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Home;