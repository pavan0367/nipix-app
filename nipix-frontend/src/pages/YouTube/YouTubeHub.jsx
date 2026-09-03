import React, { useState } from 'react';
import {
  Film,
  Play,
  Clock,
  User,
  BookOpen,
  Edit3,
  Check,
  Download,
  Share2,
  X
} from 'lucide-react';

const LECTURE_PLAYLISTS = [
  'All Lectures',
  'CS & Algorithms',
  'Mathematics & Physics',
  'AI & Machine Learning',
  'System Architecture'
];

const VIDEO_LECTURES = [
  {
    id: 'fNKuz4kg51g',
    title: 'Introduction to Algorithms & Data Structures (MIT 6.006)',
    channel: 'MIT OpenCourseWare',
    category: 'CS & Algorithms',
    duration: '48:12',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    description: 'Fundamental analysis of asymptotic notation, divide and conquer paradigms, and peak finding algorithms in 1D and 2D arrays.'
  },
  {
    id: 'aircAruvnKk',
    title: 'Neural Networks & Deep Learning: Visual Mathematics',
    channel: '3Blue1Brown',
    category: 'AI & Machine Learning',
    duration: '19:13',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
    description: 'Geometric interpretation of multi-dimensional vector space transformations, weights, biases, and gradient descent backpropagation.'
  },
  {
    id: 'IHZwWFHWa-w',
    title: 'Essence of Linear Algebra: Vectors, Span & Bases',
    channel: '3Blue1Brown',
    category: 'Mathematics & Physics',
    duration: '14:26',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    description: 'Visualizing linear combinations, vector subspaces, matrix multiplication as space transformations, and determinant significance.'
  },
  {
    id: 'Y6Ev8GKDgcs',
    title: 'Harvard CS50: Memory, Pointers, and Dynamic Allocation in C',
    channel: 'CS50 / Harvard University',
    category: 'CS & Algorithms',
    duration: '1:52:04',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    description: 'Deep dive into stack vs heap memory management, pointer arithmetic, buffer overflows, and valgrind memory leak debugging.'
  },
  {
    id: 'bZ6h_4A8x7Q',
    title: 'System Design Interview: Distributed Cache Architecture',
    channel: 'ByteByteGo',
    category: 'System Architecture',
    duration: '22:45',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    description: 'Designing resilient distributed caching tiers with consistent hashing, LRU eviction policies, cache-aside, and replication consistency.'
  }
];

const YouTubeHub = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Lectures');
  const [activeVideo, setActiveVideo] = useState(VIDEO_LECTURES[0]);
  const [studyNotes, setStudyNotes] = useState('');
  const [savedNotePrompt, setSavedNotePrompt] = useState(false);

  const filteredVideos = VIDEO_LECTURES.filter(v =>
    selectedCategory === 'All Lectures' || v.category === selectedCategory
  );

  const handleSaveNotes = () => {
    localStorage.setItem(`nipix_notes_${activeVideo.id}`, studyNotes);
    setSavedNotePrompt(true);
    setTimeout(() => setSavedNotePrompt(false), 2500);
  };

  return (
    <div className="page-theme-youtube" style={{ minHeight: '100vh', padding: '30px 20px' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        
        {/* Hub Header */}
        <div className="glass-card" style={{ padding: '24px', marginBottom: '24px', borderLeft: '4px solid var(--accent-rose)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(244, 63, 94, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Film size={24} color="#f43f5e" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Interactive Video Lecture Studio
              </h1>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                Stream top university lectures and tutorials in-app with built-in side note-taking.
              </p>
            </div>
          </div>
        </div>

        {/* Video Theatre & Side Notepad Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }} className="theatre-layout">
          
          {/* Main Embedded Player */}
          <div className="glass-card" style={{ padding: '16px', overflow: 'hidden' }}>
            <div style={{
              position: 'relative',
              width: '100%',
              paddingTop: '56.25%', // 16:9 Aspect Ratio
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              background: '#000',
              marginBottom: '16px'
            }}>
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}?rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 0
                }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', padding: '3px 10px', borderRadius: '12px', fontWeight: '700' }}>
                  {activeVideo.category}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> {activeVideo.duration}
                </span>
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>
                {activeVideo.title}
              </h2>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-dim)', margin: '0 0 12px 0' }}>
                Channel: <strong style={{ color: 'var(--text-main)' }}>{activeVideo.channel}</strong>
              </p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                {activeVideo.description}
              </p>
            </div>
          </div>

          {/* Quick Study Notepad */}
          <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Edit3 size={16} color="var(--accent-cyan)" /> Lecture Notepad
              </span>
              {savedNotePrompt && (
                <span style={{ fontSize: '0.74rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Check size={12} /> Saved
                </span>
              )}
            </div>

            <textarea
              placeholder="Take instant notes, timestamps, or summary points while watching this lecture..."
              value={studyNotes}
              onChange={(e) => setStudyNotes(e.target.value)}
              className="input-field"
              style={{
                flex: 1,
                minHeight: '220px',
                resize: 'none',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.82rem',
                lineHeight: '1.5',
                marginBottom: '12px'
              }}
            />

            <button
              onClick={handleSaveNotes}
              className="btn-primary"
              style={{ width: '100%', fontSize: '0.82rem' }}
            >
              Save Lecture Notes
            </button>
          </div>

        </div>

        {/* Playlist Selector Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fff', margin: 0 }}>
            Curated Academic Playlist
          </h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {LECTURE_PLAYLISTS.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                style={{ fontSize: '0.78rem', padding: '5px 12px' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Video Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' }}>
          {filteredVideos.map(vid => (
            <div
              key={vid.id}
              onClick={() => setActiveVideo(vid)}
              className={`glass-card glass-card-interactive ${activeVideo.id === vid.id ? 'active' : ''}`}
              style={{
                overflow: 'hidden',
                cursor: 'pointer',
                borderColor: activeVideo.id === vid.id ? 'var(--accent-rose)' : 'var(--glass-border)'
              }}
            >
              <div style={{ position: 'relative', height: '140px', overflow: 'hidden' }}>
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '8px',
                  background: 'rgba(0,0,0,0.85)',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  color: '#fff',
                  fontWeight: '700'
                }}>
                  {vid.duration}
                </div>
              </div>
              <div style={{ padding: '14px' }}>
                <p style={{ fontSize: '0.76rem', color: '#fb7185', fontWeight: '700', margin: '0 0 4px 0' }}>
                  {vid.category}
                </p>
                <h4 style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-main)', margin: '0 0 6px 0', lineHeight: '1.4' }}>
                  {vid.title}
                </h4>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>
                  {vid.channel}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default YouTubeHub;
