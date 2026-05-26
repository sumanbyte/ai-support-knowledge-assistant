import React from 'react';
import { Icon } from '../UI/Icon';

interface TopNavBarProps {
  searchPlaceholder?: string;
  onProfileClick?: () => void;
  showNewChat?: boolean;
  onNewChat?: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  searchPlaceholder = 'Search knowledge base or chats... (⌘K)',
  onProfileClick,
  showNewChat = false,
  onNewChat,
}) => {
  return (
    <nav className="fixed top-0 right-0 left-0 md:left-[var(--layout-sidebar-width)] h-[var(--layout-topbar-height)] z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10 flex items-center justify-between px-5 lg:px-10 gap-6">
      <div className="flex-1 max-w-2xl hidden md:flex items-center">
        <div className="relative w-full group">
          <Icon
            name="search"
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
          />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl py-2.5 pl-11 pr-16 text-on-surface text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
            <kbd className="font-label-sm text-[11px] text-on-surface-variant bg-surface-dim px-2 py-1 rounded-md border border-outline-variant/30">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      <div className="md:hidden flex items-center gap-2.5">
        <Icon name="dataset" className="text-primary" filled size={24} />
        <span className="font-bold text-primary text-lg">Converse AI</span>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button
          type="button"
          className="p-2.5 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 transition-smooth relative"
          aria-label="Notifications"
        >
          <Icon name="notifications" size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
        </button>
        <button
          type="button"
          className="p-2.5 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 transition-smooth hidden sm:flex"
          aria-label="Help"
        >
          <Icon name="help_outline" size={22} />
        </button>
        {showNewChat && onNewChat && (
          <button
            type="button"
            onClick={onNewChat}
            className="hidden sm:flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-xl text-sm font-medium ml-1"
          >
            <Icon name="add" size={18} />
            New Chat
          </button>
        )}
        {!showNewChat && (
          <button
            type="button"
            className="hidden sm:flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary/20 ml-1"
          >
            <Icon name="share" size={18} />
            Share
          </button>
        )}
        <button
          type="button"
          onClick={onProfileClick}
          className="w-9 h-9 rounded-full bg-surface-container-highest border border-outline-variant/30 ml-1 flex items-center justify-center hover:ring-2 hover:ring-primary/30"
          aria-label="Profile"
        >
          <Icon name="person" size={20} className="text-on-surface-variant" />
        </button>
      </div>
    </nav>
  );
};
