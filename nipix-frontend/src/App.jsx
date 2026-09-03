import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { logout } from './store/slices/authSlice';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';
import api from './services/api';
import { Sparkles, X, Image as ImageIcon } from 'lucide-react';
import './App.css';

axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function AppContent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.defaults.headers.common['x-auth-token'] = token;
    }
  }, [token]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!imageFile && !caption) return;
    setIsPublishing(true);

    try {
      const formData = new FormData();
      if (imageFile) formData.append('image', imageFile);
      formData.append('caption', caption);

      await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setShowCreateModal(false);
      setCaption('');
      setImageFile(null);
      setPreviewUrl('');
      window.dispatchEvent(new Event('postCreated'));
    } catch (err) {
      console.error('Failed to create post:', err);
      alert(err.response?.data?.message || err.response?.data?.error || 'Failed to create post');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="app-container" style={{ background: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-main)' }}>
      {user && (
        <>
          <Navbar currentUser={user} onOpenCreate={() => setShowCreateModal(true)} />
          <Sidebar
            currentUser={user}
            onLogout={handleLogout}
            onOpenCreate={() => setShowCreateModal(true)}
          />
        </>
      )}

      <main className={user ? "main-content" : ""} style={{ flex: 1, minHeight: '100vh', width: '100%' }}>
        <AppRoutes />
      </main>

      {/* Quick Create Post Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
                <Sparkles size={20} color="var(--accent-blue)" /> Create New Post
              </h3>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleCreatePost}>
              {previewUrl ? (
                <div style={{ position: 'relative', marginBottom: '16px', borderRadius: '12px', overflow: 'hidden', maxHeight: '280px', background: '#000' }}>
                  <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  <button
                    type="button"
                    onClick={() => { setPreviewUrl(''); setImageFile(null); }}
                    style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', borderRadius: '50%', padding: '6px', cursor: 'pointer' }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '36px 16px', border: '2px dashed var(--border-color)', borderRadius: '12px', cursor: 'pointer', marginBottom: '16px', background: 'rgba(255,255,255,0.02)' }}>
                  <ImageIcon size={40} color="var(--accent-blue)" style={{ marginBottom: '10px' }} />
                  <span style={{ fontWeight: '600', fontSize: '0.95rem', color: '#fff' }}>Select photo or video</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>PNG, JPG, MP4 supported</span>
                  <input type="file" accept="image/*,video/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </label>
              )}

              <textarea
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="input-field"
                rows={4}
                style={{ resize: 'none', marginBottom: '16px', borderRadius: '12px' }}
              />

              <div style={{ display: 'flex', justifySelf: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={isPublishing || (!imageFile && !caption)} className="btn-primary" style={{ opacity: isPublishing || (!imageFile && !caption) ? 0.6 : 1 }}>
                  {isPublishing ? 'Publishing...' : 'Share Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
