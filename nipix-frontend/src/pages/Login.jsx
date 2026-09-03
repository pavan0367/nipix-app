import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser } from '../store/slices/authSlice'; // Import from Redux Slice!
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', full_name: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let result;
    if (isRegister) {
      // Dispatch the Register Thunk
      result = await dispatch(registerUser(formData));
    } else {
      // Dispatch the Login Thunk
      result = await dispatch(loginUser({ email: formData.email, password: formData.password }));
    }

    // If successful, go to home page
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/');
    }
  };

  const getErrorMessage = () => {
    if (!error) return null;
    if (typeof error === 'string') return error;
    return error.message || error.msg || error.error || 'Authentication failed';
  };

  return (
    <div style={{ maxWidth: '350px', margin: '100px auto', padding: '40px', border: '1px solid #dbdbdb', borderRadius: '8px' }}>
      <h1 style={{ fontFamily: 'cursive', textAlign: 'center' }}>Nipix</h1>
      {error && <p style={{ color: 'red', textAlign: 'center', fontSize: '14px' }}>{getErrorMessage()}</p>}
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <>
            <input type="text" placeholder="Full Name" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }} />
            <input type="text" placeholder="Username" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }} />
          </>
        )}
        <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }} />
        <input type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }} />
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', background: '#0095f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          {loading ? 'Loading...' : isRegister ? 'Sign Up' : 'Log In'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
        {isRegister ? 'Have an account?' : "Don't have an account?"} 
        <span onClick={() => setIsRegister(!isRegister)} style={{ color: '#0095f6', cursor: 'pointer', marginLeft: '5px', fontWeight: 'bold' }}>
          {isRegister ? 'Log In' : 'Sign Up'}
        </span>
      </p>
    </div>
  );
};

export default Login;