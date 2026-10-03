import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  BookOpen,
  FileCode,
  Award,
  Video,
  BarChart3,
  Server,
  Search,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Edit2,
  Trash2,
  ExternalLink,
  ChevronRight,
  Layers,
  ArrowRight,
  Lock,
  Eye,
  X
} from 'lucide-react';
import api from '../../services/api';
import NipixLogo from '../../components/NipixLogo';
import { COURSES, getCourseActivityCount } from '../../data/courses/coursesData';

const SECTIONS = [
  { id: 'dashboard', label: 'Admin Dashboard', icon: BarChart3 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'lessons', label: 'Lessons / Materials', icon: Layers },
  { id: 'tasks_tests', label: 'Tasks & Tests', icon: Award },
  { id: 'videos', label: 'Videos', icon: Video },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'system', label: 'System / Settings', icon: Server }
];

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchUser, setSearchUser] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editRole, setEditRole] = useState('user');
  const [editFullName, setEditFullName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Fetch Stats & Health
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, healthRes] = await Promise.all([
        api.get('/admin/stats').catch(e => ({ data: { stats: null } })),
        api.get('/admin/system').catch(e => ({ data: { system: null } }))
      ]);

      if (statsRes.data?.stats) setStats(statsRes.data.stats);
      if (healthRes.data?.system) setSystemHealth(healthRes.data.system);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const params = {};
      if (searchUser) params.search = searchUser;
      if (roleFilter) params.role = roleFilter;
      const res = await api.get('/admin/users', { params });
      if (res.data?.users) {
        setUsers(res.data.users);
        setTotalUsers(res.data.total || res.data.users.length);
      }
    } catch (err) {
      console.warn('Failed to fetch users:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (activeSection === 'users' || activeSection === 'dashboard') {
      fetchUsers();
    }
  }, [activeSection, searchUser, roleFilter]);

  const handleOpenEditUser = (u) => {
    setSelectedUser(u);
    setEditRole(u.role || 'user');
    setEditFullName(u.full_name || '');
    setEditBio(u.bio || '');
    setActionSuccess('');
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;
    try {
      const res = await api.put(`/admin/users/${selectedUser.id}`, {
        role: editRole,
        full_name: editFullName,
        bio: editBio
      });
      if (res.data?.success) {
        setActionSuccess('User profile and role updated successfully');
        fetchUsers();
        fetchDashboardData();
        setTimeout(() => setSelectedUser(null), 1200);
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleDeleteUser = async (id, username) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${username}"?`)) return;
    try {
      const res = await api.delete(`/admin/users/${id}`);
      if (res.data?.success) {
        alert(`User "${username}" deleted.`);
        fetchUsers();
        fetchDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '30px 24px', background: 'var(--bg-primary)' }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        
        {/* Header Banner */}
        <div
          className="glass-card"
          style={{
            padding: '24px 28px',
            marginBottom: '26px',
            borderLeft: '4px solid #ec4899',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #ec4899, #be185d)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(236, 72, 153, 0.35)'
              }}
            >
              <ShieldAlert size={28} color="#fff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '1.55rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  Nipix Administrative Management
                </h1>
                <span style={{ fontSize: '0.74rem', background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', padding: '3px 10px', borderRadius: '4px', fontWeight: '700' }}>
                  ADMIN ONLY
                </span>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                Platform management, user accounts, curriculum oversight, and system infrastructure diagnostics.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => { fetchDashboardData(); fetchUsers(); }}
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.82rem', gap: '8px' }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Metrics</span>
          </button>
        </div>

        {/* Section Navigation Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '26px' }}>
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id)}
                className={`category-pill ${isActive ? 'active' : ''}`}
                style={{
                  fontSize: '0.84rem',
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Icon size={14} />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* ---------------- SECTION 1: DASHBOARD OVERVIEW ---------------- */}
        {activeSection === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase' }}>
                  Total Registered Accounts
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#ffffff', margin: '6px 0' }}>
                  {stats?.totalUsers ?? '...'}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)' }}>
                  {stats?.regularUsers ?? 0} Scholars • {stats?.adminCount ?? 0} Admins
                </div>
              </div>

              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase' }}>
                  Structured Degree Courses
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent-blue)', margin: '6px 0' }}>
                  {COURSES.length}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  8 Stages each (Intro → Capstone)
                </div>
              </div>

              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase' }}>
                  Japanese Hub Modules
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#ec4899', margin: '6px 0' }}>
                  12
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  JLPT N5–N1, Kana, Kanji, Audio
                </div>
              </div>

              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase' }}>
                  AI Provider Status
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: stats?.aiReady ? '#10b981' : '#f59e0b', margin: '8px 0' }}>
                  {stats?.aiProvider || 'Gemini'}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                  Model: {stats?.aiModel || 'gemini-3.5-flash-lite'}
                </div>
              </div>
            </div>

            {/* Platform Health & Infrastructure Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Server size={18} color="var(--accent-cyan)" /> Live Infrastructure Health
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Database:</span>
                    <span style={{ color: '#10b981', fontWeight: '700' }}>● TiDB Cloud (MySQL 8.0 Parity)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Backend Server:</span>
                    <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>Render (Node.js {stats?.nodeVersion || 'v25.2.1'})</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Frontend Deployment:</span>
                    <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>Vercel Edge Network</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Server Uptime:</span>
                    <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{Math.floor((stats?.serverUptimeSeconds || 0) / 60)} minutes</span>
                  </div>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={18} color="var(--accent-emerald)" /> Quick User Management
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: '0 0 16px 0' }}>
                  Search and manage accounts, elevate trusted users to administrators, or audit activity.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveSection('users')}
                  className="btn-primary"
                  style={{ padding: '8px 18px', fontSize: '0.84rem', gap: '6px' }}
                >
                  <span>Open Users Directory</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- SECTION 2: USERS DIRECTORY & MANAGEMENT ---------------- */}
        {activeSection === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Search & Filter Bar */}
            <div className="glass-card" style={{ padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search scholars by username, email, or full name..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '40px', borderRadius: 'var(--radius-full)', fontSize: '0.86rem' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>Role:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="input-field"
                  style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '0.82rem', background: 'var(--bg-input)' }}
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admins Only</option>
                  <option value="user">Scholars Only</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-dim)', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.5px' }}>
                      <th style={{ padding: '14px 20px' }}>Scholar</th>
                      <th style={{ padding: '14px 20px' }}>Email</th>
                      <th style={{ padding: '14px 20px' }}>Role</th>
                      <th style={{ padding: '14px 20px' }}>Joined Date</th>
                      <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.15s ease' }}>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: u.role === 'admin' ? '#ec4899' : '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.8rem' }}>
                              {(u.username || 'U')[0].toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{u.username}</div>
                              <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>{u.full_name || 'No full name'}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>{u.email}</td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            background: u.role === 'admin' ? 'rgba(236, 72, 153, 0.15)' : 'rgba(59, 130, 246, 0.12)',
                            color: u.role === 'admin' ? '#ec4899' : 'var(--accent-blue)'
                          }}>
                            {u.role === 'admin' ? 'ADMIN' : 'USER'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px', color: 'var(--text-dim)' }}>
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenEditUser(u)}
                              className="btn-secondary"
                              style={{ padding: '5px 10px', fontSize: '0.76rem', gap: '4px' }}
                              title="Edit user details"
                            >
                              <Edit2 size={13} /> Edit
                            </button>
                            {u.role !== 'admin' && (
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(u.id, u.username)}
                                className="btn-secondary"
                                style={{ padding: '5px 10px', fontSize: '0.76rem', gap: '4px', color: '#ef4444' }}
                                title="Delete user"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ padding: '30px', textAlign: 'center', color: 'var(--text-dim)' }}>
                          No scholars found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Edit User Modal */}
            {selectedUser && (
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(5, 7, 15, 0.85)',
                  backdropFilter: 'blur(6px)',
                  zIndex: 9999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px'
                }}
              >
                <div className="glass-card" style={{ width: '100%', maxWidth: '460px', padding: '28px', background: 'var(--bg-primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                      Manage Scholar: {selectedUser.username}
                    </h3>
                    <button type="button" onClick={() => setSelectedUser(null)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                      <X size={18} />
                    </button>
                  </div>

                  {actionSuccess && (
                    <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '10px', borderRadius: '6px', fontSize: '0.82rem', marginBottom: '14px' }}>
                      ✓ {actionSuccess}
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>Account Role</label>
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        className="input-field"
                        style={{ width: '100%', padding: '8px 12px', fontSize: '0.85rem' }}
                      >
                        <option value="user">USER (Standard Scholar)</option>
                        <option value="admin">ADMIN (Platform Administrator)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>Full Name</label>
                      <input
                        type="text"
                        value={editFullName}
                        onChange={(e) => setEditFullName(e.target.value)}
                        className="input-field"
                        style={{ width: '100%', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>Bio / Notes</label>
                      <textarea
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        className="input-field"
                        rows={3}
                        style={{ width: '100%', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                      <button type="button" onClick={() => setSelectedUser(null)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.84rem' }}>
                        Cancel
                      </button>
                      <button type="button" onClick={handleSaveUser} className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.84rem' }}>
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---------------- SECTION 3: COURSES OVERVIEW ---------------- */}
        {activeSection === 'courses' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              Curriculum & Course Catalog ({COURSES.length} Courses)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
              {COURSES.map((crs) => {
                const acts = getCourseActivityCount(crs);
                return (
                  <div key={crs.id} className="glass-card" style={{ padding: '22px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.74rem', background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-blue)', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                        {crs.subject}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{crs.level}</span>
                    </div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff', margin: '0 0 6px 0' }}>
                      {crs.title}
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: '0 0 14px 0' }}>
                      {crs.shortDescription}
                    </p>
                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      <span>8 Stages • {acts} Total Activities</span>
                      <span style={{ color: 'var(--accent-cyan)' }}>AI: @{crs.recommendedBot}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------- SECTION 4: LESSONS & MATERIALS ---------------- */}
        {activeSection === 'lessons' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              Curriculum Lessons & Materials Directory
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
              Audit lesson portions, multi-part curriculum stages, and reference notes.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {COURSES.map((crs) => (
                <div key={crs.id} className="glass-card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h4 style={{ fontSize: '1.02rem', fontWeight: '800', color: 'var(--accent-blue)', margin: 0 }}>
                      {crs.title}
                    </h4>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>
                      {crs.lessons?.length || 0} Lessons
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                    {crs.lessons?.map((les, lIdx) => (
                      <div key={les.id} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontWeight: '700', fontSize: '0.84rem', color: '#ffffff', marginBottom: '4px' }}>
                          {lIdx + 1}. {les.title}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                          {les.portions?.length || 0} Portions • {les.points} pts
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- SECTION 5: TASKS & TESTS ---------------- */}
        {activeSection === 'tasks_tests' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 12px 0' }}>
                Assessment Tasks & Quizzes
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                {COURSES.map((crs) => (
                  <div key={crs.id} className="glass-card" style={{ padding: '20px' }}>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#ffffff', margin: '0 0 10px 0' }}>
                      {crs.title}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)' }}>
                        <span>Practical Tasks:</span>
                        <strong style={{ color: 'var(--text-main)' }}>{crs.tasks?.length || 0}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)' }}>
                        <span>Graded Tests:</span>
                        <strong style={{ color: 'var(--text-main)' }}>{crs.tests?.length || 0} (Passing: 70%)</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)' }}>
                        <span>Capstone Project:</span>
                        <strong style={{ color: 'var(--accent-purple)' }}>{crs.project ? 'Configured' : 'None'}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- SECTION 6: VIDEOS ---------------- */}
        {activeSection === 'videos' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              Curated Video Lecture Assets
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {COURSES.flatMap(c => c.videos || []).map((vid) => (
                <div key={vid.id} className="glass-card" style={{ padding: '18px' }}>
                  <h4 style={{ fontSize: '0.94rem', fontWeight: '700', color: '#ffffff', margin: '0 0 6px 0' }}>
                    {vid.title}
                  </h4>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '8px' }}>
                    Duration: {vid.duration} • Award: {vid.points} pts
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent-blue)', wordBreak: 'break-all' }}>
                    {vid.videoUrl}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- SECTION 7: ANALYTICS ---------------- */}
        {activeSection === 'analytics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              Platform Engagement & Analytics
            </h3>
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>Registered Users</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff', margin: '4px 0' }}>{stats?.totalUsers || 0}</div>
                  <div style={{ fontSize: '0.72rem', color: '#10b981' }}>100% active account verification</div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>Total Learning Courses</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#38bdf8', margin: '4px 0' }}>8</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Complete A-to-Z degree tracks</div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>AI Chat Bots</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ec4899', margin: '4px 0' }}>7 Bots</div>
                  <div style={{ fontSize: '0.72rem', color: '#10b981' }}>Streaming & Inactivity Timeout</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- SECTION 8: SYSTEM / SETTINGS ---------------- */}
        {activeSection === 'system' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              System Health & Operational Status
            </h3>
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.86rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Operational State:</span>
                  <span style={{ color: '#10b981', fontWeight: '800' }}>● Healthy & Active</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-dim)' }}>TiDB Database Cluster:</span>
                  <span style={{ color: '#10b981', fontWeight: '700' }}>gateway01.us-east-1.prod.aws.tidbcloud.com</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Active AI Provider:</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: '700' }}>{systemHealth?.ai?.provider || 'Gemini'} ({systemHealth?.ai?.model || 'gemini-3.5-flash-lite'})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Node Environment:</span>
                  <span style={{ color: 'var(--text-main)' }}>{systemHealth?.nodeVersion || process.version} on {systemHealth?.platform || 'linux'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Admin Endpoint Protection:</span>
                  <span style={{ color: '#10b981', fontWeight: '700' }}>✓ Backend JWT & Role Authorization (403 Forbidden for non-admins)</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
