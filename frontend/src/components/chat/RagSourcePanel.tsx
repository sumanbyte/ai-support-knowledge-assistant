import React, { useEffect, useState } from 'react';
import { Icon } from '../UI/Icon';
import type { ChatResponseDto, PaginatedChatDto } from '../../api';
import { Link } from 'react-router-dom';
import { chatService } from '../../services/chatService';
import { useApi } from '../../hooks/useApi';
import { useError } from '../../hooks/useError';
import { formatRelativeTime } from '../../utils/format-time';
import { ChatHistoryLoader } from '../UI/Loading';
type SidePanelTab = 'sources' | 'history';

function SourceContextContent({ sources }: { sources: ChatResponseDto['sources'] }) {
  return (
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
            When the Assistant references your documents, you&apos;ll see the citations and context
            right here.
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
              <span className="font-label-sm text-on-surface-variant/70">
                {source.numberOfPages} pages
              </span>
              <Link to={source.cloudinaryUrl} target="_blank" rel="noopener noreferrer">
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
  );
}

function ChatHistoryContent({ activeChatId }: { activeChatId?: string }) {

  const [chats, setChats] = useState<PaginatedChatDto['data']>([]);

  const { data: chatHistory, execute: getChatHistory, loading, error } = useApi<PaginatedChatDto, []>(() => chatService.getChatHistory());

  useError(error);

  useEffect(() => {
    getChatHistory();
  }, []);

  useEffect(() => {
    if (chatHistory) {
      setChats(chatHistory.data);
    }
  }, [chatHistory]);

  if (loading) {
    return <ChatHistoryLoader />;
  }

  return (
    <div className="flex-1 overflow-y-auto px-5 py-6 terminal-scroll">
      <p className="font-label-sm text-on-surface-variant/70 uppercase tracking-widest px-1 mb-4">
        Recent Sessions ({chats.length})
      </p>
      <div className="flex flex-col gap-2.5">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center select-none">
            <div className="mb-3 flex items-center justify-center w-14 h-14 rounded-full bg-primary/10">
              <Icon name="forum" size={32} className="text-primary" />
            </div>
            <p className="text-sm font-medium text-on-surface mb-1">No chats yet</p>
            <p className="text-xs text-on-surface-variant/70 max-w-[220px]">
              Start a conversation and it will appear here.
            </p>
          </div>
        ) : null}
        {chats.map((chat) => {
          const isActive = activeChatId === chat.id;
          return (
            <Link
              key={chat.id}
              to={`/chat/${chat.id}`}
              className={`block rounded-xl p-4 border transition-all group ${isActive
                ? 'bg-primary/[0.06] border-primary/35'
                : 'bg-surface-container-low/40 border-outline-variant/10 hover:border-primary/30 hover:bg-surface-container-low/70'
                }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${isActive
                    ? 'bg-primary/15 border-primary/30'
                    : 'bg-surface-container-high/50 border-outline-variant/15 group-hover:border-primary/25'
                    }`}
                >
                  <Icon
                    name="forum"
                    size={18}
                    className={isActive ? 'text-primary' : 'text-on-surface-variant'}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h3
                      className={`text-sm font-medium truncate ${isActive ? 'text-primary' : 'text-on-surface group-hover:text-primary'
                        } transition-colors`}
                    >
                      {chat.name}
                    </h3>
                    <span className="font-label-sm text-on-surface-variant/55 shrink-0">
                      {formatRelativeTime(chat.updatedAt)}
                    </span>
                  </div>
                  <p className="text-sm text-on-surface-variant/80 line-clamp-2 leading-relaxed mb-2">
                    {chat.chatMessages[0]?.content ?? 'No preview yet'}
                  </p>
                  <span className="font-label-sm text-on-surface-variant/55 inline-flex items-center gap-1">
                    <Icon name="chat_bubble_outline" size={13} />
                    {chat.messageCount} messages
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

const TABS: { id: SidePanelTab; label: string; icon: string }[] = [
  { id: 'sources', label: 'Source Context', icon: 'plagiarism' },
  { id: 'history', label: 'Chat History', icon: 'history' },
];

export const RagSourcePanel: React.FC<{
  sources: ChatResponseDto['sources'];
  activeChatId?: string;
}> = ({ sources = [], activeChatId }) => {
  const [activeTab, setActiveTab] = useState<SidePanelTab>('sources');

  return (
    <aside className="hidden lg:flex flex-col w-[360px] xl:w-[400px] h-full border-l border-outline-variant/10 bg-surface/50 shrink-0">
      <div className="shrink-0 border-b border-outline-variant/10">
        <div className="h-[var(--layout-topbar-height)] px-4 flex items-center">
          <div
            className="flex w-full gap-1 p-1 rounded-xl bg-surface-container-low/80 border border-outline-variant/15"
            role="tablist"
            aria-label="Side panel"
          >
            {TABS.map((tab) => {
              const selected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium transition-all min-w-0 ${selected
                    ? 'bg-primary/15 text-primary border border-primary/25 shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 border border-transparent'
                    }`}
                >
                  <Icon name={tab.icon} size={16} className="shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {activeTab === 'sources' ? (
        <SourceContextContent sources={sources} />
      ) : (
        <ChatHistoryContent activeChatId={activeChatId} />
      )}
    </aside>
  );
};
