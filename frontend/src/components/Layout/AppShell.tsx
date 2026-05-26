import React from 'react';
import { MAIN_NAV } from '../../config/navigation';
import { PAGE_META } from '../../config/pageMeta';
import type { PageType } from '../../types/navigation';
import { Icon } from '../UI/Icon';
import { Sidebar } from './Sidebar';
import { TopNavBar } from './TopNavBar';

interface AppShellProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  children: React.ReactNode;
  bare?: boolean;
  hideTopNav?: boolean;
  header?: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentPage,
  onNavigate,
  children,
  bare = false,
  hideTopNav = false,
  header,
}) => {
  const meta = PAGE_META[currentPage];
  const sidebarItems = MAIN_NAV.map((item) => ({
    id: item.id,
    label: item.label,
    icon: item.icon,
    active: item.id === currentPage,
  }));

  return (
    <div className="relative min-h-screen selection-primary bg-background">
      <div className="app-ambient" aria-hidden />
      <Sidebar
        items={sidebarItems}
        variant={meta.sidebarVariant}
        showNewChat={meta.showNewChat}
        onItemClick={(id) => onNavigate(id as PageType)}
        onNewChat={() => onNavigate('chat')}
        onProfileClick={() => onNavigate('profile')}
        onSettingsClick={() => onNavigate('settings')}
      />
      {!hideTopNav && (
        <TopNavBar
          searchPlaceholder={meta.searchPlaceholder}
          onProfileClick={() => onNavigate('profile')}
          showNewChat={meta.showNewChat && currentPage !== 'chat'}
          onNewChat={() => onNavigate('chat')}
        />
      )}

      <div
        className={`relative z-10 md:ml-[var(--layout-sidebar-width)] min-h-screen flex flex-col ${
          hideTopNav ? 'h-screen pt-0' : 'pt-[var(--layout-topbar-height)]'
        } ${bare ? 'overflow-hidden' : ''}`}
      >
        {!bare && header}
        <main className={bare ? 'flex-1 flex flex-col min-h-0 overflow-hidden' : 'flex-1 pb-4'}>
          {children}
        </main>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[4.25rem] glass-bg border-t border-outline-variant/20 flex items-center justify-around z-50 px-2 pb-safe">
        {(
          [
            { id: 'dashboard' as PageType, icon: 'dashboard', label: 'Home' },
            { id: 'chat' as PageType, icon: 'forum', label: 'Chat' },
            { id: 'documents' as PageType, icon: 'description', label: 'Docs' },
            { id: 'settings' as PageType, icon: 'settings', label: 'Settings' },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg ${
              currentPage === item.id ? 'text-primary' : 'text-on-surface-variant'
            }`}
          >
            <Icon name={item.icon} size={22} filled={currentPage === item.id} />
            <span className="font-label-sm text-[11px]">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};
