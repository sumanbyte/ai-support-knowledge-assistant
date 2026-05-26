import React from 'react';
import { RAG_SOURCES } from '../../data/mockData';
import { Icon } from '../UI/Icon';

export const RagSourcePanel: React.FC = () => {
  return (
    <aside className="hidden lg:flex flex-col w-[360px] xl:w-[400px] h-full border-l border-outline-variant/10 bg-surface/50 shrink-0">
      <div className="shrink-0 h-[var(--layout-topbar-height)] px-6 border-b border-outline-variant/10 flex items-center">
        <h2 className="text-headline-md text-on-surface flex items-center gap-2.5 font-medium">
          <Icon name="plagiarism" size={22} className="text-primary" />
          Source Context
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4 terminal-scroll">
        <p className="font-label-sm text-on-surface-variant/70 uppercase tracking-widest px-1">
          Cited Sources ({RAG_SOURCES.length})
        </p>
        {RAG_SOURCES.map((source, index) => (
          <div
            key={source.id}
            className={`glass-panel rounded-xl p-4 cursor-pointer group transition-all hover:border-primary/25 border-l-[3px] ${
              index === 0
                ? 'border-l-primary bg-primary/[0.03]'
                : 'border-l-transparent hover:border-l-primary/40'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-1.5 text-primary text-sm font-medium truncate min-w-0">
                <Icon name={source.icon} size={16} className="shrink-0" />
                <span className="truncate">{source.title}</span>
              </div>
              <span className="font-label-sm text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                {source.match}% match
              </span>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-4 group-hover:text-on-surface/90 transition-colors">
              <span className="text-primary font-bold">[{source.cited}]</span>{' '}
              {source.excerpt}
            </p>
            <div className="flex justify-between items-center mt-3 pt-2 border-t border-outline-variant/10">
              <span className="font-label-sm text-on-surface-variant/70">{source.page}</span>
              <Icon
                name="open_in_new"
                size={15}
                className="text-on-surface-variant/50 group-hover:text-primary transition-colors"
              />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
