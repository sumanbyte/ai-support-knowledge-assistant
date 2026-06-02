import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChatHeader } from '../components/chat/ChatHeader';
import { ChatMessages, type ChatMsg } from '../components/chat/ChatMessages';
import { RagSourcePanel } from '../components/chat/RagSourcePanel';
import { AppShell } from '../components/Layout';
import { Icon } from '../components/UI/Icon';
import { ChatMessagesLoader } from '../components/UI/Loading';
import { CHAT_SUGGESTIONS } from '../data/mockData';
import { useApi } from '../hooks/useApi';
import { chatService } from '../services/chatService';
import { type ChatResponseDto } from '../api';
import type { ChatMessageDto } from '../api';
import { useError } from '../hooks/useError';
import { isAxiosError } from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const WELCOME_MESSAGE: ChatMsg = {
  id: 'welcome',
  type: 'ai',
  content: 'Welcome to Converse AI. Ask anything about your enterprise documents.',
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

const MESSAGES_PAGE_SIZE = 20;

function mapToChatMsg(message: ChatMessageDto): ChatMsg {
  return {
    id: message.id,
    type: message.role === 'USER' ? 'user' : 'ai',
    content: message.content,
    timestamp: new Date(message.createdAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
}

/** API returns newest-first; UI shows oldest-first within the thread. */
function toChronological(messages: ChatMessageDto[]): ChatMsg[] {
  return [...messages].reverse().map(mapToChatMsg);
}

export const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMsg[]>([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingThread, setIsLoadingThread] = useState(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [hasMoreOlder, setHasMoreOlder] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);
  const loadingOlderRef = useRef(false);
  const messagesPageRef = useRef(1);
  const prevChatIdRef = useRef<string | undefined>(undefined);
  /** ID of the in-flight AI placeholder; updated synchronously before async work. */
  const pendingAiIdRef = useRef('');
  const isAwaitingReplyRef = useRef(false);

  const navigate = useNavigate();
  const { chatId } = useParams();

  const { data: chatData, execute: sendQuestion, error: chatError, loading: answerLoading } =
    useApi<ChatResponseDto, [string]>(
      (userQuestion: string) => chatService.askAssistant(userQuestion, chatId),
    );

  useError(chatError);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior });
    }
  }, []);

  const loadMessages = useCallback(
    async (page: number, mode: 'initial' | 'older') => {
      if (!chatId) return;

      if (mode === 'older') {
        if (loadingOlderRef.current) return;
        loadingOlderRef.current = true;
        setIsLoadingOlder(true);
      } else {
        setIsLoadingThread(true);
        stickToBottomRef.current = true;
      }

      try {
        const res = await chatService.getChatMessages(chatId, page, MESSAGES_PAGE_SIZE);
        const chronological = toChronological(res.data);

        if (mode === 'initial') {
          setMessages(chronological);
          messagesPageRef.current = page;
          setHasMoreOlder(page < res.totalPages);
        } else {
          const container = scrollRef.current;
          const previousScrollHeight = container?.scrollHeight ?? 0;

          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const older = chronological.filter((m) => !existingIds.has(m.id));
            return [...older, ...prev];
          });

          messagesPageRef.current = page;
          setHasMoreOlder(page < res.totalPages);

          requestAnimationFrame(() => {
            const el = scrollRef.current;
            if (el) {
              el.scrollTop = el.scrollHeight - previousScrollHeight;
            }
          });
        }
      } finally {
        if (mode === 'older') {
          loadingOlderRef.current = false;
          setIsLoadingOlder(false);
        } else {
          setIsLoadingThread(false);
        }
      }
    },
    [chatId],
  );

  useEffect(() => {
    if (!chatId) {
      setMessages([WELCOME_MESSAGE]);
      setHasMoreOlder(false);
      messagesPageRef.current = 1;
      prevChatIdRef.current = undefined;
      return;
    }

    const isNewThreadSelection = prevChatIdRef.current !== chatId;
    prevChatIdRef.current = chatId;

    // Only fetch history when the user opens a different chat — not when the URL
    // updates after the first message (that would wipe the "Generating…" placeholder).
    if (!isNewThreadSelection) {
      return;
    }

    if (answerLoading || isLoading || isAwaitingReplyRef.current) {
      return;
    }

    pendingAiIdRef.current = '';
    isAwaitingReplyRef.current = false;
    messagesPageRef.current = 1;
    setHasMoreOlder(false);
    void loadMessages(1, 'initial');
  }, [chatId, loadMessages, answerLoading, isLoading]);

  useEffect(() => {
    if (!stickToBottomRef.current || isLoadingThread || isLoadingOlder) return;
    scrollToBottom(messages.length <= MESSAGES_PAGE_SIZE ? 'auto' : 'smooth');
  }, [messages, isLoadingThread, isLoadingOlder, scrollToBottom]);

  useEffect(() => {
    if (!chatId || !hasMoreOlder || isLoadingThread) return;

    const root = scrollRef.current;
    const sentinel = topSentinelRef.current;
    if (!root || !sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        if (loadingOlderRef.current || !hasMoreOlder) return;

        stickToBottomRef.current = false;
        const nextPage = messagesPageRef.current + 1;
        void loadMessages(nextPage, 'older');
      },
      { root, rootMargin: '120px', threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [chatId, hasMoreOlder, isLoadingThread, loadMessages]);

  useEffect(() => {
    if (!chatError) return;

    const targetId = pendingAiIdRef.current;
    if (!targetId) return;

    const fallback = 'Unable to complete the request. Please try again.';
    const message = isAxiosError(chatError)
      ? ((chatError.response?.data as { message?: string } | undefined)?.message ?? fallback)
      : fallback;

    setMessages((prev) =>
      prev.map((m) =>
        m.id === targetId ? { ...m, content: message, isLoading: false } : m,
      ),
    );
    setIsLoading(false);
    isAwaitingReplyRef.current = false;
    pendingAiIdRef.current = '';
  }, [chatError]);

  useEffect(() => {
    setIsLoading(answerLoading);
  }, [answerLoading]);

  const handleSend = async (text?: string) => {
    const content = (text ?? inputValue).trim();
    if (!content || isLoading || answerLoading) return;

    const userMsg: ChatMsg = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: '',
    };
    const newAiId = (Date.now() + 1).toString();
    pendingAiIdRef.current = newAiId;
    isAwaitingReplyRef.current = true;

    stickToBottomRef.current = true;
    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      userMsg,
      {
        id: newAiId,
        type: 'ai',
        content: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isLoading: true,
      },
    ]);
    setInputValue('');

    sendQuestion(content);
  };

  const handleNewChat = () => {
    stickToBottomRef.current = true;
    prevChatIdRef.current = undefined;
    pendingAiIdRef.current = '';
    isAwaitingReplyRef.current = false;
    setIsLoading(false);
    navigate('/chat');
    setMessages([WELCOME_MESSAGE]);
    setHasMoreOlder(false);
    messagesPageRef.current = 1;
  };

  // Only run when a *new* API response arrives — not when aiId changes (that applied stale data).
  useEffect(() => {
    if (!chatData?.response) return;

    const targetId = pendingAiIdRef.current;
    if (!targetId) return;

    const nextChatId = chatData.chatId ?? '';
    if (nextChatId && chatId !== nextChatId) {
      navigate(`/chat/${nextChatId}`);
    }

    setMessages((prev) =>
      prev.map((m) =>
        m.id === targetId
          ? { ...m, content: chatData.response, isLoading: false }
          : m,
      ),
    );

    setIsLoading(false);
    isAwaitingReplyRef.current = false;
    pendingAiIdRef.current = '';
    stickToBottomRef.current = true;
  }, [chatData, navigate, chatId]);

  const topSlot = chatId ? (
    <div ref={topSentinelRef} className="flex flex-col items-center gap-2 py-2 min-h-[1px]">
      {isLoadingOlder && (
        <span className="text-xs text-on-surface-variant inline-flex items-center gap-1.5">
          <Icon name="progress_activity" size={14} className="animate-spin text-primary" />
          Loading earlier messages…
        </span>
      )}
      {!hasMoreOlder && messages.length > 0 && !isLoadingOlder && (
        <span className="text-xs text-on-surface-variant/50">Beginning of conversation</span>
      )}
    </div>
  ) : null;

  return (
    <AppShell bare hideTopNav>
      <div className="flex flex-1 min-h-0 h-full overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0 bg-background">
          <ChatHeader threadTitle="Q4 Earnings Analysis" onNewChat={handleNewChat} />

          <div ref={scrollRef} className="flex-1 overflow-y-auto terminal-scroll">
            <div className="max-w-3xl mx-auto w-full px-6 lg:px-8">
              {isLoadingThread && messages.length === 0 ? (
                <ChatMessagesLoader />
              ) : (
                <ChatMessages messages={messages} topSlot={topSlot} />
              )}
            </div>
          </div>

          <div className="shrink-0 border-t border-outline-variant/10 bg-background/95 backdrop-blur-sm px-6 lg:px-8 py-5">
            <div className="max-w-3xl mx-auto flex flex-col gap-3">
              <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
                {CHAT_SUGGESTIONS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSend(prompt)}
                    disabled={isLoading}
                    className="whitespace-nowrap text-xs font-medium text-on-surface-variant bg-surface-container-low border border-outline-variant/25 hover:border-primary/40 hover:text-primary px-3.5 py-1.5 rounded-full transition-all shrink-0"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="glass-overlay rounded-2xl border border-outline-variant/25 focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/20 transition-all overflow-hidden">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask anything about the Acme Corp documents..."
                  rows={2}
                  className="w-full bg-transparent border-none text-on-surface text-[15px] resize-none focus:outline-none placeholder:text-on-surface-variant/45 px-4 pt-4 pb-2 max-h-36 leading-relaxed"
                />
                <div className="flex justify-end items-center px-3 pb-3 pt-1">
                  <button
                    type="button"
                    onClick={() => handleSend()}
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-primary text-on-primary p-2.5 rounded-xl hover:opacity-90 transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center ai-glow-sm shrink-0"
                  >
                    <Icon name="send" size={18} />
                  </button>
                </div>
              </div>

              <p className="text-center text-xs text-on-surface-variant/45">
                Converse AI can make mistakes. Verify critical information.
              </p>
            </div>
          </div>
        </div>

        <RagSourcePanel sources={chatData?.sources ?? []} activeChatId={chatId} />
      </div>
    </AppShell>
  );
};

export default ChatPage;
