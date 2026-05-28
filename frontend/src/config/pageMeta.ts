import type { PageType } from '../types/navigation';

export interface PageMeta {
  searchPlaceholder: string;
  showNewChat: boolean;
}

export const PAGE_META: Record<PageType, PageMeta> = {
  dashboard: {
    searchPlaceholder: 'Search knowledge base or chats... (⌘K)',
    showNewChat: true,
  },
  chat: {
    searchPlaceholder: 'Search... (⌘K)',
    showNewChat: false,
  },
  'knowledge-base': {
    searchPlaceholder: 'Search Knowledge Base...',
    showNewChat: false,
  },
  documents: {
    searchPlaceholder: 'Search documents...',
    showNewChat: false,
  },
  ingestion: {
    searchPlaceholder: 'Search knowledge base...',
    showNewChat: false,
  },
  analytics: {
    searchPlaceholder: 'Search analytics...',
    showNewChat: false,
  },
  settings: {
    searchPlaceholder: 'Search settings...',
    showNewChat: false,
  },
  profile: {
    searchPlaceholder: 'Search...',
    showNewChat: false,
  },
  login: {
    searchPlaceholder: '',
    showNewChat: false,
  },
  signup: {
    searchPlaceholder: '',
    showNewChat: false,
  },
};
