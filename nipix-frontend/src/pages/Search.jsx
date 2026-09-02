import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Search = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 0) {
        try {
          const res = await api.get(`/users/search?q=${query}`);
          setUsers(res.data.users);
        } catch (err) { console.error(err); }
      } else {
        setUsers([]);
      }
    }, 300); // Debounce
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px' }}>
      <input 
        type="text" 
        placeholder="Search users..." 
        value={query} 
        onChange={e => setQuery(e.target.value)} 
        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #dbdbdb', marginBottom: '20px' }} 
      />
      <div>
        {users.map(user => (
          <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px 0', borderBottom: '1px solid #efefef' }}>
            <img src={user.profile_image || 'https://via.placeholder.com/40'} alt="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
            <div>
              <p style={{ fontWeight: 'bold', margin: 0 }}>{user.username}</p>
              <p style={{ color: '#8e8e8e', margin: 0 }}>{user.full_name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;