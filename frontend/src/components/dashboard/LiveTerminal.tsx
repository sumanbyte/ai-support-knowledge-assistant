import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { io } from 'socket.io-client';
import { useApi } from '../../hooks/useApi';
import { documentService } from '../../services/documentService';
import { useError } from '../../hooks/useError';
import { useAuth } from '../../context/AuthContext';
import type { LogMessage } from '../../services/documentService';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export const LiveTerminal: React.FC = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data: logsData, error, loading, execute } = useApi<LogMessage[], []>(
    () => documentService.getLogsHistory(),
  );

  useError(error);

  useEffect(() => {
    execute();
  }, [execute]);

  useEffect(() => {
    if (!logsData) return;
    setLogs([...logsData].reverse());
  }, [logsData]);

  useEffect(() => {
    if (!user?.id) return;

    const socket = io(`${API_BASE}/logger`, {
      transports: ['websocket'],
      withCredentials: true,
      query: { userId: user.id },
    });

    socket.on('new-log', (log: LogMessage) => {
      setLogs((prev) => [...prev.slice(-99), log]);
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.id]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [logs]);

  const getLogColorClass = (type: LogMessage['type']) => {
    switch (type) {
      case 'success':
        return 'text-green-400 font-medium';
      case 'error':
        return 'text-error font-bold';
      case 'warn':
        return 'text-tertiary font-medium';
      case 'system':
        return 'text-cyan-400 italic';
      case 'info':
      default:
        return 'text-secondary';
    }
  };

  const showEmpty = !loading && logs.length === 0;

  return (
    <div className="glass-panel rounded-xl flex flex-col overflow-hidden h-[300px] max-h-[300px] w-full">
      <div className="bg-surface-container-low px-5 py-3 border-b border-outline-variant/10 flex justify-between items-center shrink-0">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-error/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-tertiary/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        </div>
        <span className="font-label-sm text-on-surface-variant flex items-center gap-1 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Live Indexing Log
        </span>
      </div>

      <div
        ref={scrollContainerRef}
        className="p-5 bg-[#0a0a0c] flex-1 min-h-0 overflow-y-auto overscroll-contain terminal-scroll font-mono text-[11px] text-on-surface-variant/80 space-y-1.5"
      >
        {loading && logs.length === 0 ? (
          <div className="text-on-surface-variant/40 italic select-none animate-pulse">
            Loading log history...
          </div>
        ) : showEmpty ? (
          <div className="text-on-surface-variant/40 italic select-none">
            ⚡ Awaiting live pipeline vector indexing updates from cluster stream...
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex gap-2 items-start leading-relaxed">
              <span className="text-primary shrink-0 opacity-70">[{log.timestamp}]</span>
              <span
                className={cn(
                  'shrink-0 uppercase font-bold tracking-wider text-[10px]',
                  getLogColorClass(log.type),
                )}
              >
                {log.type}:
              </span>
              <span className="text-zinc-200 flex-1 break-words">{log.message}</span>
            </div>
          ))
        )}

        <div className="flex opacity-50 pt-1">
          <span className="text-primary w-12 shrink-0">&gt;_</span>
          <span className="animate-pulse bg-primary w-1.5 h-3.5 inline-block" />
        </div>
      </div>
    </div>
  );
};
