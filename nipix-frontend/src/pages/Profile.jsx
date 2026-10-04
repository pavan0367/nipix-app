import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, followUser } from '../store/slices/userSlice';
import { setUser } from '../store/slices/authSlice';
import api from '../services/api';
import { User, Grid, Bookmark, Heart, Settings, UserPlus, UserCheck, Image as ImageIcon, X, Camera, Sparkles, Check, AlertCircle } from 'lucide-react';
import NipixLogo from '../components/NipixLogo';

const Profile = ({ currentUser: propCurrentUser }) => {
  const { username, id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile: reduxProfile, loading: reduxLoading } = useSelector((state) => state.user || {});
  const stateAuthUser = useSelector((state) => state.auth?.user);
  const currentUser = propCurrentUser || stateAuthUser;

  const [activeTab, setActiveTab] = useState('posts');
  const [userPosts, setUserPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [localProfile, setLocalProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  // Edit Profile Modal States
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    full_name: '',
    username: '',
    bio: '',
    profile_image: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const fileInputRef = useRef(null);

  const targetIdentifier = username || id || currentUser?.username || currentUser?.id;

  useEffect(() => {
    if (!targetIdentifier) return;

    const loadProfileData = async () => {
      try {
        if (id) {
          dispatch(fetchProfile(id));
        } else {
          // Fetch profile by username or current user
          const res = await api.get(`/users/${targetIdentifier}`);
          setLocalProfile(res.data?.user || res.data);
          setIsFollowing(res.data?.user?.isFollowing || false);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        // Fallback to current user if matching
        if (currentUser && (currentUser.username === targetIdentifier || currentUser.id === targetIdentifier)) {
          setLocalProfile(currentUser);
        }
      }
    };

    loadProfileData();
  }, [dispatch, targetIdentifier, id, currentUser]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      setLoadingPosts(true);
      try {
        const res = await api.get('/posts/feed');
        const allPosts = Array.isArray(res.data) ? res.data : (res.data?.feed || []);
        // Filter posts owned by this user profile
        const filtered = allPosts.filter(post => {
          const author = post.userId || post.user;
          const authorName = author?.username || author?.name;
          const authorId = author?._id || author?.id;
          return authorName === targetIdentifier || authorId === targetIdentifier || (displayUser && (authorName === displayUser.username || authorId === displayUser.id));
        });
        setUserPosts(filtered);
      } catch (err) {
        console.error('Failed to load user posts:', err);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchUserPosts();
  }, [targetIdentifier]);

  const displayUser = localProfile || reduxProfile || (currentUser?.username === targetIdentifier ? currentUser : null);

  const handleFollowToggle = async () => {
    if (!displayUser) return;
    try {
      const targetId = displayUser.id || displayUser._id;
      if (targetId) {
        dispatch(followUser(targetId));
      }
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error('Follow toggle error:', err);
    }
  };

  const handleOpenEditModal = () => {
    setEditFormData({
      full_name: displayUser?.full_name || displayUser?.name || '',
      username: displayUser?.username || '',
      bio: displayUser?.bio || '',
      profile_image: displayUser?.profile_image || displayUser?.profilePic || ''
    });
    setAvatarFile(null);
    setAvatarPreview(displayUser?.profile_image || displayUser?.profilePic || '');
    setEditError('');
    setEditSuccess('');
    setShowEditModal(true);
  };

  const handleAvatarFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setEditError('Profile image must be less than 5MB.');
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
      setEditError('Allowed image formats are JPEG, PNG, and WebP.');
      return;
    }

    setEditError('');
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setEditError('');
    setEditSuccess('');

    if (!editFormData.full_name.trim()) {
      setEditError('Display name is required.');
      setSaving(false);
      return;
    }

    const cleanUsername = editFormData.username.trim().toLowerCase();
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(cleanUsername)) {
      setEditError('Username must be 3-30 characters long and contain only letters, numbers, and underscores.');
      setSaving(false);
      return;
    }

    try {
      let res;
      if (avatarFile) {
        const formData = new FormData();
        formData.append('full_name', editFormData.full_name.trim());
        formData.append('username', cleanUsername);
        formData.append('bio', editFormData.bio.trim());
        formData.append('avatar', avatarFile);

        res = await api.put(`/users/${currentUser?.id || 'me'}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await api.put(`/users/${currentUser?.id || 'me'}`, {
          full_name: editFormData.full_name.trim(),
          username: cleanUsername,
          bio: editFormData.bio.trim(),
          profile_image: editFormData.profile_image
        });
      }

      if (res.data?.success && res.data.user) {
        const updated = res.data.user;
        // Update local profile state immediately
        setLocalProfile(prev => ({ ...prev, ...updated }));
        // Update global auth state (Navbar, Sidebar, etc.)
        dispatch(setUser(updated));
        // Persist to localStorage
        localStorage.setItem('nipix_user', JSON.stringify(updated));

        setEditSuccess('Scholar profile updated successfully!');

        setTimeout(() => {
          setShowEditModal(false);
          setEditSuccess('');
          if (username && username !== updated.username) {
            navigate(`/profile/${updated.username}`, { replace: true });
          }
        }, 600);
      } else {
        setEditError(res.data?.message || 'Failed to update profile.');
      }
    } catch (err) {
      setEditError(err.response?.data?.message || err.message || 'An error occurred while saving profile changes.');
    } finally {
      setSaving(false);
    }
  };

  if (reduxLoading && !displayUser) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
        <p>Loading Profile...</p>
      </div>
    );
  }

  const profileName = displayUser?.full_name || displayUser?.name || displayUser?.username || 'Nipix User';
  const profileUsername = displayUser?.username || 'user';
  const profilePic = displayUser?.profile_image || displayUser?.profilePic;
  const followersCount = displayUser?.followersCount || displayUser?.followers?.length || 0;
  const followingCount = displayUser?.followingCount || displayUser?.following?.length || 0;
  const isOwnProfile = currentUser && (currentUser.username === profileUsername || currentUser.id === displayUser?.id || currentUser._id === displayUser?._id);

  return (
    <div style={{ maxWidth: '935px', margin: '30px auto', padding: '0 20px' }}>
      {/* Profile Header Card */}
      <div className="glass-card" style={{ padding: '36px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '48px', alignItems: 'center', flexWrap: 'wrap' }}>
          
          {/* Avatar Ring */}
          <div className="story-ring" style={{ padding: '4px' }}>
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile Avatar"
                className="story-avatar"
                style={{ width: '130px', height: '130px', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <div
                className="story-avatar"
                style={{
                  width: '130px',
                  height: '130px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-pink))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  color: '#fff'
                }}
              >
                {profileUsername[0].toUpperCase()}
              </div>
            )}
          </div>

          {/* Profile Details */}
          <div style={{ flex: 1, minWidth: '260px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#fff', margin: 0 }}>
                @{profileUsername}
              </h2>

              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '9999px', background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.3)', fontSize: '0.76rem', color: 'var(--accent-blue)', fontWeight: '600' }}>
                <NipixLogo size={14} style={{ borderRadius: '3px' }} /> Nipix Scholar
              </span>

              {isOwnProfile ? (
                <button
                  type="button"
                  onClick={handleOpenEditModal}
                  className="btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  <Settings size={16} /> Edit Profile
                </button>
              ) : (
                <button
                  onClick={handleFollowToggle}
                  className={isFollowing ? "btn-secondary" : "btn-primary"}
                  style={{ padding: '8px 24px', fontSize: '0.85rem' }}
                >
                  {isFollowing ? (
                    <> <UserCheck size={16} /> Following </>
                  ) : (
                    <> <UserPlus size={16} /> Follow </>
                  )}
                </button>
              )}
            </div>

            {/* Stats Row */}
            <div style={{ display: 'flex', gap: '32px', marginBottom: '20px' }}>
              <div><strong style={{ color: '#fff', fontSize: '1.1rem' }}>{userPosts.length}</strong> <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>posts</span></div>
              <div><strong style={{ color: '#fff', fontSize: '1.1rem' }}>{followersCount}</strong> <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>followers</span></div>
              <div><strong style={{ color: '#fff', fontSize: '1.1rem' }}>{followingCount}</strong> <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>following</span></div>
            </div>

            {/* Bio & Full Name */}
            <div>
              <p style={{ fontWeight: '700', fontSize: '1rem', color: '#fff', margin: '0 0 4px 0' }}>{profileName}</p>
              <p style={{ fontSize: '0.92rem', color: '#d1d5db', lineHeight: '1.5', margin: 0 }}>
                {displayUser?.bio || '✨ Living life through photos & video stories on Nipix.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', borderTop: '1px solid var(--border-color)', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('posts')}
          style={{
            background: 'none',
            border: 'none',
            borderTop: activeTab === 'posts' ? '2px solid #fff' : '2px solid transparent',
            color: activeTab === 'posts' ? '#fff' : 'var(--text-muted)',
            padding: '16px 32px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
        >
          <Grid size={16} /> Posts
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          style={{
            background: 'none',
            border: 'none',
            borderTop: activeTab === 'saved' ? '2px solid #fff' : '2px solid transparent',
            color: activeTab === 'saved' ? '#fff' : 'var(--text-muted)',
            padding: '16px 32px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
        >
          <Bookmark size={16} /> Saved
        </button>
      </div>

      {/* Posts Grid */}
      {activeTab === 'posts' && (
        <>
          {loadingPosts ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Fetching photos...</div>
          ) : userPosts.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-muted)' }}>
              <ImageIcon size={48} color="var(--accent-blue)" style={{ marginBottom: '12px' }} />
              <h3 style={{ color: '#fff', marginBottom: '8px' }}>No Posts Shared Yet</h3>
              <p style={{ fontSize: '0.9rem' }}>When @{profileUsername} posts photos or videos, they will appear here.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
              {userPosts.map((post) => (
                <div
                  key={post._id || post.id}
                  className="glass-card"
                  style={{
                    position: 'relative',
                    aspectRatio: '1',
                    overflow: 'hidden',
                    cursor: 'pointer'
                  }}
                >
                  <img
                    src={post.image || post.mediaUrl}
                    alt="post"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 0, left: 0, right: 0, bottom: 0,
                      background: 'rgba(0,0,0,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '24px',
                      opacity: 0,
                      transition: 'opacity 0.2s ease',
                      color: '#fff',
                      fontWeight: '700'
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Heart size={20} fill="#fff" /> {post.likes?.length || 0}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'saved' && (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-muted)' }}>
          <Bookmark size={48} color="var(--accent-purple)" style={{ marginBottom: '12px' }} />
          <h3 style={{ color: '#fff', marginBottom: '8px' }}>Saved Posts</h3>
          <p style={{ fontSize: '0.9rem' }}>Only you can see what you've saved.</p>
        </div>
      )}

      {/* Edit Scholar Profile Modal */}
      {showEditModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 7, 15, 0.85)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !saving) {
              setShowEditModal(false);
            }
          }}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '480px',
              padding: '28px',
              background: 'var(--bg-primary)',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Settings size={18} color="var(--accent-blue)" />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                  Edit Scholar Profile
                </h3>
              </div>
              <button
                type="button"
                onClick={() => !saving && setShowEditModal(false)}
                disabled={saving}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-dim)',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Error & Success Feedback */}
            {editError && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '0.84rem',
                  marginBottom: '16px'
                }}
              >
                <AlertCircle size={16} />
                <span>{editError}</span>
              </div>
            )}

            {editSuccess && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#34d399',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '0.84rem',
                  marginBottom: '16px'
                }}
              >
                <Check size={16} />
                <span>{editSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Avatar Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '12px 14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ position: 'relative' }}>
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar Preview"
                      style={{ width: '68px', height: '68px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-blue)' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '68px',
                        height: '68px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-pink))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.6rem',
                        fontWeight: 'bold',
                        color: '#fff'
                      }}
                    >
                      {(editFormData.username?.[0] || 'U').toUpperCase()}
                    </div>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 6px 0', fontSize: '0.86rem', fontWeight: '600', color: '#fff' }}>
                    Profile Photo
                  </p>
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    JPG, PNG or WebP up to 5MB
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    onChange={handleAvatarFileSelect}
                    style={{ display: 'none' }}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Camera size={14} /> Change Photo
                    </button>
                    {avatarPreview && avatarPreview !== (displayUser?.profile_image || '') && (
                      <button
                        type="button"
                        onClick={() => {
                          setAvatarFile(null);
                          setAvatarPreview(displayUser?.profile_image || displayUser?.profilePic || '');
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: '0.78rem', cursor: 'pointer', padding: '4px' }}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Display Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-dim)', marginBottom: '6px' }}>
                  Full Name / Display Name
                </label>
                <input
                  type="text"
                  value={editFormData.full_name}
                  onChange={(e) => setEditFormData({ ...editFormData, full_name: e.target.value })}
                  placeholder="e.g. Leo Scholar"
                  required
                  className="input-field"
                  style={{ width: '100%', padding: '10px 14px', fontSize: '0.9rem' }}
                />
              </div>

              {/* Username */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-dim)', marginBottom: '6px' }}>
                  Scholar Username
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', fontWeight: '600', fontSize: '0.9rem' }}>@</span>
                  <input
                    type="text"
                    value={editFormData.username}
                    onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                    placeholder="username"
                    required
                    className="input-field"
                    style={{ width: '100%', padding: '10px 14px 10px 28px', fontSize: '0.9rem' }}
                  />
                </div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  3–30 characters, letters, numbers, and underscores only.
                </span>
              </div>

              {/* Bio */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-dim)', marginBottom: '6px' }}>
                  Scholar Bio
                </label>
                <textarea
                  value={editFormData.bio}
                  onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                  placeholder="Share a short bio about your study interests, goals, or milestones..."
                  rows={3}
                  className="input-field"
                  style={{ width: '100%', padding: '10px 14px', fontSize: '0.9rem', resize: 'vertical' }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '6px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => !saving && setShowEditModal(false)}
                  disabled={saving}
                  className="btn-secondary"
                  style={{ padding: '10px 18px', fontSize: '0.88rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary"
                  style={{ padding: '10px 22px', fontSize: '0.88rem', minWidth: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  {saving ? (
                    <>
                      <Sparkles size={16} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;