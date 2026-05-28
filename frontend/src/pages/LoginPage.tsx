import React, { useEffect, useState } from 'react';
import { AuthDivider } from '../components/auth/AuthDivider';
import { AuthField } from '../components/auth/AuthField';
import { AuthLayout } from '../components/auth/AuthLayout';
import { CONVERSE_LOGO_URL } from '../components/auth/constants';
import { GoogleIcon } from '../components/auth/GoogleIcon';
import { toast } from '../components/toast';
import { Icon } from '../components/UI/Icon';
import { authService } from '../services/authService';
import { useApi } from '../hooks/useApi';
import { useError } from '../hooks/useError';
import { useAppNavigate } from '../hooks/useAppNavigate';
import { useAuth } from '../context/AuthContext';
import type { LoginDto } from '../api';

export const LoginPage: React.FC = () => {
  const navigate = useAppNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { setUser } = useAuth();

  const { data, error, loading, execute } = useApi(authService.login);

  useError(error);

  useEffect(() => {
    if (!data) return;
    setUser(data.user)
    toast.success('Welcome back.', {
      description: 'Redirecting to Mission Control.',
    });
    navigate('dashboard');
  }, [data, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    execute({ email, password } satisfies LoginDto);

  };

  return (
    <AuthLayout>
      {/* Branding above card — Stitch login layout */}
      <div className="mb-10 flex flex-col items-center text-center">
        <div className="mb-4 h-12 w-12 overflow-hidden rounded-lg">
          <img alt="Converse AI Logo" className="h-full w-full object-cover" src={CONVERSE_LOGO_URL} />
        </div>
        <h1 className="font-display text-headline-md font-medium tracking-tight text-on-surface">
          Converse AI
        </h1>
        <p className="mt-1 text-body-md text-on-surface-variant">Welcome back to Mission Control.</p>
      </div>

      <div className="auth-glass-card-login auth-card-glow rounded-xl p-10 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <AuthField
            id="email"
            label="Corporate Email"
            type="email"
            icon="mail"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            inputClassName="bg-surface-container-lowest"
          />

          <AuthField
            id="password"
            label="Security Key"
            type="password"
            icon="lock"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            labelExtra={
              <label
                htmlFor="password"
                className="font-label-sm text-xs uppercase tracking-widest text-on-surface-variant"
              >
                Security Key
              </label>
            }
            inputClassName="bg-surface-container-lowest"
          />

          <div className="flex items-center justify-between text-body-md">
            <label className="group flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-outline-variant/30 bg-surface-container-low text-primary focus:ring-primary/30"
              />
              <span className="ml-2 text-on-surface-variant transition-colors group-hover:text-on-surface">
                Remember me
              </span>
            </label>
            <button type="button" className="font-medium text-primary transition-all hover:underline">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-gradient-btn w-full rounded-lg py-3.5 text-headline-md font-bold text-on-primary shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <AuthDivider label="or continue with" />

        <div className="grid grid-cols-1 gap-4">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-outline-variant/40 bg-transparent py-3 text-body-md text-on-surface transition-all hover:bg-white/5 active:scale-[0.98]"
          >
            <Icon name="id_card" size={20} />
            Continue with SSO
          </button>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-outline-variant/40 bg-transparent py-3 text-body-md text-on-surface transition-all hover:bg-white/5 active:scale-[0.98]"
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </div>
      </div>

      <p className="mt-10 text-center text-body-md text-on-surface-variant">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={() => navigate('signup')}
          className="ml-1 font-semibold text-primary transition-all hover:underline"
        >
          Sign up
        </button>
      </p>

      <div className="mt-10 flex justify-center">
        <div className="flex items-center gap-2 rounded-full border border-white/5 bg-surface-container-high/40 px-4 py-2 opacity-50">
          <Icon name="keyboard_command_key" size={16} />
          <span className="font-label-sm text-xs">CMD+K TO SEARCH</span>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
