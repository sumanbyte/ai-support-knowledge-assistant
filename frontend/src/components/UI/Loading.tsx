import React from 'react';
import { Icon } from './Icon';

function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-lg bg-surface-container-high/80 animate-pulse ${className}`}
      aria-hidden
    />
  );
}

export function LoadingSpinner({
  message = 'Loading...',
  size = 'md',
  className = '',
}: {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const iconSize = size === 'sm' ? 22 : size === 'lg' ? 40 : 28;
  const pad = size === 'sm' ? 'py-8' : size === 'lg' ? 'py-20' : 'py-14';

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${pad} ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="relative flex items-center justify-center">
        <div className="absolute w-14 h-14 rounded-full border border-primary/20 animate-ping-slow opacity-40" />
        <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center ai-glow-sm">
          <Icon name="progress_activity" size={iconSize} className="text-primary animate-spin" />
        </div>
      </div>
      {message && (
        <p className="text-sm text-on-surface-variant/80 font-medium">{message}</p>
      )}
    </div>
  );
}

export function ChatMessagesLoader() {
  return (
    <div className="flex flex-col gap-8 py-8" aria-busy="true" aria-label="Loading messages">
      <div className="flex justify-end">
        <Skeleton className="h-14 w-[min(100%,16rem)] rounded-2xl rounded-tr-md" />
      </div>
      <div className="flex items-start gap-3 max-w-[min(100%,46rem)]">
        <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2 min-w-0">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-24 w-full max-w-md rounded-2xl rounded-tl-md" />
        </div>
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-12 w-[min(100%,12rem)] rounded-2xl rounded-tr-md" />
      </div>
      <div className="flex items-start gap-3 max-w-[min(100%,46rem)]">
        <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2 min-w-0">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-16 w-full max-w-sm rounded-2xl rounded-tl-md" />
        </div>
      </div>
      <LoadingSpinner message="Loading conversation..." size="sm" className="py-2" />
    </div>
  );
}

export function ChatHistoryLoader() {
  return (
    <div className="flex flex-col gap-2.5 px-5 py-6" aria-busy="true" aria-label="Loading chat history">
      <Skeleton className="h-3 w-32 mb-2" />
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="rounded-xl p-4 border border-outline-variant/10 bg-surface-container-low/30 flex gap-3"
        >
          <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between gap-2">
              <Skeleton className="h-4 w-2/5" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DocumentGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
      aria-busy="true"
      aria-label="Loading documents"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="glass-panel rounded-xl p-4 flex flex-col gap-4 border border-outline-variant/10"
        >
          <div className="flex items-start gap-3">
            <Skeleton className="w-4 h-4 rounded shrink-0 mt-1" />
            <Skeleton className="w-10 h-10 rounded shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <div className="pt-3 border-t border-outline-variant/10 flex justify-between">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-3 w-14" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function KnowledgeBaseLoader() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading knowledge base">
      <Skeleton className="h-12 w-full max-w-xl rounded-lg" />
      <div className="flex flex-wrap gap-2">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="glass-panel p-5 rounded-xl flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-16" />
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {[0, 1, 2, 4].map((i) => (
          <div key={i} className="glass-panel rounded-xl p-5 space-y-3">
            <div className="flex justify-between gap-4">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="h-8 w-12" />
            </div>
            <Skeleton className="h-1.5 w-full rounded-full" />
          </div>
        ))}
      </div>
      <div className="glass-panel p-6 rounded-xl space-y-4">
        <Skeleton className="h-5 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      </div>
      <LoadingSpinner message="Loading knowledge base..." size="sm" className="py-2" />
    </div>
  );
}
