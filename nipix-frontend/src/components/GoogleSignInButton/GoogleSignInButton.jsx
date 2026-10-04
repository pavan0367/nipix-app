import React, { useEffect, useRef, useState, useCallback, Component } from 'react';
import { useDispatch } from 'react-redux';
import { googleAuthThunk } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

/**
 * Error boundary to ensure Google Identity Services or third-party DOM issues
 * never crash the React component tree or result in a blank screen.
 */
class GoogleSignInErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('Google Sign-In Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ width: '100%', marginTop: '14px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-dim, #94a3b8)', margin: 0 }}>
            Google Sign-In is temporarily unavailable. Please sign in with your email.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

const GoogleSignInButtonInner = ({ redirectTarget, buttonText = "Sign in with Google" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const googleBtnContainerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isGsiRendered, setIsGsiRendered] = useState(false);
  const isMountedRef = useRef(true);

  // Read public Google OAuth Client ID from frontend environment
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

  const handleCredentialResponse = useCallback(async (response) => {
    if (!response || !response.credential) return;
    if (!isMountedRef.current) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await dispatch(googleAuthThunk(response.credential));
      if (!isMountedRef.current) return;

      if (res.meta.requestStatus === 'fulfilled') {
        const loggedUser = res.payload?.user;
        if (redirectTarget) {
          let safeTarget;
          try {
            safeTarget = decodeURIComponent(redirectTarget);
          } catch {
            safeTarget = redirectTarget;
          }
          if (safeTarget && safeTarget.startsWith('/') && !safeTarget.startsWith('//')) {
            navigate(safeTarget);
            return;
          }
        }
        if (loggedUser?.role === 'admin' || loggedUser?.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/home');
        }
      } else {
        setErrorMsg(res.payload?.message || 'Google authentication failed.');
      }
    } catch (err) {
      if (isMountedRef.current) {
        setErrorMsg(err.message || 'Google sign-in error.');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [dispatch, navigate, redirectTarget]);

  useEffect(() => {
    isMountedRef.current = true;
    if (!googleClientId) return;

    let checkInterval = null;

    const renderGsiButton = () => {
      if (!isMountedRef.current || !googleBtnContainerRef.current) return;
      if (!window.google?.accounts?.id) return;

      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        const container = googleBtnContainerRef.current;
        if (container) {
          // Safely clear any previously rendered Google nodes using native DOM API
          while (container.firstChild) {
            container.removeChild(container.firstChild);
          }

          const measuredWidth = container.parentElement?.offsetWidth || 356;
          const clampedWidth = Math.min(Math.max(measuredWidth - 4, 200), 400);

          window.google.accounts.id.renderButton(container, {
            type: 'standard',
            theme: 'filled_black',
            size: 'large',
            text: buttonText.toLowerCase().includes('sign up') ? 'signup_with' : 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            width: clampedWidth
          });

          if (isMountedRef.current) {
            setIsGsiRendered(true);
          }

          // Safely attempt One Tap without throwing on FedCM suppression
          try {
            window.google.accounts.id.prompt((notification) => {
              // Notification state handled silently
            });
          } catch {
            // FedCM / One Tap suppression is completely non-fatal
          }
        }

        if (checkInterval) clearInterval(checkInterval);
      } catch (err) {
        console.warn('Google GSI render notice:', err.message);
      }
    };

    if (window.google?.accounts?.id) {
      renderGsiButton();
    } else {
      if (!document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (isMountedRef.current) renderGsiButton();
        };
        document.head.appendChild(script);
      } else {
        checkInterval = setInterval(() => {
          if (window.google?.accounts?.id) {
            renderGsiButton();
          }
        }, 150);
      }
    }

    return () => {
      isMountedRef.current = false;
      if (checkInterval) clearInterval(checkInterval);
      // NOTE: Do NOT manually removeChild or mutate container during React unmount!
      // React will naturally remove the wrapper element from DOM.
    };
  }, [googleClientId, buttonText, handleCredentialResponse]);

  return (
    <div style={{ width: '100%', marginTop: '14px' }}>
      {googleClientId ? (
        <div style={{ position: 'relative', width: '100%', minHeight: '44px' }}>
          {/* Isolated dedicated container for Google Identity Services. React NEVER renders children inside this! */}
          <div
            ref={googleBtnContainerRef}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '44px',
              visibility: (isGsiRendered && !loading) ? 'visible' : 'hidden'
            }}
          />

          {/* Sibling loading / placeholder state - React manages this independently without touching Google's container */}
          {(!isGsiRendered || loading) && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '11px 16px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontWeight: '600',
                fontSize: '0.88rem',
                pointerEvents: 'none'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
              <span>{loading ? 'Authenticating with Google...' : buttonText}</span>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          disabled
          title="REACT_APP_GOOGLE_CLIENT_ID environment variable required in Vercel"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '11px 16px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'rgba(255, 255, 255, 0.5)',
            fontWeight: '600',
            fontSize: '0.88rem',
            cursor: 'not-allowed'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.6 }}>
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
          </svg>
          <span>{buttonText}</span>
        </button>
      )}

      {errorMsg && (
        <p style={{ margin: '8px 0 0 0', fontSize: '0.8rem', color: '#f87171', textAlign: 'center' }}>
          {errorMsg}
        </p>
      )}
    </div>
  );
};

const GoogleSignInButton = (props) => (
  <GoogleSignInErrorBoundary>
    <GoogleSignInButtonInner {...props} />
  </GoogleSignInErrorBoundary>
);

export default GoogleSignInButton;
