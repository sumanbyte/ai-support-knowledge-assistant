import type { PageType } from '../types/navigation';

export const PAGE_PATHS: Record<PageType, string> = {
  login: '/login',
  signup: '/signup',
  dashboard: '/dashboard',
  chat: '/chat',
  documents: '/documents',
  'knowledge-base': '/knowledge-base',
  ingestion: '/ingestion',
  analytics: '/analytics',
  settings: '/settings',
  profile: '/profile',
};

const PATH_TO_PAGE = Object.fromEntries(
  Object.entries(PAGE_PATHS).map(([page, path]) => [path, page]),
) as Record<string, PageType>;

export function pageFromPathname(pathname: string): PageType {
  const normalized = pathname.replace(/\/$/, '') || '/';
  if (normalized === '/') return 'login';
  return PATH_TO_PAGE[normalized] ?? 'dashboard';
}
