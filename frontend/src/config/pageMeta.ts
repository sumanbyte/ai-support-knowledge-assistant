import type { PageType } from '../types/navigation';

export type SidebarVariant = 'hub' | 'rag';

export interface PageMeta {
  searchPlaceholder: string;
  sidebarVariant: SidebarVariant;
  showNewChat: boolean;
}

export const PAGE_META: Record<PageType, PageMeta> = {
  dashboard: {
    searchPlaceholder: 'Search knowledge base or chats... (⌘K)',
    sidebarVariant: 'hub',
    showNewChat: true,
  },
  chat: {
    searchPlaceholder: 'Search... (⌘K)',
    sidebarVariant: 'hub',
    showNewChat: true,
  },
  'knowledge-base': {
    searchPlaceholder: 'Search Knowledge Base...',
    sidebarVariant: 'rag',
    showNewChat: false,
  },
  documents: {
    searchPlaceholder: 'Search documents...',
    sidebarVariant: 'rag',
    showNewChat: false,
  },
  ingestion: {
    searchPlaceholder: 'Search knowledge base...',
    sidebarVariant: 'rag',
    showNewChat: false,
  },
  analytics: {
    searchPlaceholder: 'Search analytics...',
    sidebarVariant: 'rag',
    showNewChat: false,
  },
  settings: {
    searchPlaceholder: 'Search settings...',
    sidebarVariant: 'rag',
    showNewChat: false,
  },
  profile: {
    searchPlaceholder: 'Search...',
    sidebarVariant: 'rag',
    showNewChat: false,
  },
  login: {
    searchPlaceholder: '',
    sidebarVariant: 'hub',
    showNewChat: false,
  },
  signup: {
    searchPlaceholder: '',
    sidebarVariant: 'hub',
    showNewChat: false,
  },
};

