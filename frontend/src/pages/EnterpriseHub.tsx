import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LiveTerminal } from '../components/dashboard/LiveTerminal';
import { StatCard } from '../components/dashboard/StatCard';
import { AppShell } from '../components/Layout';
import { PageHeader } from '../components/Layout/PageHeader';
import { PageContent } from '../components/Layout/PageContent';
import { Icon } from '../components/UI/Icon';
import { LoadingSpinner } from '../components/UI/Loading';
import { useAppNavigate } from '../hooks/useAppNavigate';
import { useApi } from '../hooks/useApi';
import { useError } from '../hooks/useError';
import type { DocumentAnalyticsResponseDto, PaginatedChatDto } from '../api';
import { analyticsService } from '../services/analyticsService';
import { chatService } from '../services/chatService';
import { formatRelativeTime } from '../utils/format-time';

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" aria-busy="true">
      <div className="lg:col-span-8 flex flex-col gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="glass-panel p-7 rounded-xl h-36 animate-pulse bg-surface-container-high/40" />
          ))}
        </div>
        <div className="glass-panel p-6 rounded-xl h-48 animate-pulse bg-surface-container-high/40" />
      </div>
      <div className="lg:col-span-4 flex flex-col gap-8">
        <div className="glass-panel rounded-xl h-64 animate-pulse bg-surface-container-high/40" />
        <div className="glass-panel p-7 rounded-xl flex-1 min-h-[240px] animate-pulse bg-surface-container-high/40" />
      </div>
    </div>
  );
}

export const EnterpriseHub: React.FC = () => {
  const go = useAppNavigate();

  const { data: analytics, execute: fetchAnalytics, loading: analyticsLoading, error: analyticsError } =
    useApi<DocumentAnalyticsResponseDto, []>(analyticsService.getDocumentsAnalytics);

  const { data: chatHistory, execute: fetchChatHistory, loading: chatsLoading, error: chatsError } =
    useApi<PaginatedChatDto, [number, number]>((page, limit) => chatService.getChatHistory(page, limit));

  useError(analyticsError);
  useError(chatsError);

  useEffect(() => {
    fetchAnalytics();
    fetchChatHistory(1, 5);
  }, [fetchAnalytics, fetchChatHistory]);

  const isLoading =
    (analyticsLoading && !analytics) || (chatsLoading && !chatHistory);

  const recentChats = chatHistory?.data ?? [];

  return (
    <AppShell
      header={
        <PageHeader
          title="Mission Control"
          subtitle="System status, index health, and recent conversations."
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
        {isLoading ? (
          <DashboardSkeleton />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 flex flex-col gap-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
                <StatCard
                  label="Total Entries"
                  value={String(analytics?.totalDocuments ?? 0)}
                  icon="menu_book"
                  badge="Documents"
                  badgeClass="text-tertiary bg-tertiary/10"
                />
                <StatCard
                  label="Avg Relevance"
                  value={String(analytics?.averageRelevanceScore ?? 0)}
                  unit="%"
                  icon="star"
                  badge="Indexed corpus"
                  badgeClass="text-secondary bg-secondary/10"
                  accent="secondary"
                />
                <StatCard
                  label="Index Size"
                  value={String(analytics?.indexSize ?? 0)}
                  unit="MB"
                  icon="storage"
                  badge={`${analytics?.dimension ?? 0}d vectors`}
                  badgeClass="text-on-surface-variant bg-surface-container"
                  accent="neutral"
                />
              </div>

              <div className="glass-panel p-6 rounded-xl">
                <h3 className="text-headline-md text-on-surface font-medium mb-4">
                  Vector Index Health
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Dimensions', value: analytics?.dimension ?? 0 },
                    { label: 'Query Latency', value: `${analytics?.averageQueryLatency ?? 0}ms` },
                    { label: 'Namespaces', value: analytics?.namespaces ?? 0 },
                    { label: 'Uptime', value: `${analytics?.uptimePercentage ?? 0}%` },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="text-center p-4 bg-surface-container-low rounded-lg border border-outline-variant/10"
                    >
                      <p className="font-label-sm text-on-surface-variant mb-1">{item.label}</p>
                      <p className="text-xl font-semibold text-primary">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-8">
              <LiveTerminal />

              <div className="glass-panel p-7 rounded-xl flex-1 flex flex-col min-h-[240px]">
                <h3 className="font-display text-headline-md text-on-surface mb-5 pb-4 border-b border-outline-variant/10">
                  Recent Chats
                </h3>
                <div className="flex flex-col gap-3.5 flex-1 overflow-y-auto terminal-scroll pr-1">
                  {chatsLoading && !recentChats.length ? (
                    <LoadingSpinner message="Loading chats..." size="sm" className="py-8" />
                  ) : recentChats.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <Icon name="forum" size={36} className="text-on-surface-variant/40 mb-3" />
                      <p className="text-sm text-on-surface-variant">No conversations yet</p>
                      <button
                        type="button"
                        onClick={() => go('chat')}
                        className="mt-3 text-sm text-primary hover:underline"
                      >
                        Start a chat
                      </button>
                    </div>
                  ) : (
                    recentChats.map((chat) => (
                      <Link
                        key={chat.id}
                        to={`/chat/${chat.id}`}
                        className="p-4 rounded-xl bg-surface-container-low/50 border border-outline-variant/10 hover:border-primary/30 transition-all text-left group block"
                      >
                        <div className="flex justify-between items-start mb-2 gap-3">
                          <h4 className="text-on-surface font-medium text-sm group-hover:text-primary transition-colors truncate">
                            {chat.name}
                          </h4>
                          <span className="font-label-sm text-on-surface-variant/60 shrink-0">
                            {formatRelativeTime(chat.updatedAt)}
                          </span>
                        </div>
                        <p className="text-on-surface-variant text-sm line-clamp-1">
                          {chat.chatMessages[0]?.content ?? 'No messages yet'}
                        </p>
                        <span className="font-label-sm text-on-surface-variant/50 mt-2 inline-flex items-center gap-1">
                          <Icon name="chat_bubble_outline" size={13} />
                          {chat.messageCount} messages
                        </span>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </PageContent>
    </AppShell>
  );
};

export default EnterpriseHub;
