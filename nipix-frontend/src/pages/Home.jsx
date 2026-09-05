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
          padding: '36px 36px',
          marginBottom: '32px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 'var(--radius-lg)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr',
            gap: '32px',
            alignItems: 'center',
            position: 'relative',
            zIndex: 2
          }} className="hero-grid">
            
            {/* Left Content */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(124, 58, 237, 0.12)',
                color: 'var(--accent-purple)',
                fontSize: '0.78rem',
                fontWeight: '700',
                marginBottom: '16px',
                border: '1px solid rgba(124, 58, 237, 0.25)'
              }}>
                <BrainCircuit size={14} /> ✦ AI STUDY CO-PILOT ACTIVE ●
              </div>
              
              <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1.2', margin: '0 0 14px 0', letterSpacing: '-0.02em' }}>
                Accelerate Your Studies with <span style={{ background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Nipix</span>
              </h1>

              <p style={{ fontSize: '0.96rem', color: 'var(--text-muted)', lineHeight: '1.65', margin: '0 0 26px 0' }}>
                Access peer-reviewed study notes, explore cutting-edge science and tech news, stream university video lectures, and consult the AI study terminal.
              </p>

              {/* Quick AI Study Prompter Form */}
              <form onSubmit={handleAiPromptSubmit} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'var(--bg-input)',
                padding: '6px 6px 6px 18px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-color)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
              }}>
                <input
                  type="text"
                  placeholder="Ask AI: Explain Dijkstra's algorithm..."
                  value={quickAiPrompt}
                  onChange={(e) => setQuickAiPrompt(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem'
                  }}
                />
                <button type="submit" className="btn-primary" style={{ borderRadius: 'var(--radius-full)', padding: '12px 22px', flexShrink: 0, gap: '6px' }}>
                  <Sparkles size={16} /> Consult AI ✦
                </button>
              </form>
            </div>

            {/* Right Educational AI Robot Companion Artwork */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, rgba(59, 130, 246, 0.15) 50%, transparent 70%)',
                filter: 'blur(30px)',
                zIndex: 1
              }} />
              
              <svg width="240" height="220" viewBox="0 0 240 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'relative', zIndex: 2 }}>
                {/* Floating Educational Tech Elements */}
                <circle cx="40" cy="40" r="18" fill="url(#blueGrad)" opacity="0.8" />
                <path d="M34 40L46 40M40 34L40 46" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />

                <circle cx="200" cy="50" r="14" fill="url(#purpleGrad)" opacity="0.8" />
                <path d="M194 50L206 50" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />

                {/* Robot Head */}
                <rect x="70" y="60" width="100" height="85" rx="20" fill="url(#robotBody)" stroke="#7c3aed" strokeWidth="2" />
                
                {/* Robot Eyes (Glowing Cyan & Purple) */}
                <circle cx="95" cy="100" r="10" fill="#00f2fe" />
                <circle cx="95" cy="100" r="4" fill="#ffffff" />
                
                <circle cx="145" cy="100" r="10" fill="#a855f7" />
                <circle cx="145" cy="100" r="4" fill="#ffffff" />

                {/* Friendly Smile */}
                <path d="M108 122 Q120 132 132 122" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" fill="none" />

                {/* Graduation Cap */}
                <polygon points="120,20 180,45 120,60 60,45" fill="#3b82f6" />
                <polygon points="120,22 175,45 120,58 65,45" fill="#60a5fa" />
                <rect x="92" y="48" width="56" height="14" rx="3" fill="#1d4ed8" />
                <circle cx="170" cy="45" r="4" fill="#f59e0b" />
                <line x1="170" y1="45" x2="182" y2="70" stroke="#f59e0b" strokeWidth="2" />

                {/* Antenna Spark */}
                <line x1="120" y1="60" x2="120" y2="40" stroke="#a855f7" strokeWidth="2" />

                {/* Floating Book */}
                <rect x="65" y="165" width="110" height="35" rx="8" fill="url(#bookGrad)" />
                <path d="M75 180H165" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />

                <defs>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="40" y2="40">
                    <stop stopColor="#3b82f6" />
                    <stop offset="1" stopColor="#06b6d4" />
                  </linearGradient>
                  <linearGradient id="purpleGrad" x1="0" y1="0" x2="28" y2="28">
                    <stop stopColor="#a855f7" />
                    <stop offset="1" stopColor="#ec4899" />
                  </linearGradient>
                  <linearGradient id="robotBody" x1="70" y1="60" x2="170" y2="145">
                    <stop stopColor="#1e1b4b" />
                    <stop offset="1" stopColor="#312e81" />
                  </linearGradient>
                  <linearGradient id="bookGrad" x1="65" y1="165" x2="175" y2="200">
                    <stop stopColor="#7c3aed" />
                    <stop offset="1" stopColor="#2563eb" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

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