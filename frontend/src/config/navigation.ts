import type { NavItem, PageType } from '../types/navigation';

export const MAIN_NAV: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'chat', label: 'AI Chat', icon: 'chat_bubble', badge: 3 },
  { id: 'knowledge-base', label: 'Knowledge Base', icon: 'database', badge: 48 },
  { id: 'documents', label: 'Documents', icon: 'description', badge: 12 },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

export function isNavigablePage(id: string): id is PageType {
  return MAIN_NAV.some((item) => item.id === id) || id === 'profile';
}
