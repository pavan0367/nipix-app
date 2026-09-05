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
    <div className="app-container" style={{ background: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-main)' }}>
      {/* Persistent Top Navigation with Prominent Top-Right Chat Option */}
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Navbar currentUser={user} />

        <div style={{ display: 'flex', flex: 1 }}>
          {/* Persistent Academic Sidebar */}
          <Sidebar currentUser={user} onLogout={handleLogout} />

          {/* Main App Workspace (Strictly isolated on Chat route to prevent page scroll) */}
          <main
            className={`main-content ${isChatRoute ? 'main-content-chat' : ''}`}
            style={{
              flex: 1,
              width: '100%',
              minHeight: isChatRoute ? 0 : 'calc(100vh - 65px)',
              height: isChatRoute ? 'calc(100vh - 65px)' : 'auto',
              maxHeight: isChatRoute ? 'calc(100vh - 65px)' : 'none',
              overflow: isChatRoute ? 'hidden' : 'visible',
              paddingBottom: isChatRoute ? 0 : undefined
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
