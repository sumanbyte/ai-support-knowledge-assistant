import React from 'react';
import { Icon } from '../UI/Icon';
import type { ChatResponseDto } from '../../api';
import { Link } from 'react-router-dom';

export const RagSourcePanel: React.FC<{
  sources: ChatResponseDto['sources'];
}> = ({
  sources = []
}) => {
    // For debug, but can be removed in prod
    console.log(sources);

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
            Cited Sources ({sources.length})
          </p>
          {sources.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-24 select-none">
              <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Icon name="find_in_page" size={38} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-on-surface mb-2">No Sources Cited Yet</h3>
              <p className="text-on-surface-variant/70 text-center max-w-xs mb-1">
                When the Assistant references your documents, you'll see the citations and context right here.
              </p>
              <span className="font-label-sm text-on-surface-variant/60 mt-3">Try asking a question!</span>
            </div>
          ) : (
            sources.map((source, index) => (
              <div
                key={source.citationNumber}
                className={`glass-panel rounded-xl p-4 cursor-pointer group transition-all hover:border-primary/25 border-l-[3px] ${index === 0
                  ? 'border-l-primary bg-primary/[0.03]'
                  : 'border-l-transparent hover:border-l-primary/40'
                  }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-1.5 text-primary text-sm font-medium truncate min-w-0">
                    <Icon name="picture_as_pdf" size={16} className="shrink-0" />
                    <span className="truncate">{source.fileName}</span>
                  </div>
                  <span className="font-label-sm text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                    {source.matchScore}% match
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-4 group-hover:text-on-surface/90 transition-colors">
                  <span className="text-primary font-bold">[{source.citationNumber}]</span>{' '}
                  {source.snippet}
                </p>
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-outline-variant/10">
                  <span className="font-label-sm text-on-surface-variant/70">{source.numberOfPages} pages</span>
                  <Link
                    to={source.cloudinaryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon
                      name="open_in_new"
                      size={15}
                      className="text-on-surface-variant/50 group-hover:text-primary transition-colors"
                    />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    );
  };
