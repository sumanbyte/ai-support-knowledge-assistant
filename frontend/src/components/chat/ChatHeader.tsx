import React from 'react';
import { Icon } from '../UI/Icon';

interface ChatHeaderProps {
  threadTitle?: string;
  onNewChat?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  threadTitle = 'Q4 Earnings Analysis',
  onNewChat,
}) => {
  return (
    <header className="shrink-0 h-[var(--layout-topbar-height)] border-b border-outline-variant/10 bg-surface/90 backdrop-blur-xl flex items-center justify-between px-6 lg:px-8 gap-6">
      <nav className="flex items-center gap-2 min-w-0 text-sm">
        <span className="text-on-surface-variant shrink-0">AI Chat</span>
        <Icon name="chevron_right" size={18} className="text-on-surface-variant/50 shrink-0" />
        <span className="text-on-surface font-medium truncate">{threadTitle}</span>
      </nav>

      <div className="flex items-center gap-3 shrink-0">
        <div className="relative hidden sm:block w-56 lg:w-72">
          <Icon
            name="search"
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
          />
          <input
            type="text"
            placeholder="Search... (⌘K)"
            className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl py-2 pl-9 pr-3 text-on-surface text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
          />
        </div>
        {onNewChat && (
          <button
            type="button"
            onClick={onNewChat}
            className="glass-panel px-3 py-2 rounded-xl text-sm text-on-surface hover:text-primary transition-smooth flex items-center gap-2"
          >
            <Icon name="add" size={18} />
            <span className="hidden lg:inline">New Chat</span>
          </button>
        )}
      </div>
    </header>
  );
};
