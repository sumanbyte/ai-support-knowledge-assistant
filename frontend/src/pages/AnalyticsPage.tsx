import React, { useState } from 'react';
import { AppShell } from '../components/Layout';
import { PageHeader } from '../components/Layout/PageHeader';
import { PageContent } from '../components/Layout/PageContent';
import { Icon } from '../components/UI/Icon';
import type { PageType } from '../types/navigation';

interface AnalyticsPageProps {
  onNavigate?: (page: PageType) => void;
}

const METRICS = [
  { label: 'Total Queries', value: '142.5k', change: '+8.2%', icon: 'query_stats', up: true },
  { label: 'Tokens Processed', value: '3.8M', change: '+12%', icon: 'token', up: true },
  { label: 'Documents Indexed', value: '84.2k', change: '+3.1%', icon: 'description', up: true },
  { label: 'Avg Response Time', value: '850ms', change: '-4%', icon: 'speed', up: false, highlight: true },
];

const CHART_POINTS = '0,80 40,65 80,72 120,45 160,55 200,30 240,40 280,20 320,35 360,15 400,25';

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ onNavigate }) => {
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('7d');
  const bars = [65, 82, 45, 90, 72, 88, 95, 70, 85, 60, 78, 92];

  return (
    <AppShell
      currentPage="analytics"
      onNavigate={(p) => onNavigate?.(p)}
      header={
        <PageHeader
          title="System Performance"
          subtitle="Real-time metrics for Converse AI ingestion and generation."
          actions={
            <div className="flex gap-1 glass-panel p-1 rounded-lg">
              {(['7d', '30d', '90d'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRange(r)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-smooth ${
                    range === r
                      ? 'bg-primary/20 text-primary'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          }
        />
      }
    >
      <PageContent className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
          {METRICS.map((m) => (
            <div key={m.label} className="glass-panel p-6 rounded-xl group hover:border-primary/20 transition-all relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <span className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Icon name={m.icon} size={22} />
                  </span>
                  <span
                    className={`font-label-sm px-2 py-0.5 rounded ${
                      m.up ? 'text-tertiary bg-tertiary/10' : 'text-secondary bg-secondary/10'
                    }`}
                  >
                    {m.change}
                  </span>
                </div>
                <p className="font-label-sm text-on-surface-variant mb-1">{m.label}</p>
                <p className={`text-4xl font-semibold tracking-tight ${m.highlight ? 'text-primary' : 'text-on-surface'}`}>
                  {m.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="glass-panel p-6 rounded-xl lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-headline-md text-on-surface font-medium">
                Query Volume & Generation Processing
              </h3>
              <span className="font-label-sm text-on-surface-variant bg-surface-container px-2 py-1 rounded border border-outline-variant/20">
                {range}
              </span>
            </div>
            <div className="h-52 relative">
              <svg viewBox="0 0 400 100" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ddb7ff" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#ddb7ff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polygon
                  points={`${CHART_POINTS} 400,100 0,100`}
                  fill="url(#chartGrad)"
                />
                <polyline
                  points={CHART_POINTS}
                  fill="none"
                  stroke="#ddb7ff"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs font-label-sm text-on-surface-variant/60 px-1">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl flex flex-col">
            <h3 className="text-headline-md text-on-surface font-medium mb-2">Retrieval Success</h3>
            <p className="text-body-md text-on-surface-variant text-sm mb-6">RAG hit rate across namespaces</p>
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-36 h-36">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="#231e27" strokeWidth="3" />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.5"
                    fill="none"
                    stroke="#ddb7ff"
                    strokeWidth="3"
                    strokeDasharray="87 100"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_8px_rgba(221,183,255,0.4)]"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-semibold text-primary">87%</span>
                  <span className="font-label-sm text-on-surface-variant">success</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-headline-md text-on-surface font-medium mb-4">Daily Token Consumption</h3>
            <div className="flex items-end gap-1.5 h-40">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-gradient-to-t from-primary/20 via-primary/50 to-primary min-h-[4px] hover:from-primary/40 transition-all"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-headline-md text-on-surface font-medium mb-4">Top Namespaces</h3>
            <div className="space-y-4">
              {[
                { name: 'sales-q3', pct: 42, color: 'bg-primary' },
                { name: 'engineering', pct: 28, color: 'bg-secondary' },
                { name: 'hr-policies', pct: 18, color: 'bg-tertiary' },
                { name: 'legal', pct: 12, color: 'bg-outline-variant' },
              ].map((ns) => (
                <div key={ns.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-on-surface font-mono">{ns.name}</span>
                    <span className="text-on-surface-variant">{ns.pct}%</span>
                  </div>
                  <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className={`h-full ${ns.color} rounded-full`} style={{ width: `${ns.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageContent>
    </AppShell>
  );
};

export default AnalyticsPage;
