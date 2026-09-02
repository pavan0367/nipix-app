import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import Login from './pages/Login';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Search from './pages/Search';
import Chat from './pages/Chat';

axios.defaults.baseURL = 'http://localhost:5000/api';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('nipix_token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.defaults.headers.common['x-auth-token'] = token;
      axios.get('/auth/me').then(res => setUser(res.data)).catch(() => {
        localStorage.removeItem('nipix_token');
        setToken(null);
      });
    }
  }, [token]);

  const handleLogin = (data) => {
    localStorage.setItem('nipix_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const handleLogout = () => {
    localStorage.removeItem('nipix_token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    delete axios.defaults.headers.common['x-auth-token'];
  };

  return (
    <Router>
      <nav style={{ padding: '15px 30px', background: '#ffffff', borderBottom: '1px solid #efefef', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ fontFamily: 'cursive', fontWeight: 'bold', fontSize: '1.8rem', textDecoration: 'none', color: '#262626' }}>Nipix</Link>
        {user ? (
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link to="/feed" style={{ textDecoration: 'none', color: '#262626', fontWeight: '500' }}>Feed</Link>
            <Link to="/search" style={{ textDecoration: 'none', color: '#262626', fontWeight: '500' }}>Search</Link>
            <Link to="/notifications" style={{ textDecoration: 'none', color: '#262626', fontWeight: '500' }}>Notifications</Link>
            <Link to={`/profile/${user.username}`} style={{ textDecoration: 'none', color: '#262626', fontWeight: '500' }}>Profile</Link>
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#ed4956', cursor: 'pointer', fontWeight: '600' }}>Logout</button>
          </div>
        ) : null}
      </nav>
      <div style={{ background: '#fafafa', minHeight: '100vh' }}>
        <Routes>
          <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/feed" />} />
          <Route path="/feed" element={user ? <Feed currentUser={user} /> : <Navigate to="/login" />} />
          <Route path="/search" element={user ? <Search /> : <Navigate to="/login" />} />
          <Route path="/notifications" element={user ? <Notifications /> : <Navigate to="/login" />} />
          <Route path="/chat" element={user ? <Chat /> : <Navigate to="/login" />} />
          <Route path="/profile/:username" element={user ? <Profile currentUser={user} /> : <Navigate to="/login" />} />
          <Route path="/" element={user ? <Navigate to="/feed" /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;