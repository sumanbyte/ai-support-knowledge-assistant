export type PageType =
  | 'login'
  | 'signup'
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
