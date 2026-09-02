import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', full_name: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = isRegister ? registerUser(formData) : loginUser({ email: formData.email, password: formData.password });
    const result = await dispatch(action);
    if (result.meta.requestStatus === 'fulfilled') navigate('/');
  };

  return (
    <div style={{ maxWidth: '350px', margin: '100px auto', padding: '40px', border: '1px solid #dbdbdb', borderRadius: '8px' }}>
      <h1 style={{ fontFamily: 'cursive', textAlign: 'center' }}>Nipix</h1>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error.message}</p>}
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <>
            <input type="text" placeholder="Full Name" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
            <input type="text" placeholder="Username" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
          </>
        )}
        <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <input type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', background: '#0095f6', color: 'white', border: 'none', borderRadius: '5px' }}>
          {loading ? 'Loading...' : isRegister ? 'Sign Up' : 'Log In'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        {isRegister ? 'Have an account?' : "Don't have an account?"} 
        <span onClick={() => setIsRegister(!isRegister)} style={{ color: '#0095f6', cursor: 'pointer', marginLeft: '5px' }}>
          {isRegister ? 'Log In' : 'Sign Up'}
        </span>
      </p>
    </div>
  );
};

export default Login;