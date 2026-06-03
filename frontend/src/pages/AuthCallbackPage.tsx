import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { tokenStore } from '../config/token-store';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';

/**
 * Handles Google OAuth redirect: tokens arrive in the URL hash (not sent to Netlify).
 */
export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();

  useEffect(() => {
    const run = async () => {
      const hash = window.location.hash.startsWith('#')
        ? window.location.hash.slice(1)
        : window.location.hash;
      const params = new URLSearchParams(hash);

      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const error = searchParams.get('error');

      if (error) {
        navigate('/login?error=' + encodeURIComponent(error), { replace: true });
        return;
      }

      if (!accessToken || !refreshToken) {
        navigate('/login?error=missing_tokens', { replace: true });
        return;
      }

      tokenStore.setTokens(accessToken, refreshToken);
      window.history.replaceState(null, '', window.location.pathname);

      try {
        const user = await authService.getCurrentUser();
        setUser(user);
        navigate('/dashboard', { replace: true });
      } catch {
        tokenStore.clearTokens();
        navigate('/login?error=session_failed', { replace: true });
      }
    };

    void run();
  }, [navigate, searchParams, setUser]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface text-on-surface">
      <p className="text-body-lg">Completing sign in…</p>
    </div>
  );
}
