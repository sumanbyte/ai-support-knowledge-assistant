import React, { useState } from 'react';
import { AppShell } from '../components/Layout';
import { PageHeader } from '../components/Layout/PageHeader';
import { PageContent } from '../components/Layout/PageContent';
import { Icon } from '../components/UI/Icon';
export const SettingsPage: React.FC = () => {
  const [workspaceName, setWorkspaceName] = useState('Acme Corp Enterprise');
  const [ragEnabled, setRagEnabled] = useState(true);
  const [streamingEnabled, setStreamingEnabled] = useState(true);

  return (
    <AppShell
      header={
        <PageHeader
          title="Workspace Settings & Administration"
          subtitle="Integrations, AI configuration, and workspace policies."
          actions={
            <button
              type="button"
              className="bg-primary text-on-primary px-4 py-2 rounded-lg font-semibold shadow-[0_0_15px_rgba(221,183,255,0.2)]"
            >
              Save Changes
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
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/15 text-primary text-sm font-medium border border-primary/25">
            Enterprise Pro
          </span>
        </section>

        {/* <section className="glass-panel p-6 rounded-xl space-y-5">
          <h3 className="text-headline-md text-on-surface font-medium flex items-center gap-2">
            <Icon name="psychology" className="text-primary" />
            AI & RAG
          </h3>
          {[
            {
              label: 'RAG retrieval',
              desc: 'Ground responses in indexed documents',
              checked: ragEnabled,
              onChange: setRagEnabled,
            },
            {
              label: 'Streaming responses',
              desc: 'Show tokens as they generate',
              checked: streamingEnabled,
              onChange: setStreamingEnabled,
            },
          ].map((item) => (
            <label
              key={item.label}
              className="flex items-center justify-between gap-4 cursor-pointer p-3 rounded-lg hover:bg-surface-container-high/30 transition-colors"
            >
              <div>
                <p className="text-on-surface font-medium">{item.label}</p>
                <p className="text-on-surface-variant text-sm">{item.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={item.checked}
                onChange={(e) => item.onChange(e.target.checked)}
                className="w-5 h-5 accent-[#b76dff] rounded"
              />
            </label>
          ))}
          <label className="block">
            <span className="font-label-sm text-on-surface-variant block mb-2">Vector namespace</span>
            <input
              defaultValue="sales-q3"
              className="w-full glass-overlay rounded-lg px-4 py-2.5 text-on-surface font-mono text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </label>
        </section> */}

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
            Permanently delete workspace data and vector indexes.
          </p>
          <button type="button" className="text-error hover:underline text-sm font-medium">
            Delete workspace
          </button>
        </section>
      </PageContent>
    </AppShell>
  );
};

export default SettingsPage;
