import React, { useState } from 'react';
import { AuthDivider } from '../components/auth/AuthDivider';
import { AuthField } from '../components/auth/AuthField';
import { AuthLayout } from '../components/auth/AuthLayout';
import { CONVERSE_LOGO_URL } from '../components/auth/constants';
import { SsoIcon } from '../components/auth/SsoIcon';
import { Icon } from '../components/UI/Icon';
import type { PageType } from '../types/navigation';

interface SignupPageProps {
  onNavigate: (page: PageType) => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onNavigate }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!agreeToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      onNavigate('dashboard');
    } catch {
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
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
          <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-xl border border-outline-variant/20 bg-surface-container-highest p-1">
            <img alt="Converse AI Logo" className="h-12 w-12 object-contain" src={CONVERSE_LOGO_URL} />
          </div>
          <h1 className="font-display text-headline-lg font-semibold tracking-tight text-on-surface">
            Converse AI
          </h1>
          <p className="max-w-[280px] text-body-md text-on-surface-variant">
            Start building your enterprise knowledge base.
          </p>
        </header>

        {error && (
          <div className="rounded-lg border border-error/50 bg-error/20 p-4">
            <p className="text-body-md text-error">{error}</p>
          </div>
        )}

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
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-outline-variant/30 bg-surface-container py-3 text-body-md text-on-surface transition-all hover:bg-surface-container-high active:scale-[0.98]"
          >
            <SsoIcon />
            Continue with SSO
          </button>
        </form>

        <footer className="border-t border-outline-variant/10 pt-4 text-center">
          <p className="text-on-surface-variant">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate('login')}
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
