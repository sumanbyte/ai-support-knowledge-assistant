export type PageType =
  | 'dashboard'
  | 'chat'
  | 'documents'
  | 'knowledge-base'
  | 'ingestion'
  | 'analytics'
  | 'settings'
  | 'profile';

export interface NavItem {
  id: PageType | 'support';
  label: string;
  icon: string;
  badge?: number;
}
