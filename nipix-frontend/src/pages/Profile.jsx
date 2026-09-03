import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, followUser } from '../store/slices/userSlice';
import api from '../services/api';
import { User, Grid, Bookmark, Heart, Settings, UserPlus, UserCheck, Image as ImageIcon } from 'lucide-react';

const Profile = ({ currentUser: propCurrentUser }) => {
  const { username, id } = useParams();
  const dispatch = useDispatch();
  const { profile: reduxProfile, loading: reduxLoading } = useSelector((state) => state.user || {});
  const stateAuthUser = useSelector((state) => state.auth?.user);
  const currentUser = propCurrentUser || stateAuthUser;

  const [activeTab, setActiveTab] = useState('posts');
  const [userPosts, setUserPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [localProfile, setLocalProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

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

  if (reduxLoading && !displayUser) {
    style: return (
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#fff', margin: 0 }}>
                @{profileUsername}
              </h2>

              {isOwnProfile ? (
                <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
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
    </div>
  );
};

export default Profile;