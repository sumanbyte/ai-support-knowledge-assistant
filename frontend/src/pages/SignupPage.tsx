import React, { useEffect, useState } from 'react';
import { AuthDivider } from '../components/auth/AuthDivider';
import { AuthField } from '../components/auth/AuthField';
import { AuthLayout } from '../components/auth/AuthLayout';
import { toast } from '../components/toast';
import { Icon } from '../components/UI/Icon';
import { authService } from '../services/authService';
import { useApi } from '../hooks/useApi';
import { isAxiosError } from 'axios';
import { useAppNavigate } from '../hooks/useAppNavigate';
import { GoogleIcon } from '../components/auth/GoogleIcon';

export const SignupPage: React.FC = () => {
  const navigate = useAppNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const { data, error, loading, execute } = useApi(authService.signup);

  useEffect(() => {
    if (!data) return;
    toast.success('Account created successfully.', {
      description: 'You can now sign in with your credentials.',
    });
    navigate('login');
  }, [data, navigate]);

  useEffect(() => {
    if (!error) return;
    const fallback = 'Unable to create your account. Please try again.';
    const message = isAxiosError(error)
      ? ((error.response?.data as { message?: string } | undefined)?.message ?? fallback)
      : fallback;
    toast.error(message, { title: 'Signup failed' });
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeToTerms) {
      toast.error('Please agree to the Terms of Service and Privacy Policy.', {
        title: 'Terms required',
      });
      return;
    }
    execute({ name: fullName, email, password });
  };

  return (
    <AuthLayout
      footer={
        <div className="mt-6 flex justify-between px-2 font-label-sm text-xs uppercase tracking-widest text-on-surface-variant/40">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Security Verified
          </div>
          <span>v2.4.0-Enterprise</span>
        </div>
      }
    >
      <div className="auth-glass-card auth-card-glow flex flex-col gap-6 rounded-xl p-10">
        {/* Branding inside card — Stitch signup layout */}
        <header className="flex flex-col items-center gap-2 text-center">
          <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center shrink-0"><span className="material-symbols-outlined leading-none text-on-primary-container" aria-hidden="true"

            style={{
              fontSize: "22px",
              fontVariationSettings: "FILL 1",
            }}

          >dataset</span></div>
          <h1 className="font-display text-headline-lg font-semibold tracking-tight text-on-surface">
            Converse AI
          </h1>
          <p className="max-w-[280px] text-body-md text-on-surface-variant">
            Start building your enterprise knowledge base.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <AuthField
            id="full_name"
            label="Full Name"
            icon="person"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <AuthField
            id="work_email"
            label="Work Email"
            type="email"
            icon="mail"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <AuthField
            id="password"
            label="Create Password"
            type="password"
            icon="lock"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="mt-1 flex items-start gap-2">
            <input
              id="terms"
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-outline-variant/30 bg-surface-container-low text-primary focus:ring-primary/30"
            />
            <label htmlFor="terms" className="text-[13px] leading-tight text-on-surface-variant">
              I agree to the{' '}
              <button type="button" className="text-primary transition-all hover:underline">
                Terms of Service
              </button>{' '}
              and{' '}
              <button type="button" className="text-primary transition-all hover:underline">
                Privacy Policy
              </button>
              .
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-lg bg-primary py-3 text-headline-md font-medium text-on-primary shadow-lg shadow-primary/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Icon name="progress_activity" size={18} className="animate-spin" />
                Processing...
              </span>
            ) : (
              'Create Account'
            )}
          </button>

          <AuthDivider />

          <button
            type="button"
            onClick={() => authService.startGoogleLogin()}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-outline-variant/40 bg-transparent py-3 text-body-md text-on-surface transition-all hover:bg-white/5 active:scale-[0.98]"
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </form>

        <footer className="border-t border-outline-variant/10 pt-4 text-center">
          <p className="text-on-surface-variant">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('login')}
              className="font-semibold text-primary transition-all hover:underline"
            >
              Log in
            </button>
          </p>
        </footer>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;
