import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { followUser } from '../store/slices/userSlice';
import api from '../services/api';
import { Search as SearchIcon, X, UserPlus, UserCheck, TrendingUp, Sparkles, Compass } from 'lucide-react';

const Search = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [followingMap, setFollowingMap] = useState({});
  const dispatch = useDispatch();

  const trendingTags = ['#photography', '#art', '#travel', '#design', '#tech', '#lifestyle'];

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 0) {
        setIsSearching(true);
        try {
          const res = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
          const resultUsers = Array.isArray(res.data) ? res.data : (res.data.users || []);
          setUsers(resultUsers);
        } catch (err) {
          console.error('Search error:', err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setUsers([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleFollow = (userId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (userId) {
      dispatch(followUser(userId));
      setFollowingMap(prev => ({ ...prev, [userId]: !prev[userId] }));
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '30px auto', padding: '0 16px' }}>
      {/* Search Input Bar */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <SearchIcon size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px' }} />
          <input
            type="text"
            placeholder="Search accounts by username or name..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="input-field"
            style={{
              paddingLeft: '48px',
              paddingRight: '44px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.95rem'
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ position: 'absolute', right: '14px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Trending pills when empty */}
        {!query && (
          <div style={{ marginTop: '20px' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={14} color="var(--accent-orange)" /> Trending Tags
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {trendingTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag.replace('#', ''))}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '16px',
                    border: '1px solid var(--border-color)',
                    background: 'rgba(255,255,255,0.04)',
                    color: 'var(--accent-blue)',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search Results */}
      <div className="glass-card" style={{ padding: '16px' }}>
        {isSearching ? (
          <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Sparkles size={20} className="animate-spin" color="var(--accent-blue)" /> Searching accounts...
          </div>
        ) : query && users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)' }}>
            <Compass size={40} color="var(--text-muted)" style={{ marginBottom: '12px', opacity: 0.5 }} />
            <p style={{ fontSize: '1rem', color: '#fff', margin: '0 0 4px 0' }}>No users found</p>
            <p style={{ fontSize: '0.85rem', margin: 0 }}>Try searching for a different username or full name.</p>
          </div>
        ) : !query ? (
          <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
            <Compass size={40} color="var(--accent-purple)" style={{ marginBottom: '12px' }} />
            <p style={{ fontSize: '0.95rem', margin: 0, color: '#fff', fontWeight: '600' }}>Explore & Connect</p>
            <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Search for creators, friends, and accounts across Nipix.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {users.map(user => {
              const uName = user.username || 'user';
              const fName = user.full_name || user.name || '';
              const isF = followingMap[user.id || user._id] || user.isFollowing;

              return (
                <Link
                  to={`/profile/${uName}`}
                  key={user.id || user._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    textDecoration: 'none',
                    color: '#fff',
                    transition: 'background 0.2s ease',
                    background: 'transparent'
                  }}
                  className="nav-item"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div className="story-ring" style={{ padding: '2px' }}>
                      {user.profile_image || user.profilePic ? (
                        <img
                          src={user.profile_image || user.profilePic}
                          alt="avatar"
                          className="story-avatar"
                          style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div
                          className="story-avatar"
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            background: 'var(--accent-purple)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            color: '#fff'
                          }}
                        >
                          {uName[0].toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div>
                      <p style={{ fontWeight: '700', fontSize: '0.95rem', margin: 0, color: '#fff' }}>@{uName}</p>
                      {fName && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>{fName}</p>}
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleFollow(user.id || user._id, e)}
                    className={isF ? "btn-secondary" : "btn-primary"}
                    style={{ padding: '6px 16px', fontSize: '0.8rem' }}
                  >
                    {isF ? (
                      <> <UserCheck size={14} /> Following </>
                    ) : (
                      <> <UserPlus size={14} /> Follow </>
                    )}
                  </button>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;