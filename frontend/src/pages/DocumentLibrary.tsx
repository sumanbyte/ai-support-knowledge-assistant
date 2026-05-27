import React, { useMemo, useState } from 'react';
import { AppShell } from '../components/Layout';
import { PageHeader } from '../components/Layout/PageHeader';
import { PageContent } from '../components/Layout/PageContent';
import { Icon } from '../components/UI/Icon';
import { DEMO_DOCUMENTS } from '../data/mockData';
type DocStatus = 'indexed' | 'processing' | 'error';
type ViewMode = 'grid' | 'list';

export const DocumentLibrary: React.FC = () => {
  const [documents, setDocuments] = useState(DEMO_DOCUMENTS);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const filtered = useMemo(
    () =>
      documents.filter(
        (d) =>
          d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.dept.toLowerCase().includes(search.toLowerCase())
      ),
    [documents, search]
  );

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((d) => d.id)));
  };

  const handleUpload = () => {
    const id = Date.now().toString();
    setDocuments((prev) => [
      {
        id,
        name: 'New_Upload.pdf',
        fullName: 'New_Upload.pdf',
        size: '1.1 MB',
        dept: 'Uploads',
        status: 'processing' as const,
        chunks: 0,
        synced: 'Just now',
        icon: 'picture_as_pdf',
        iconColor: 'text-[#ff3b30] bg-[#ff3b30]/10 border-[#ff3b30]/20',
      },
      ...prev,
    ]);
    setTimeout(() => {
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === id ? { ...d, status: 'indexed' as DocStatus, chunks: 120 } : d
        )
      );
    }, 3000);
  };

  const statusBadge = (status: DocStatus) => {
    if (status === 'indexed')
      return (
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-dim border border-outline-variant font-label-sm text-on-surface">
          <div className="w-1.5 h-1.5 rounded-full bg-[#34c759]" />
          Indexed
        </div>
      );
    if (status === 'processing')
      return (
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary-container/20 border border-primary/30 font-label-sm text-primary">
          <Icon name="refresh" size={12} className="animate-spin" />
          Processing
        </div>
      );
    return (
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-error-container/30 border border-error/30 font-label-sm text-error">
        Failed
      </div>
    );
  };

  return (
    <AppShell
      header={
        <PageHeader
          title="Document Library"
          subtitle="Manage and sync your enterprise knowledge sources."
          actions={
            <button
              type="button"
              onClick={handleUpload}
              className="bg-primary text-on-primary hover:opacity-90 px-4 py-2 rounded-lg flex items-center gap-2 font-semibold shadow-[0_0_15px_rgba(221,183,255,0.2)] transition-smooth active:scale-95"
            >
              <Icon name="upload_file" size={20} />
              Upload New
            </button>
          }
        />
      }
    >
      <PageContent className="space-y-8">
        {/* Filter bar */}
        <div className="glass-panel p-4 rounded-xl flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer pl-2 text-on-surface-variant hover:text-on-surface transition-colors text-sm">
              <input
                type="checkbox"
                className="custom-checkbox"
                checked={selected.size === filtered.length && filtered.length > 0}
                onChange={toggleAll}
              />
              Select All
            </label>
            <div className="h-4 w-px bg-white/10" />
            <button
              type="button"
              disabled={selected.size === 0}
              className="text-on-surface-variant hover:text-error flex items-center gap-1 text-sm disabled:opacity-40"
            >
              <Icon name="delete" size={18} />
              Delete
            </button>
            <button
              type="button"
              disabled={selected.size === 0}
              className="text-on-surface-variant hover:text-on-surface flex items-center gap-1 text-sm disabled:opacity-40"
            >
              <Icon name="sync" size={18} />
              Resync
            </button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Icon name="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search documents..."
                className="bg-surface-container border border-outline-variant rounded-lg pl-10 pr-3 py-2 text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-48 lg:w-64"
              />
            </div>
            <button type="button" className="flex items-center gap-1 px-3 py-1.5 rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container text-sm">
              <Icon name="filter_list" size={18} />
              Status
            </button>
            <div className="flex bg-surface-container rounded-lg p-0.5 border border-white/5">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-surface-variant text-on-surface shadow-sm' : 'text-on-surface-variant'}`}
              >
                <Icon name="grid_view" size={18} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-surface-variant text-on-surface shadow-sm' : 'text-on-surface-variant'}`}
              >
                <Icon name="list" size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Card grid */}
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
              : 'flex flex-col gap-3'
          }
        >
          {filtered.map((doc) => (
            <div
              key={doc.id}
              className="glass-panel rounded-xl p-4 flex flex-col gap-4 relative group hover:border-primary/30 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
              <div className="flex items-start justify-between relative z-10 gap-2">
                <div className="flex items-start gap-3 min-w-0">
                  <input
                    type="checkbox"
                    className="custom-checkbox mt-1 shrink-0"
                    checked={selected.has(doc.id)}
                    onChange={() => toggleSelect(doc.id)}
                  />
                  <div
                    className={`w-10 h-10 rounded flex items-center justify-center border shrink-0 ${doc.iconColor}`}
                  >
                    <Icon name={doc.icon} size={22} />
                  </div>
                  <div className="min-w-0">
                    <h3
                      className="text-on-surface font-medium truncate text-base"
                      title={doc.fullName}
                    >
                      {doc.name}
                    </h3>
                    <p className="text-on-surface-variant text-sm mt-0.5">
                      {doc.size} • {doc.dept}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="text-on-surface-variant hover:text-on-surface opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                >
                  <Icon name="more_vert" size={20} />
                </button>
              </div>
              <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between relative z-10 flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {statusBadge(doc.status)}
                  {doc.status === 'indexed' && (
                    <span className="font-label-sm text-on-surface-variant bg-surface-dim px-2 py-0.5 rounded-full border border-white/5">
                      {doc.chunks.toLocaleString()} chunks
                    </span>
                  )}
                  {doc.status === 'processing' && (
                    <span className="font-label-sm text-on-surface-variant bg-surface-dim px-2 py-0.5 rounded-full border border-white/5">
                      Parsing...
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-on-surface-variant text-xs">
                  {doc.status === 'indexed' && <Icon name="sync" size={14} />}
                  {doc.synced}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upload drop zone */}
        <button
          type="button"
          onClick={handleUpload}
          className="w-full glass-panel rounded-xl border-2 border-dashed border-outline-variant/30 hover:border-primary/40 py-12 flex flex-col items-center gap-3 transition-all group"
        >
          <Icon name="cloud_upload" size={48} className="text-primary group-hover:scale-110 transition-transform" />
          <p className="text-on-surface font-semibold">Drop files to ingest into knowledge base</p>
          <p className="text-on-surface-variant text-sm">PDF, DOCX, MD, TXT — semantic chunking & embedding</p>
        </button>
      </PageContent>
    </AppShell>
  );
};

export default DocumentLibrary;
