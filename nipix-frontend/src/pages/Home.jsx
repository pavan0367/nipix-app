import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  BookOpen,
  Newspaper,
  Film,
  MessageSquare,
  ArrowRight,
  Flame,
  CheckCircle2,
  Clock,
  PlayCircle,
  Calendar,
  Layers,
  HelpCircle,
  FileCode,
  Languages,
  Terminal,
  BrainCircuit,
  TrendingUp,
  AlertCircle,
  Zap,
  Video,
  GraduationCap
} from 'lucide-react';
import NipixLogo from '../components/NipixLogo';
import useLearningProgress from '../hooks/useLearningProgress';
import { COURSES, getCourseActivityCount } from '../data/courses/coursesData';

const Home = () => {
  const currentUser = useSelector((state) => state.auth?.user);
  const navigate = useNavigate();
  const [quickAiPrompt, setQuickAiPrompt] = useState('');
  const videoRef = useRef(null);

  // Dynamic Learning Progress & Real Completion Stats
  const {
    streak,
    earnedPoints,
    completedToday,
    getCourseProgress,
    getJapaneseStats,
    getGlobalProgress
  } = useLearningProgress();

  const jpStats = getJapaneseStats();
  const jpProg = jpStats?.jlpt?.pct || 0;
  const globalProgress = getGlobalProgress(120);

  // Real progress for featured modules (genuine 0% for new user!)
  const dsaCourse = COURSES.find(c => c.id === 'cs-dsa');
  const dsaProg = getCourseProgress('cs-dsa', getCourseActivityCount(dsaCourse));

  const pyCourse = COURSES.find(c => c.id === 'cs-python');
  const pyProg = getCourseProgress('cs-python', getCourseActivityCount(pyCourse));

  const eeCourse = COURSES.find(c => c.id === 'ee-digital');
  const eeProg = getCourseProgress('ee-digital', getCourseActivityCount(eeCourse));

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.volume = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay policy prevented playback silently without breaking UI
        });
      }
    }
  }, []);

  const handleAiPromptSubmit = (e) => {
    e.preventDefault();
    if (!quickAiPrompt.trim()) return;
    navigate('/chat');
  };

  return (
    <div className="page-theme-home" style={{ minHeight: '100vh', padding: '30px 20px' }}>
      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>

        {/* ========================================================== */}
        {/* 1. WELCOME HERO / AI SCHOLAR BANNER (PRESERVED 100%)       */}
        {/* ========================================================== */}
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
              <NipixLogo size={16} style={{ borderRadius: '4px' }} /> ✦ AI STUDY CO-PILOT ACTIVE ●
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

      {/* ========================================================== */}
      {/* 2. DASHBOARD STATS & QUICK NAV ROW (PRESERVED 100%)        */}
      {/* ========================================================== */}
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

      {/* ========================================================== */}
      {/* 3. HIGHLIGHTED STUDY TRACKS & RIGHT-SIDE COLUMN            */}
      {/* ========================================================== */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }} className="theatre-layout">

        {/* Left Column: Recommended Study Modules (PRESERVED 100%) */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color="var(--accent-cyan)" /> Recommended Study Modules
            </h2>
            <Link to="/study" style={{ fontSize: '0.82rem', color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: '600' }}>
              View All
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'space-between' }}>
            <div className="glass-card glass-card-interactive" style={{ padding: '20px' }}>
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

            <div className="glass-card glass-card-interactive" style={{ padding: '20px' }}>
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

        {/* Right Column: Introduction Video (Above) & Daily Learning Streak (Below) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Top: Introduction Video Card */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Video size={18} color="var(--accent-blue)" /> Welcome to Nipix
              </h2>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(59, 130, 246, 0.12)',
                color: 'var(--accent-blue)',
                fontSize: '0.72rem',
                fontWeight: '700',
                border: '1px solid rgba(59, 130, 246, 0.25)'
              }}>
                ✦ PLATFORM INTRO
              </div>
            </div>

            <div className="glass-card" style={{
              padding: '16px 20px',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxSizing: 'border-box'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '1.02rem', fontWeight: '700', color: 'var(--text-main)', margin: '0 0 2px 0' }}>
                    Welcome to Nipix
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                    A quick introduction to your AI-powered study platform
                  </p>
                </div>
                <Link to="/chat" className="btn-secondary" style={{ padding: '5px 12px', fontSize: '0.76rem', gap: '5px', flexShrink: 0 }}>
                  <Sparkles size={12} color="var(--accent-cyan)" /> Ask AI
                </Link>
              </div>

              {/* Compact Video Player Container (Height constrained to match Streak card) */}
              <div style={{
                position: 'relative',
                width: '100%',
                height: '155px',
                borderRadius: '10px',
                overflow: 'hidden',
                background: '#0a0c14',
                border: '1px solid var(--border-color)',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <video
                  ref={videoRef}
                  src="/intro.mp4"
                  autoPlay
                  muted
                  playsInline
                  loop
                  controlsList="nodownload"
                  disablePictureInPicture
                  disableRemotePlayback
                  onContextMenu={(e) => e.preventDefault()}
                  onVolumeChange={(e) => {
                    if (e.target.muted !== true || e.target.volume > 0) {
                      e.target.muted = true;
                      e.target.volume = 0;
                    }
                  }}
                  className="intro-video-clean"
                  preload="auto"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                    background: '#0a0c14'
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>

          {/* Bottom: Scholar Progress & Daily Learning Streak */}
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={18} color="#f59e0b" /> Daily Learning Streak
            </h2>

            <div className="glass-card" style={{
              padding: '20px',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxSizing: 'border-box'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <span style={{ fontSize: '1.9rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {streak === 1 ? '1 Day' : `${streak} Days`}
                  </span>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                    {streak > 0 ? 'Keep the momentum going!' : 'Start a lesson to begin your streak!'}
                  </p>
                </div>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: streak > 0 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Flame size={22} color={streak > 0 ? '#f59e0b' : 'var(--text-dim)'} />
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: '700', color: '#cbd5e1' }}>
                    Today's Milestones:
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-amber)', fontWeight: '700' }}>
                    {earnedPoints} Points Earned
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: completedToday > 0 ? '#34d399' : 'var(--text-dim)', marginBottom: '4px' }}>
                  <CheckCircle2 size={13} color={completedToday > 0 ? '#34d399' : 'var(--text-dim)'} />
                  <span>{completedToday} {completedToday === 1 ? 'Activity' : 'Activities'} Completed Today</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  <Clock size={13} /> Overall Learning Progress: {globalProgress}%
                </div>
              </div>

              <Link to="/study" className="btn-primary" style={{ width: '100%', fontSize: '0.82rem', padding: '10px' }}>
                {streak > 0 ? 'Continue Learning Track' : 'Start Learning Track'}
              </Link>
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================== */}
      {/* 5. EXPANDED: CONTINUE LEARNING                             */}
      {/* ========================================================== */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PlayCircle size={20} color="var(--accent-blue)" /> Continue Learning
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', margin: 0 }}>
              Pick up where you left off across your active courses and modules
            </p>
          </div>
          <Link to="/study" style={{ fontSize: '0.82rem', color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: '600' }}>
            All Modules →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {/* Module 1 */}
          <div className="glass-card glass-card-interactive" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--accent-cyan)', background: 'rgba(0, 242, 254, 0.1)', padding: '3px 8px', borderRadius: '4px' }}>
                  DATA STRUCTURES
                </span>
                <span style={{ fontSize: '0.84rem', fontWeight: '800', color: dsaProg > 0 ? '#10b981' : 'var(--text-dim)' }}>{dsaProg}%</span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)', margin: '0 0 6px 0' }}>
                Binary Search Trees & Heaps
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 14px 0', lineHeight: 1.5 }}>
                Balanced trees, red-black rotations, and heap priority queue operations.
              </p>
            </div>
            <div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '99px', overflow: 'hidden', marginBottom: '14px' }}>
                <div style={{ width: `${dsaProg}%`, height: '100%', background: dsaProg > 0 ? 'linear-gradient(90deg, #00f2fe, #4facfe)' : 'transparent', borderRadius: '99px' }} />
              </div>
              <Link to="/study" className="btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '8px 12px' }}>
                {dsaProg > 0 ? 'Continue' : 'Start Course'} <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Module 2 */}
          <div className="glass-card glass-card-interactive" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#ec4899', background: 'rgba(236, 72, 153, 0.1)', padding: '3px 8px', borderRadius: '4px' }}>
                  JAPANESE JLPT N5
                </span>
                <span style={{ fontSize: '0.84rem', fontWeight: '800', color: jpProg > 0 ? '#10b981' : 'var(--text-dim)' }}>{jpProg}%</span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)', margin: '0 0 6px 0' }}>
                Particle Usage & Te-Form Verbs
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 14px 0', lineHeight: 1.5 }}>
                Particles は, が, を, に, で plus verb conjugations for daily conversations.
              </p>
            </div>
            <div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '99px', overflow: 'hidden', marginBottom: '14px' }}>
                <div style={{ width: `${jpProg}%`, height: '100%', background: jpProg > 0 ? 'linear-gradient(90deg, #ec4899, #f43f5e)' : 'transparent', borderRadius: '99px' }} />
              </div>
              <Link to="/study/japanese" className="btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '8px 12px' }}>
                {jpProg > 0 ? 'Continue' : 'Start Course'} <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Module 3 */}
          <div className="glass-card glass-card-interactive" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '3px 8px', borderRadius: '4px' }}>
                  DIGITAL ELECTRONICS
                </span>
                <span style={{ fontSize: '0.84rem', fontWeight: '800', color: eeProg > 0 ? '#10b981' : 'var(--text-dim)' }}>{eeProg}%</span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)', margin: '0 0 6px 0' }}>
                Combinational Logic & Multiplexers
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 14px 0', lineHeight: 1.5 }}>
                Karnaugh maps simplification, decoders, encoders, and ALU circuit design.
              </p>
            </div>
            <div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '99px', overflow: 'hidden', marginBottom: '14px' }}>
                <div style={{ width: `${eeProg}%`, height: '100%', background: eeProg > 0 ? 'linear-gradient(90deg, #f59e0b, #d97706)' : 'transparent', borderRadius: '99px' }} />
              </div>
              <Link to="/study" className="btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '8px 12px' }}>
                {eeProg > 0 ? 'Continue' : 'Start Course'} <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Module 4 */}
          <div className="glass-card glass-card-interactive" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '3px 8px', borderRadius: '4px' }}>
                  PYTHON PROGRAMMING
                </span>
                <span style={{ fontSize: '0.84rem', fontWeight: '800', color: pyProg > 0 ? '#10b981' : 'var(--text-dim)' }}>{pyProg}%</span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)', margin: '0 0 6px 0' }}>
                Decorators & Asyncio Pipelines
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 14px 0', lineHeight: 1.5 }}>
                Advanced closures, async event loops, generators, and coroutine patterns.
              </p>
            </div>
            <div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '99px', overflow: 'hidden', marginBottom: '14px' }}>
                <div style={{ width: `${pyProg}%`, height: '100%', background: pyProg > 0 ? 'linear-gradient(90deg, #10b981, #059669)' : 'transparent', borderRadius: '99px' }} />
              </div>
              <Link to="/study" className="btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '8px 12px' }}>
                {pyProg > 0 ? 'Continue' : 'Start Course'} <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 6. EXPANDED: TODAY'S STUDY PLAN TIMELINE                   */}
      {/* ========================================================== */}
      <div className="glass-card" style={{
        padding: '26px',
        marginBottom: '32px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={20} color="var(--accent-purple)" /> Today's Study Plan
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', margin: 0 }}>
              Structured daily agenda designed for deep focus and balanced retention
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.76rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontWeight: '700' }}>
              {Math.min(completedToday, 5)} Completed
            </span>
            <span style={{ fontSize: '0.76rem', color: 'var(--accent-cyan)', background: 'rgba(0, 242, 254, 0.1)', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontWeight: '700' }}>
              {Math.min(completedToday, 5) < 5 ? (completedToday > 0 ? '1 In Progress' : '1 Ready') : 'All Done'}
            </span>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)', background: 'rgba(255, 255, 255, 0.05)', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontWeight: '700' }}>
              {Math.max(0, 5 - Math.min(completedToday, 5) - (Math.min(completedToday, 5) < 5 ? 1 : 0))} Upcoming
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            {
              time: '08:30 - 09:30 AM',
              duration: '60 min',
              title: "Morning Study: Multivariable Calculus & Green's Theorem"
            },
            {
              time: '10:30 - 11:45 AM',
              duration: '75 min',
              title: 'Programming Practice: LeetCode Graph Traversal & BFS/DFS'
            },
            {
              time: '02:00 - 02:45 PM',
              duration: '45 min',
              title: 'Japanese Vocabulary: JLPT N5 Kanji & Essential Vocabulary'
            },
            {
              time: '04:30 - 05:15 PM',
              duration: '45 min',
              title: 'Technical Reading: Transformer Attention Architecture Paper'
            },
            {
              time: '07:00 - 07:30 PM',
              duration: '30 min',
              title: 'AI Revision: Dynamic Programming Co-Pilot Problem Drill'
            }
          ].map((item, idx) => {
            const planDone = Math.min(completedToday, 5);
            const isCompleted = idx < planDone;
            const isActive = idx === planDone;
            const activeLabel = completedToday > 0 ? 'Active Now' : 'Ready to Start';

            const containerBg = isCompleted
              ? 'rgba(16, 185, 129, 0.06)'
              : isActive
              ? 'rgba(0, 242, 254, 0.06)'
              : 'rgba(255, 255, 255, 0.02)';

            const containerBorder = isCompleted
              ? '1px solid rgba(16, 185, 129, 0.2)'
              : isActive
              ? '1px solid rgba(0, 242, 254, 0.25)'
              : '1px solid var(--border-color)';

            const iconBg = isCompleted
              ? 'rgba(16, 185, 129, 0.2)'
              : isActive
              ? 'rgba(0, 242, 254, 0.15)'
              : idx === 4
              ? 'rgba(124, 58, 237, 0.1)'
              : 'rgba(255, 255, 255, 0.05)';

            const iconColor = isCompleted
              ? '#10b981'
              : isActive
              ? 'var(--accent-cyan)'
              : idx === 4
              ? 'var(--accent-purple)'
              : 'var(--text-dim)';

            const timeColor = isCompleted
              ? '#10b981'
              : isActive
              ? 'var(--accent-cyan)'
              : idx === 4
              ? 'var(--accent-purple)'
              : 'var(--text-dim)';

            const badgeColor = isCompleted
              ? '#10b981'
              : isActive
              ? 'var(--accent-cyan)'
              : 'var(--text-dim)';

            const badgeBg = isCompleted
              ? 'rgba(16, 185, 129, 0.15)'
              : isActive
              ? 'rgba(0, 242, 254, 0.15)'
              : 'rgba(255, 255, 255, 0.04)';

            const badgeText = isCompleted
              ? 'Completed'
              : isActive
              ? activeLabel
              : 'Upcoming';

            return (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderRadius: 'var(--radius-sm)',
                background: containerBg,
                border: containerBorder,
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconColor }}>
                    {isCompleted ? (
                      <CheckCircle2 size={18} />
                    ) : isActive ? (
                      <div className="pulse-dot" style={{ position: 'static', margin: 0 }} />
                    ) : idx === 4 ? (
                      <Sparkles size={16} />
                    ) : (
                      <Clock size={16} />
                    )}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: timeColor }}>{item.time}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>• {item.duration}</span>
                    </div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: isCompleted || isActive ? '700' : '600', color: 'var(--text-main)', margin: '2px 0 0 0' }}>
                      {item.title}
                    </h4>
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: isCompleted || isActive ? '700' : '600', color: badgeColor, background: badgeBg, padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                  {badgeText}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================== */}
      {/* 7. EXPANDED: QUICK LEARNING TOOLS HUB                      */}
      {/* ========================================================== */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={20} color="#f59e0b" /> Quick Learning
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', margin: 0 }}>
              High-yield interactive exercises and micro-learning modules
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px' }}>
          {/* Card 1: Flashcards */}
          <Link to="/study" className="glass-card glass-card-interactive" style={{ padding: '18px 14px', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '10px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={20} color="var(--accent-blue)" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-main)', margin: '0 0 3px 0' }}>Flashcards</h4>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', margin: 0 }}>25 Due Today</p>
            </div>
          </Link>

          {/* Card 2: Daily Quiz */}
          <Link to="/study" className="glass-card glass-card-interactive" style={{ padding: '18px 14px', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '10px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HelpCircle size={20} color="#10b981" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-main)', margin: '0 0 3px 0' }}>Daily Quiz</h4>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', margin: 0 }}>5 Questions</p>
            </div>
          </Link>

          {/* Card 3: Practice Questions */}
          <Link to="/study" className="glass-card glass-card-interactive" style={{ padding: '18px 14px', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '10px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileCode size={20} color="#f59e0b" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-main)', margin: '0 0 3px 0' }}>Practice Questions</h4>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', margin: 0 }}>12 Scenarios</p>
            </div>
          </Link>

          {/* Card 4: Japanese Vocabulary */}
          <Link to="/study" className="glass-card glass-card-interactive" style={{ padding: '18px 14px', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '10px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Languages size={20} color="#ec4899" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-main)', margin: '0 0 3px 0' }}>Japanese Vocab</h4>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', margin: 0 }}>10 Words</p>
            </div>
          </Link>

          {/* Card 5: Coding Challenge */}
          <Link to="/study" className="glass-card glass-card-interactive" style={{ padding: '18px 14px', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '10px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(0, 242, 254, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Terminal size={20} color="var(--accent-cyan)" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-main)', margin: '0 0 3px 0' }}>Coding Challenge</h4>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', margin: 0 }}>Two Pointers</p>
            </div>
          </Link>

          {/* Card 6: AI Explanation */}
          <Link to="/chat" className="glass-card glass-card-interactive" style={{ padding: '18px 14px', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '10px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(124, 58, 237, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={20} color="var(--accent-purple)" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-main)', margin: '0 0 3px 0' }}>AI Explanation</h4>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', margin: 0 }}>Ask Anything</p>
            </div>
          </Link>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 8. EXPANDED: LATEST LEARNING RESOURCES                     */}
      {/* ========================================================== */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={20} color="var(--accent-cyan)" /> Latest Learning Resources
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', margin: 0 }}>
              Peer-reviewed study guides, technical papers, and curated cheat sheets
            </p>
          </div>
          <Link to="/study" style={{ fontSize: '0.82rem', color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: '600' }}>
            Explore Library →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {/* Resource 1 */}
          <div className="glass-card glass-card-interactive" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--accent-blue)' }}>PHYSICS & CS</span>
                <span style={{ fontSize: '0.72rem', fontWeight: '600', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>Intermediate</span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)', margin: '0 0 8px 0' }}>
                Quantum Computing Foundations
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                Qubits, superposition, Bloch sphere representation, and Quantum teleportation protocols with state vectors.
              </p>
            </div>
            <Link to="/study" className="btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '8px 12px' }}>
              Open Resource <ArrowRight size={13} />
            </Link>
          </div>

          {/* Resource 2 */}
          <div className="glass-card glass-card-interactive" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#10b981' }}>SOFTWARE ENG</span>
                <span style={{ fontSize: '0.72rem', fontWeight: '600', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>Advanced</span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)', margin: '0 0 8px 0' }}>
                Full-Stack Web API Design
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                Idempotency, JWT token rotation, distributed rate-limiting, and GraphQL vs REST architectural tradeoffs.
              </p>
            </div>
            <Link to="/study" className="btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '8px 12px' }}>
              Open Resource <ArrowRight size={13} />
            </Link>
          </div>

          {/* Resource 3 */}
          <div className="glass-card glass-card-interactive" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#ec4899' }}>JAPANESE N3/N4</span>
                <span style={{ fontSize: '0.72rem', fontWeight: '600', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>Intermediate</span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)', margin: '0 0 8px 0' }}>
                Japanese Honorifics (Keigo)
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                Master Sonkeigo, Kenjougo, and Teineigo for formal academic and professional business dialogues.
              </p>
            </div>
            <Link to="/study" className="btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '8px 12px' }}>
              Open Resource <ArrowRight size={13} />
            </Link>
          </div>

          {/* Resource 4 */}
          <div className="glass-card glass-card-interactive" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#f59e0b' }}>ELECTROMAGNETISM</span>
                <span style={{ fontSize: '0.72rem', fontWeight: '600', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>Beginner</span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)', margin: '0 0 8px 0' }}>
                Maxwell's Equations Visualized
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                Intuitive geometric representations of divergence, curl, Gauss's law, and Faraday's electromagnetic induction.
              </p>
            </div>
            <Link to="/study" className="btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '8px 12px' }}>
              Open Resource <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 9. EXPANDED: JAPANESE LEARNING PROGRESS                    */}
      {/* ========================================================== */}
      <div className="glass-card" style={{
        padding: '26px',
        marginBottom: '32px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(236, 72, 153, 0.1)',
              color: '#ec4899',
              fontSize: '0.72rem',
              fontWeight: '700',
              marginBottom: '6px'
            }}>
              🌸 LANGUAGE ACQUISITION
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Languages size={20} color="#ec4899" /> Japanese Learning Progress
            </h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ec4899' }}>
              JLPT N5: {jpStats.jlpt.count > 0 ? `${jpStats.jlpt.pct}%` : 'Not Started'}
            </span>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-dim)', margin: 0 }}>
              Overall Japanese: {jpStats.overallPct}%
            </p>
          </div>
        </div>

        {/* Progress Breakdown Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>Hiragana</span>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: jpStats.hiragana.pct > 0 ? '#10b981' : 'var(--text-dim)' }}>{jpStats.hiragana.pct}%</span>
            </div>
            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{ width: `${jpStats.hiragana.pct}%`, height: '100%', background: jpStats.hiragana.pct > 0 ? '#10b981' : 'transparent' }} />
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>{jpStats.hiragana.count}/{jpStats.hiragana.total} Mastered</span>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>Katakana</span>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: jpStats.katakana.pct > 0 ? '#10b981' : 'var(--text-dim)' }}>{jpStats.katakana.pct}%</span>
            </div>
            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{ width: `${jpStats.katakana.pct}%`, height: '100%', background: jpStats.katakana.pct > 0 ? '#10b981' : 'transparent' }} />
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>{jpStats.katakana.count}/{jpStats.katakana.total} Mastered</span>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>Kanji</span>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: jpStats.kanji.pct > 0 ? 'var(--accent-cyan)' : 'var(--text-dim)' }}>{jpStats.kanji.pct}%</span>
            </div>
            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{ width: `${jpStats.kanji.pct}%`, height: '100%', background: jpStats.kanji.pct > 0 ? 'var(--accent-cyan)' : 'transparent' }} />
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>{jpStats.kanji.count}/{jpStats.kanji.total} Characters</span>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>Vocabulary</span>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: jpStats.vocab.pct > 0 ? 'var(--accent-purple)' : 'var(--text-dim)' }}>{jpStats.vocab.pct}%</span>
            </div>
            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{ width: `${jpStats.vocab.pct}%`, height: '100%', background: jpStats.vocab.pct > 0 ? 'var(--accent-purple)' : 'transparent' }} />
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>{jpStats.vocab.count}/{jpStats.vocab.total} Words</span>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>Grammar</span>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: jpStats.grammar.pct > 0 ? '#f59e0b' : 'var(--text-dim)' }}>{jpStats.grammar.pct}%</span>
            </div>
            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{ width: `${jpStats.grammar.pct}%`, height: '100%', background: jpStats.grammar.pct > 0 ? '#f59e0b' : 'transparent' }} />
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>{jpStats.grammar.count}/{jpStats.grammar.total} Patterns</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/study" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.82rem', gap: '6px' }}>
            <BookOpen size={14} /> Open Japanese Study Hub
          </Link>
          <Link to="/chat" className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.82rem', gap: '6px' }}>
            <Sparkles size={14} color="#ec4899" /> Practice with Sakura AI 🌸
          </Link>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 10. EXPANDED: AI STUDY INSIGHTS & RECOMMENDATIONS          */}
      {/* ========================================================== */}
      <div className="glass-card" style={{
        padding: '26px',
        marginBottom: '20px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(124, 58, 237, 0.12)',
              color: 'var(--accent-purple)',
              fontSize: '0.72rem',
              fontWeight: '700',
              marginBottom: '6px'
            }}>
              ✦ ADAPTIVE INTELLIGENCE
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BrainCircuit size={20} color="var(--accent-purple)" /> AI Study Insights
            </h2>
          </div>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)', background: 'rgba(255, 255, 255, 0.05)', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
            Updated 12m ago
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '14px', marginBottom: '18px' }}>
          <div style={{ background: 'rgba(244, 63, 94, 0.06)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f43f5e', marginBottom: '6px' }}>
              <AlertCircle size={16} />
              <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>Weak Topics</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              Binary Search Tree rotations & Dynamic Programming memoization state transitions show lower quiz accuracy (54%).
            </p>
          </div>

          <div style={{ background: 'rgba(245, 158, 11, 0.06)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', marginBottom: '6px' }}>
              <Clock size={16} />
              <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>Recommended Revision</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              Review 15 minutes of Japanese Te-Form conjugations before advancing to JLPT N5 listening drills.
            </p>
          </div>

          <div style={{ background: 'rgba(0, 242, 254, 0.06)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', marginBottom: '6px' }}>
              <Flame size={16} />
              <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>Today's Focus</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              Tackle Graph Traversal (BFS/DFS) coding questions to maintain your 5-day streak momentum.
            </p>
          </div>

          <div style={{ background: 'rgba(124, 58, 237, 0.06)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-purple)', marginBottom: '6px' }}>
              <Sparkles size={16} />
              <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>Suggested Practice</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              Ask ByteBot AI to quiz you on time and space complexity of balancing AVL trees.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link to="/chat" className="btn-primary" style={{ padding: '9px 24px', fontSize: '0.84rem', gap: '8px', borderRadius: 'var(--radius-full)' }}>
            <Sparkles size={15} /> Discuss Insights with AI Co-Pilot ✦
          </Link>
        </div>
      </div>

    </div>
    </div >
  );
};

export default Home;