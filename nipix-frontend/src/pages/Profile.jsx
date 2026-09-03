import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, followUser } from '../store/slices/userSlice';

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.user);
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchProfile(id));
  }, [dispatch, id]);

  if (loading || !profile) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', marginBottom: '40px', alignItems: 'center' }}>
        <img src={profile.profile_image || 'https://via.placeholder.com/150'} alt="profile" style={{ width: '150px', height: '150px', borderRadius: '50%', marginRight: '50px' }} />
        <div>
          <h2 style={{ display: 'inline-block', marginRight: '20px' }}>{profile.username}</h2>
          {currentUser && currentUser.id !== profile.id && (
            <button onClick={() => dispatch(followUser(profile.id))} style={{ padding: '5px 20px', background: profile.isFollowing ? '#efefef' : '#0095f6', color: profile.isFollowing ? 'black' : 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              {profile.isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
          <div style={{ display: 'flex', gap: '30px', margin: '20px 0' }}>
            <span><strong>{profile.followersCount}</strong> followers</span>
            <span><strong>{profile.followingCount}</strong> following</span>
          </div>
          <p><strong>{profile.full_name}</strong></p>
          <p>{profile.bio}</p>
        </div>
      </div>
      <div style={{ borderTop: '1px solid #dbdbdb', paddingTop: '20px' }}>
        <p style={{ textAlign: 'center', color: '#8e8e8e' }}>Posts grid will be implemented in Part 3.</p>
      </div>
    </div>
  );
};

export default Profile;