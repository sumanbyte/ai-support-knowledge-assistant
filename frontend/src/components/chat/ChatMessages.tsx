import React from 'react';
import { Icon } from '../UI/Icon';

export type ChatMsg =
  | { id: string; type: 'separator'; label: string }
  | { id: string; type: 'user'; content: string; timestamp: string }
  | {
    id: string;
    type: 'ai';
    content: string;
    timestamp: string;
    citations?: number[];
    isStreaming?: boolean;
    isLoading?: boolean;
  };

interface ChatMessagesProps {
  messages: ChatMsg[];
  topSlot?: React.ReactNode;
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[\d+\])/g);
  return parts.map((part, j) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return (
        <strong key={j} className="text-on-surface font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (/^\[\d+\]$/.test(part)) {
      return (
        <sup key={j} className="text-primary hover:underline cursor-pointer font-label-sm ml-0.5">
          {part}
        </sup>
      );
    }
    return <span key={j}>{part}</span>;
  });
}

function renderAiContent(content: string) {
  const lines = content.split('\n');
  const items: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    if (line.startsWith('• ')) {
      items.push(
        <li key={i} className="ml-5 pl-1 list-disc marker:text-primary/60">
          {renderInline(line.slice(2))}
        </li>
      );
      return;
    }
    if (!line.trim()) return;
    items.push(
      <p key={i} className="leading-relaxed">
        {renderInline(line)}
      </p>
    );
  });

  return <div className="text-on-surface text-[15px] leading-relaxed space-y-3">{items}</div>;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, topSlot }) => {

  return (
    <div className="flex flex-col gap-8 py-8">
      {topSlot}
      {messages.map((msg) => {
        if (msg.type === 'separator') {
          return (
            <div key={msg.id} className="flex justify-center py-1">
              <span className="font-label-sm text-on-surface-variant/80 bg-surface-container-low px-4 py-1.5 rounded-full border border-outline-variant/15">
                {msg.label}
              </span>
            </div>
          );
        }

        if (msg.type === 'user') {
          return (
            <div key={msg.id} className="flex justify-end">
              <div className="max-w-[min(100%,42rem)] bg-surface-container-high text-on-surface px-5 py-4 rounded-2xl rounded-tr-md border border-outline-variant/15 shadow-md">
                <p className="text-[15px] leading-relaxed">{msg.content}</p>
              </div>
            </div>
          );
        }

        return (
          <div key={msg.id} className="flex items-start gap-3 max-w-[min(100%,46rem)]">
            <div
              className={`w-9 h-9 rounded-lg bg-primary/10 border flex items-center justify-center shrink-0 mt-0.5 ${msg.isStreaming ? 'border-primary/50 ai-glow-sm' : 'border-primary/25'
                }`}
            >
              <Icon name="auto_awesome" size={18} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-label-sm text-on-surface-variant">
                <span className="text-on-surface-variant">Converse AI</span>
                <span className="opacity-40">•</span>
                <span>{msg.timestamp}</span>
                {msg.isLoading && (
                  <>
                    <span className="opacity-40">•</span>
                    <span className="text-primary inline-flex items-center gap-1">
                      <Icon name="progress_activity" size={14} className="animate-spin" />
                      Generating...
                    </span>
                  </>
                )}
              </div>
              <div className="glass-panel rounded-2xl rounded-tl-md px-5 py-4 border border-outline-variant/10">
                {msg.content ? renderAiContent(msg.content) : null}
                {msg.isLoading && !msg.content && (
                  <span className="typing-indicator inline-flex align-middle">
                    <span />
                    <span />
                    <span />
                  </span>
                )}
              </div>
              {!msg.isStreaming && msg.content && (
                <div className="flex items-center gap-0.5 text-on-surface-variant pl-1">
                  {['content_copy', 'thumb_up', 'thumb_down', 'refresh'].map((action) => (
                    <button
                      key={action}
                      type="button"
                      className="p-2 rounded-lg hover:bg-surface-container-high hover:text-primary transition-smooth"
                      aria-label={action}
                    >
                      <Icon name={action} size={17} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
