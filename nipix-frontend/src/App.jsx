import React, { useEffect } from 'react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
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
  const { user, token } = useSelector((state) => state.auth);

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

          {/* Main App Workspace */}
          <main className="main-content" style={{ flex: 1, minHeight: 'calc(100vh - 65px)', width: '100%' }}>
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
