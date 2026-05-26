import React from 'react';
import { cn } from '../../utils/cn';
import type { SidebarVariant } from '../../config/pageMeta';
import { Icon } from '../UI/Icon';

interface SidebarItem {
  id: string;
  label: string;
  icon?: string;
  active?: boolean;
}

interface SidebarProps {
  items: SidebarItem[];
  variant?: SidebarVariant;
  showNewChat?: boolean;
  onItemClick?: (id: string) => void;
  onNewChat?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  variant = 'hub',
  showNewChat = true,
  onItemClick,
  onNewChat,
  onProfileClick,
  onSettingsClick,
}) => {
  const isRag = variant === 'rag';

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 w-[var(--layout-sidebar-width)] h-full z-40 bg-surface border-r border-outline-variant/10 py-8 px-5 gap-5">
      <div className="flex items-center gap-3.5 px-1">
        <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center shrink-0">
          <Icon name={isRag ? 'dataset' : 'chat_bubble'} className="text-on-primary-container" filled size={22} />
        </div>
        <div>
          <h1 className="font-display text-lg font-bold text-primary leading-tight py-10">Converse AI</h1>
          <p className="font-label-sm text-on-surface-variant text-[11px] tracking-wider uppercase mt-0.5">
            {isRag ? 'Enterprise RAG' : 'Enterprise Hub'}
          </p>
        </div>
      </div>

      {showNewChat && onNewChat && (
        <button
          type="button"
          onClick={onNewChat}
          className="w-full mb-8 py-2 px-5 rounded-xl bg-primary text-on-primary font-medium flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] shadow-[0_0_15px_rgba(221,183,255,0.25)]"
        >
          <Icon name="add" size={20} />
          New Chat
        </button>
      )}

      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto pr-1">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onItemClick?.(item.id)}
            className={cn(
              'w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all text-[15px] font-medium',
              item.active
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high/60 hover:text-on-surface'
            )}
          >
            {item.icon && (
              <Icon
                name={item.icon}
                size={22}
                filled={item.active}
                className="shrink-0"
              />
            )}
            <span className="flex-1 text-left">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-outline-variant/10 space-y-1.5">
        {isRag ? (
          <>
            <button
              type="button"
              className="w-full py-3 rounded-xl border border-outline-variant/30 text-primary text-sm font-medium hover:bg-primary/10 transition-smooth flex items-center justify-center gap-2"
            >
              <Icon name="bolt" size={18} />
              Upgrade Plan
            </button>
            <button
              type="button"
              className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 text-sm"
            >
              <Icon name="contact_support" size={20} />
              Support
            </button>
            <button
              type="button"
              className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 text-sm"
            >
              <Icon name="logout" size={20} />
              Log Out
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={onSettingsClick}
              className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 text-sm"
            >
              <Icon name="settings" size={20} />
              Settings
            </button>
            <button
              type="button"
              onClick={onProfileClick}
              className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl hover:bg-surface-container-high/50 transition-smooth"
            >
              <div className="w-9 h-9 rounded-full bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center shrink-0">
                <Icon name="person" size={18} className="text-on-surface-variant" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="truncate text-on-surface text-sm font-medium">Alex Mercer</p>
                {!isRag && (
                  <p className="truncate font-label-sm text-on-surface-variant text-[11px] mt-0.5">Admin</p>
                )}
              </div>
              <Icon name="more_vert" size={18} className="text-on-surface-variant shrink-0" />
            </button>
          </>
        )}
      </div>
    </aside>
  );
};

Sidebar.displayName = 'Sidebar';
