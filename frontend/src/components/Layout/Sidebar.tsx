import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';
import { Icon } from '../UI/Icon';

interface SidebarItem {
  id: string;
  label: string;
  icon?: string;
  active?: boolean;
}

interface SidebarProps {
  items: SidebarItem[];
  onItemClick?: (id: string) => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  onItemClick,
  onProfileClick,
  onSettingsClick,
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const displayName = user?.name ?? 'User';

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [menuOpen]);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate('/login');
  };

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 w-[var(--layout-sidebar-width)] h-full z-40 bg-surface border-r border-outline-variant/10 py-8 px-5 gap-5">
      <div className="flex items-center gap-3.5 px-1">
        <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center shrink-0">
          <Icon name="dataset" className="text-on-primary-container" filled size={22} />
        </div>
        <div>
          <h1 className="font-display text-lg font-bold text-primary leading-tight">Converse AI</h1>
          <p className="font-label-sm text-on-surface-variant text-[11px] tracking-wider uppercase mt-0.5">
            Enterprise RAG
          </p>
        </div>
      </div>

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
          onClick={onSettingsClick}
          className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 text-sm"
        >
          <Icon name="settings" size={20} />
          Settings
        </button>

        <div ref={menuRef} className="relative">
          {menuOpen && (
            <div
              className="absolute bottom-full right-0 mb-2 min-w-[10.5rem] rounded-xl border border-outline-variant/20 bg-surface-container-high shadow-lg py-1 z-50"
              role="menu"
            >
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error-container/20 transition-colors"
              >
                <Icon name="logout" size={18} />
                Log out
              </button>
            </div>
          )}

          <div className="flex items-center gap-1 rounded-xl hover:bg-surface-container-high/50 transition-smooth">
            <button
              type="button"
              onClick={onProfileClick}
              className="flex flex-1 min-w-0 items-center gap-3.5 px-3 py-2.5"
            >
              <div className="w-9 h-9 rounded-full bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center shrink-0">
                <Icon name="person" size={18} className="text-on-surface-variant" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="truncate text-on-surface text-sm font-medium">{displayName}</p>
                <p className="truncate font-label-sm text-on-surface-variant text-[11px] mt-0.5">
                  {user?.email ?? 'Admin'}
                </p>
              </div>
            </button>
            <button
              type="button"
              aria-label="Account menu"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              onClick={() => setMenuOpen((open) => !open)}
              className="shrink-0 p-2.5 mr-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/80"
            >
              <Icon name="more_vert" size={18} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

Sidebar.displayName = 'Sidebar';
