import React, { useEffect, useMemo, useState } from 'react';
import { AppShell } from '../components/Layout';
import { PageHeader } from '../components/Layout/PageHeader';
import { PageContent } from '../components/Layout/PageContent';
import { Icon } from '../components/UI/Icon';
import { useAppNavigate } from '../hooks/useAppNavigate';
import { useApi } from '../hooks/useApi';
import type { DocumentAnalyticsResponseDto } from '../api';
import { analyticsService } from '../services/analyticsService';

const ENTRIES = [
  { id: '1', title: 'API Authentication Overview', category: 'API Reference', chunks: 12, updated: 'May 24', score: 94 },
  { id: '2', title: 'Document Processing Pipeline', category: 'Architecture', chunks: 18, updated: 'May 23', score: 87 },
  { id: '3', title: 'Vector Embeddings Guide', category: 'ML/AI', chunks: 9, updated: 'May 22', score: 92 },
  { id: '4', title: 'User Management & Roles', category: 'Administration', chunks: 7, updated: 'May 21', score: 79 },
  { id: '5', title: 'RAG Implementation Details', category: 'Architecture', chunks: 15, updated: 'May 20', score: 88 },
];

const CATEGORIES = ['All', 'API Reference', 'Architecture', 'ML/AI', 'Administration'];

export const KnowledgeBase: React.FC = () => {
  const navigate = useAppNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [indexSize, setIndexSize] = useState(0);
  const [averageRelevanceScore, setAverageRelevanceScore] = useState(0);

  const { data: analyticsData, execute: executeAnalytics } =
    useApi<DocumentAnalyticsResponseDto, []>(analyticsService.getDocumentsAnalytics);

  useEffect(() => {
    if (analyticsData) {
      setTotalDocuments(analyticsData.totalDocuments);
      setIndexSize(analyticsData.indexSize);
      setAverageRelevanceScore(analyticsData.averageRelevanceScore);
    }
  }, [analyticsData]);

  useEffect(() => {
    executeAnalytics();
  }, []);

  const filtered = useMemo(
    () =>
      ENTRIES.filter((e) => {
        const q = search.toLowerCase();
        const matchQ = e.title.toLowerCase().includes(q) || e.category.toLowerCase().includes(q);
        const matchC = category === 'All' || e.category === category;
        return matchQ && matchC;
      }),
    [search, category]
  );

  return (
    <AppShell
      header={
        <PageHeader
          title="Knowledge Base & Document Processing"
          subtitle="Semantic index of extracted knowledge from your corpus."
          actions={
            <button
              type="button"
              className="bg-primary text-on-primary px-4 py-2 rounded-lg flex items-center gap-2 font-semibold shadow-[0_0_15px_rgba(221,183,255,0.2)] active:scale-95 transition-transform"
            >
              <Icon name="add" size={18} />
              New Entry
            </button>
          }
        />
      }
    >
      <PageContent className="space-y-8">
        <div className="relative max-w-xl">
          <Icon name="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search knowledge base..."
            className="w-full glass-panel rounded-lg pl-10 pr-4 py-3 text-on-surface focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition-smooth ${category === cat
                ? 'bg-primary/15 text-primary border-primary/30'
                : 'text-on-surface-variant border-outline-variant/30 hover:border-primary/30 hover:text-primary'
                }`}
            >
              {cat}
              {cat === 'All' && ` (${ENTRIES.length})`}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Total Entries', value: totalDocuments, icon: 'menu_book' },
            { label: 'Avg Relevance', value: averageRelevanceScore, icon: 'star' },
            { label: 'Index Size', value: `${indexSize} MB`, icon: 'storage' },
          ].map((s) => (
            <div key={s.label} className="glass-panel p-5 rounded-xl flex items-center gap-4">
              <span className="p-3 rounded-lg bg-primary/10 text-primary">
                <Icon name={s.icon} size={24} />
              </span>
              <div>
                <p className="font-label-sm text-on-surface-variant">{s.label}</p>
                <p className="text-2xl font-semibold text-on-surface">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((entry) => (
            <div
              key={entry.id}
              className={`glass-panel rounded-xl p-5 cursor-pointer transition-all duration-200 hover:border-primary/25 ${expanded === entry.id ? 'ring-1 ring-primary/40' : ''
                }`}
              onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-primary">{entry.title}</h4>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-secondary/15 text-secondary border border-secondary/25">
                      {entry.category}
                    </span>
                  </div>
                  <div className="flex gap-4 font-label-sm text-on-surface-variant">
                    <span>{entry.chunks} chunks</span>
                    <span>Updated {entry.updated}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-semibold text-tertiary">{entry.score}%</p>
                  <p className="font-label-sm text-on-surface-variant">relevance</p>
                </div>
              </div>
              <div className="mt-3 h-1.5 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary via-primary-container to-tertiary rounded-full"
                  style={{ width: `${entry.score}%` }}
                />
              </div>
              {expanded === entry.id && (
                <div className="mt-4 pt-4 border-t border-outline-variant/10 flex gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('chat');
                    }}
                    className="bg-primary/10 text-primary px-3 py-1.5 rounded text-sm font-medium hover:bg-primary/20 flex items-center gap-1"
                  >
                    <Icon name="chat_bubble" size={16} />
                    Query in Chat
                  </button>
                  <button type="button" className="glass-panel px-3 py-1.5 rounded text-sm text-on-surface-variant hover:text-on-surface">
                    View chunks
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="glass-panel p-6 rounded-xl">
          <h3 className="text-headline-md text-on-surface font-medium mb-4">Vector Index Health</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Dimensions', value: '1536' },
              { label: 'Query Latency', value: '45ms' },
              { label: 'Namespaces', value: '12' },
              { label: 'Uptime', value: '99.9%' },
            ].map((item) => (
              <div
                key={item.label}
                className="text-center p-4 bg-surface-container-low rounded-lg border border-outline-variant/10"
              >
                <p className="font-label-sm text-on-surface-variant mb-1">{item.label}</p>
                <p className="text-xl font-semibold text-primary">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </PageContent>
    </AppShell>
  );
};

export default KnowledgeBase;
