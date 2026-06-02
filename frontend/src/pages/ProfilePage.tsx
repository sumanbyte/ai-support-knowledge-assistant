import React, { useEffect, useState } from 'react';
import { AppShell } from '../components/Layout';
import { PageHeader } from '../components/Layout/PageHeader';
import { PageContent } from '../components/Layout/PageContent';
import { Icon } from '../components/UI/Icon';
import { useAppNavigate } from '../hooks/useAppNavigate';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import { useError } from '../hooks/useError';
import { authService } from '../services/authService';
import { toast } from '../components/toast';

export const ProfilePage: React.FC = () => {
  const navigate = useAppNavigate();
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name ?? '');

  const { execute: saveProfile, loading: saving, error } = useApi(authService.updateProfile);
  useError(error);

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user?.name]);

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error('Display name cannot be empty.');
      return;
    }
    const updated = await saveProfile({ name: trimmed });
    if (updated) {
      setUser(updated);
      toast.success('Profile updated.');
    }
  };

  return (
    <AppShell
      header={
        <PageHeader
          title="User Profile"
          subtitle="Your account details."
          actions={
            <button
              type="button"
              onClick={() => navigate('dashboard')}
              className="glass-panel px-4 py-2 rounded text-sm text-on-surface hover:text-primary transition-smooth"
            >
              ← Dashboard
            </button>
          }
        />
      }
    >
      <PageContent className="max-w-2xl space-y-8">
        <div className="glass-panel p-8 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-primary-container border-2 border-primary/40 flex items-center justify-center ai-glow">
              <Icon name="person" size={48} className="text-primary" />
            </div>
            <div>
              <h2 className="text-headline-lg text-on-surface font-semibold">
                {user?.name ?? '—'}
              </h2>
              <p className="text-on-surface-variant mt-2">{user?.email ?? '—'}</p>
            </div>
          </div>
        </div>

        <div className="glass-panel p-7 rounded-xl space-y-5">
          <label className="block">
            <span className="font-label-sm text-on-surface-variant block mb-2">Display name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full glass-overlay rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </label>
          <label className="block">
            <span className="font-label-sm text-on-surface-variant block mb-2">Email</span>
            <input
              value={user?.email ?? ''}
              readOnly
              className="w-full glass-overlay rounded-lg px-4 py-2.5 text-on-surface-variant cursor-not-allowed opacity-80"
            />
          </label>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="bg-primary text-on-primary px-5 py-2.5 rounded-lg font-semibold shadow-[0_0_15px_rgba(221,183,255,0.2)] disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save profile'}
          </button>
          <button
            type="button"
            onClick={() => navigate('settings')}
            className="glass-panel px-5 py-2.5 rounded-lg text-on-surface-variant hover:text-primary transition-smooth"
          >
            Workspace settings
          </button>
        </div>
      </PageContent>
    </AppShell>
  );
};

export default ProfilePage;
