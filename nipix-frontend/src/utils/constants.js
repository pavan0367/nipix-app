// Production URLs (Render Backend + Vercel Frontend)
const PRODUCTION_API_URL = 'https://nipix-app.onrender.com/api';
const PRODUCTION_SOCKET_URL = 'https://nipix-app.onrender.com';
const PRODUCTION_FRONTEND_URL = 'https://nipix-media.vercel.app';

// Production API Base URL (Render Backend)
export const API_BASE = process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/api'
    : PRODUCTION_API_URL);

// Production WebSocket URL (Render Socket Server)
export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL ||
  (process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : PRODUCTION_SOCKET_URL);

// Production Client Frontend URL (Vercel)
export const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL ||
  (process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : PRODUCTION_FRONTEND_URL);

export const APP_NAME = 'Nipix';
export const DEFAULT_AVATAR = null;
