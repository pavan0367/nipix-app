import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Sparkles, Image as ImageIcon, MapPin, Hash, X } from 'lucide-react';

const CreatePost = () => {
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile && !caption) return;
    setLoading(true);

    try {
      const formData = new FormData();
      if (imageFile) formData.append('image', imageFile);
      formData.append('caption', caption);
      if (location) formData.append('location', location);

      await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      window.dispatchEvent(new Event('postCreated'));
      navigate('/home');
    } catch (err) {
      console.error('Failed to create post:', err);
      alert(err.response?.data?.message || err.response?.data?.error || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '30px auto', padding: '0 16px' }}>
      <div className="glass-card" style={{ padding: '32px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#fff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={22} color="var(--accent-blue)" /> Create New Post
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {previewUrl ? (
            <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', maxHeight: '360px', background: '#000', textAlign: 'center' }}>
              <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              <button
                type="button"
                onClick={() => { setPreviewUrl(''); setImageFile(null); }}
                style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', borderRadius: '50%', padding: '6px', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', border: '2px dashed var(--border-color)', borderRadius: '16px', cursor: 'pointer', background: 'rgba(255,255,255,0.02)' }}>
              <ImageIcon size={48} color="var(--accent-blue)" style={{ marginBottom: '12px' }} />
              <span style={{ fontWeight: '700', fontSize: '1rem', color: '#fff' }}>Select a photo or video</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>PNG, JPG, WEBP, or MP4 supported</span>
              <input type="file" accept="image/*,video/*" onChange={handleFileChange} style={{ display: 'none' }} />
            </label>
          )}

          <div>
            <textarea
              placeholder="Write a caption... (use #hashtags to increase reach)"
              value={caption}
              onChange={e => setCaption(e.target.value)}
              className="input-field"
              rows={4}
              style={{ resize: 'none', borderRadius: '12px' }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <MapPin size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Add location (e.g., Paris, France)"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '42px', borderRadius: '12px' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <button type="button" onClick={() => navigate('/home')} className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (!imageFile && !caption)}
              className="btn-primary"
              style={{ opacity: loading || (!imageFile && !caption) ? 0.6 : 1 }}
            >
              {loading ? 'Sharing...' : 'Share Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
