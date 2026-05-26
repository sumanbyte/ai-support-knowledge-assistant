import React from 'react';
import { TERMINAL_LOGS } from '../../data/mockData';
import { cn } from '../../utils/cn';

const levelColors: Record<string, string> = {
  INFO: 'text-secondary',
  WARN: 'text-tertiary',
  SUCCESS: 'text-green-400',
};

export const LiveTerminal: React.FC = () => {
  return (
    <div className="glass-panel rounded-xl flex flex-col overflow-hidden h-[300px]">
      <div className="bg-surface-container-low px-5 py-3 border-b border-outline-variant/10 flex justify-between items-center">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-error/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-tertiary/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        </div>
        <span className="font-label-sm text-on-surface-variant flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Live Indexing Log
        </span>
      </div>
      <div className="p-5 bg-[#0a0a0c] flex-1 overflow-y-auto terminal-scroll font-label-sm text-on-surface-variant/80 space-y-2">
        {TERMINAL_LOGS.map((log, i) => (
          <div key={i} className="flex gap-1">
            <span className="text-primary w-24 shrink-0">[{log.time}]</span>
            <span className={cn(levelColors[log.level] ?? 'text-on-surface-variant')}>
              {log.level}:
            </span>
            <span>{log.message}</span>
          </div>
        ))}
        <div className="flex opacity-50">
          <span className="text-primary w-24 shrink-0">&gt;_</span>
          <span className="animate-pulse">_</span>
        </div>
      </div>
    </div>
  );
};
