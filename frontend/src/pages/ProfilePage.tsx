import React, { useState } from 'react';
import { AppShell } from '../components/Layout';
import { PageHeader } from '../components/Layout/PageHeader';
import { PageContent } from '../components/Layout/PageContent';
import { Icon } from '../components/UI/Icon';
import { useAppNavigate } from '../hooks/useAppNavigate';

export const ProfilePage: React.FC = () => {
  const navigate = useAppNavigate();
  const [name, setName] = useState('Alex Chen');
  const [email, setEmail] = useState('alex.chen@acme.com');
  const [notifications, setNotifications] = useState(true);

  return (
    <AppShell
      header={
        <PageHeader
          title="User Profile & Preferences"
          subtitle="Account settings and notification preferences."
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
              <h2 className="text-headline-lg text-on-surface font-semibold">{name}</h2>
              <span className="inline-block mt-1 text-xs font-mono px-2 py-0.5 rounded-full bg-secondary/15 text-secondary border border-secondary/25">
                Admin
              </span>
              <p className="text-on-surface-variant mt-2">{email}</p>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full glass-overlay rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </label>
        </div>

        <div className="glass-panel p-6 rounded-xl">
          <h3 className="text-headline-md text-on-surface font-medium mb-4">Preferences</h3>
          <label className="flex items-center justify-between gap-4 cursor-pointer p-3 rounded-lg hover:bg-surface-container-high/30">
            <div>
              <p className="text-on-surface font-medium">Email notifications</p>
              <p className="text-on-surface-variant text-sm">Pipeline and indexing alerts</p>
            </div>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="w-5 h-5 accent-[#b76dff]"
            />
          </label>
          <label className="block mt-4">
            <span className="font-label-sm text-on-surface-variant block mb-2">Default landing page</span>
            <select className="w-full glass-overlay rounded-lg px-4 py-2.5 text-on-surface bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50">
              <option>Mission Control</option>
              <option>AI Chat</option>
              <option>Document Library</option>
            </select>
          </label>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            className="bg-primary text-on-primary px-5 py-2.5 rounded-lg font-semibold shadow-[0_0_15px_rgba(221,183,255,0.2)]"
          >
            Save profile
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
