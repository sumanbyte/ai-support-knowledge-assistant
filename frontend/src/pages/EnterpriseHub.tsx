import React from 'react';
import { LiveTerminal } from '../components/dashboard/LiveTerminal';
import { ProcessingPipeline } from '../components/dashboard/ProcessingPipeline';
import { StatCard } from '../components/dashboard/StatCard';
import { AppShell } from '../components/Layout';
import { PageHeader } from '../components/Layout/PageHeader';
import { PageContent } from '../components/Layout/PageContent';
import { Icon } from '../components/UI/Icon';
import { RECENT_CHATS } from '../data/mockData';
import type { PageType } from '../types/navigation';

interface EnterpriseHubProps {
  onNavigate?: (page: PageType) => void;
}

export const EnterpriseHub: React.FC<EnterpriseHubProps> = ({ onNavigate }) => {
  const go = (p: PageType) => onNavigate?.(p);

  return (
    <AppShell
      currentPage="dashboard"
      onNavigate={(p) => onNavigate?.(p)}
      header={
        <PageHeader
          title="Mission Control"
          subtitle="System status, active pipelines, and recent knowledge insights."
          actions={
            <>

              <button
                type="button"
                onClick={() => go('documents')}
                className="glass-panel text-on-surface px-5 py-2.5 rounded-xl hover:bg-surface-container transition-colors flex items-center gap-2.5 text-sm"
              >
                <Icon name="upload" size={18} />
                Import Data
              </button>
              <button
                type="button"
                onClick={() => go('chat')}
                className="bg-primary/10 text-primary border border-primary/20 px-5 py-2.5 rounded-xl hover:bg-primary/20 transition-colors flex items-center gap-2.5 text-sm font-medium"
              >
                <Icon name="bolt" size={18} />
                Quick Action
              </button>
            </>
          }
        />
      }
    >
      <PageContent>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
              <StatCard
                label="Knowledge Base"
                value="2.4m"
                unit="vectors"
                icon="database"
                badge="Healthy"
              />
              <StatCard
                label="Inference Latency"
                value="94"
                unit="ms"
                icon="speed"
                badge="Avg 1.2s"
                badgeClass="text-secondary bg-secondary/10"
                accent="secondary"
              />
              <StatCard
                label="Active Sessions"
                value="1,842"
                icon="chat"
                badge="+12%"
                badgeClass="text-on-surface-variant bg-surface-container"
                accent="neutral"
              />
            </div>
            <ProcessingPipeline onViewAll={() => go('ingestion')} />
          </div>

          <div className="lg:col-span-4 flex flex-col gap-8">
            <LiveTerminal />
            <div className="glass-panel p-7 rounded-xl flex-1 flex flex-col min-h-[240px]">
              <h3 className="font-display text-headline-md text-on-surface mb-5 pb-4 border-b border-outline-variant/10">
                Recent Chats
              </h3>
              <div className="flex flex-col gap-3.5 flex-1 overflow-y-auto terminal-scroll pr-1">
                {RECENT_CHATS.map((chat) => (
                  <button
                    key={chat.id}
                    type="button"
                    onClick={() => go('chat')}
                    className="p-4 rounded-xl bg-surface-container-low/50 border border-outline-variant/10 hover:border-primary/30 transition-all text-left group"
                  >
                    <div className="flex justify-between items-start mb-2 gap-3">
                      <h4 className="text-on-surface font-medium text-sm group-hover:text-primary transition-colors">
                        {chat.title}
                      </h4>
                      <span className="font-label-sm text-on-surface-variant/60 shrink-0">
                        {chat.time}
                      </span>
                    </div>
                    <p className="text-on-surface-variant text-sm line-clamp-1">{chat.preview}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageContent>
    </AppShell>
  );
};

export default EnterpriseHub;
