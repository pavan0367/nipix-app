import React, { useEffect } from 'react';
import { BrowserRouter as Router, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { logout } from './store/slices/authSlice';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';
import './App.css';

axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function AppContent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useSelector((state) => state.auth);

  const isChatRoute = location.pathname.startsWith('/chat') || location.pathname === '/hidden-chat';

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

  return (
    <div className={`app-container ${isChatRoute ? 'app-container-chat' : ''}`} style={{ background: 'var(--bg-primary)', minHeight: isChatRoute ? '100vh' : '100vh', height: isChatRoute ? '100vh' : 'auto', maxHeight: isChatRoute ? '100vh' : 'none', overflow: isChatRoute ? 'hidden' : 'visible', color: 'var(--text-main)' }}>
      {/* Persistent Top Navigation with Prominent Top-Right Chat Option */}
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: isChatRoute ? '100vh' : 'auto', maxHeight: isChatRoute ? '100vh' : 'none', overflow: isChatRoute ? 'hidden' : 'visible' }}>
        <Navbar currentUser={user} />

        <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: isChatRoute ? 'hidden' : 'visible' }}>
          {/* Persistent Academic Sidebar */}
          <Sidebar currentUser={user} onLogout={handleLogout} />

          {/* Main App Workspace (Strictly isolated on Chat route to prevent page scroll and keep composer fixed) */}
          <main
            className={`main-content ${isChatRoute ? 'main-content-chat' : ''}`}
            style={{
              flex: 1,
              width: '100%',
              minHeight: 0,
              height: isChatRoute ? '100%' : 'auto',
              maxHeight: isChatRoute ? '100%' : 'none',
              overflow: isChatRoute ? 'hidden' : 'visible',
              paddingBottom: isChatRoute ? 0 : undefined,
              display: isChatRoute ? 'flex' : 'block',
              flexDirection: isChatRoute ? 'column' : undefined
            }}
          >
            <AppRoutes />
          </main>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
