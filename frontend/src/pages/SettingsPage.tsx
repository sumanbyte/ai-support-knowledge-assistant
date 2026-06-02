import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/Layout';
import { PageHeader } from '../components/Layout/PageHeader';
import { PageContent } from '../components/Layout/PageContent';
import { Icon } from '../components/UI/Icon';
import { DeleteModal } from '../components/modals/DeleteModal';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import { useError } from '../hooks/useError';
import { authService } from '../services/authService';
import { toast } from '../components/toast';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [workspaceName, setWorkspaceName] = useState(user?.name ?? '');

  const {
    execute: saveProfile,
    loading: saving,
    error: saveError,
  } = useApi(authService.updateProfile);

  const {
    execute: resetWorkspace,
    loading: resetting,
    error: resetError,
  } = useApi(authService.resetWorkspace);

  useError(saveError);
  useError(resetError);

  useEffect(() => {
    if (user?.name) {
      setWorkspaceName(user.name);
    }
  }, [user?.name]);

  const handleSave = async () => {
    const trimmed = workspaceName.trim();
    if (!trimmed) {
      toast.error('Workspace name cannot be empty.');
      return;
    }
    const updated = await saveProfile({ name: trimmed });
    if (updated) {
      setUser(updated);
      toast.success('Workspace settings saved.');
    }
  };

  const handleResetWorkspace = async () => {
    const result = await resetWorkspace();
    if (result?.success) {
      toast.success(result.message);
      navigate('/dashboard');
    }
  };

  return (
    <AppShell
      header={
        <PageHeader
          title="Workspace Settings & Administration"
          subtitle="Manage your workspace identity and data."
          actions={
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !workspaceName.trim()}
              className="bg-primary text-on-primary px-4 py-2 rounded-lg font-semibold shadow-[0_0_15px_rgba(221,183,255,0.2)] disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          }
        />
      }
    >
      <PageContent className="max-w-3xl space-y-8">
        <section className="glass-panel p-7 rounded-xl">
          <h3 className="text-headline-md text-on-surface font-medium mb-4 flex items-center gap-2">
            <Icon name="business" className="text-primary" />
            Workspace
          </h3>
          <label className="block mb-4">
            <span className="font-label-sm text-on-surface-variant block mb-2">Workspace name</span>
            <input
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="w-full glass-overlay rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </label>
          <p className="text-sm text-on-surface-variant/70 mb-3">
            Uses the same display name as your profile ({user?.email ?? '—'}).
          </p>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/15 text-primary text-sm font-medium border border-primary/25">
            Enterprise Pro
          </span>
        </section>

        <section className="glass-panel p-7 rounded-xl">
          <h3 className="text-headline-md text-on-surface font-medium mb-4 flex items-center gap-2">
            <Icon name="link" className="text-primary" />
            Integrations
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Upstash', status: 'Connected', icon: 'hub' },
              { name: 'Google Gemini', status: 'Connected', icon: 'auto_awesome' },
              { name: 'Cloudinary', status: 'Active', icon: 'cloud' },
            ].map((i) => (
              <div
                key={i.name}
                className="flex items-center justify-between p-4 rounded-lg bg-surface-container-low border border-outline-variant/10"
              >
                <div className="flex items-center gap-3">
                  <Icon name={i.icon} className="text-primary" />
                  <span className="text-on-surface font-medium">{i.name}</span>
                </div>
                <span className="font-label-sm text-tertiary bg-tertiary/10 px-2 py-0.5 rounded">
                  {i.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel p-6 rounded-xl border border-error/20">
          <h3 className="text-headline-md text-error font-medium mb-2">Danger zone</h3>
          <p className="text-on-surface-variant text-sm mb-4">
            Permanently delete all documents, chat history, vector indexes, and pipeline logs.
            Your account stays active but the dashboard starts fresh.
          </p>
          <DeleteModal
            dialogId="settings-reset-workspace-dialog"
            title="Reset workspace?"
            description={
              <>
                This will permanently delete all your documents, chats, and indexing logs.
                Vector embeddings and uploaded files will be removed. This cannot be undone.
              </>
            }
            confirmLabel={resetting ? 'Resetting...' : 'Reset workspace'}
            onConfirm={handleResetWorkspace}
            trigger={
              <button
                type="button"
                disabled={resetting}
                className="text-error hover:underline text-sm font-medium disabled:opacity-50"
              >
                Reset workspace data
              </button>
            }
          />
        </section>
      </PageContent>
    </AppShell>
  );
};

export default SettingsPage;
