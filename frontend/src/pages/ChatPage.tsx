import React, { useEffect, useRef, useState } from 'react';
import { ChatHeader } from '../components/chat/ChatHeader';
import { ChatMessages, type ChatMsg } from '../components/chat/ChatMessages';
import { RagSourcePanel } from '../components/chat/RagSourcePanel';
import { AppShell } from '../components/Layout';
import { Icon } from '../components/UI/Icon';
import { ChatMessagesLoader } from '../components/UI/Loading';
import { CHAT_SUGGESTIONS } from '../data/mockData';
import { useApi } from '../hooks/useApi';
import { chatService } from '../services/chatService';
import { type ChatResponseDto, type PaginatedChatMessageDto } from '../api';
import { useError } from '../hooks/useError';
import { isAxiosError } from 'axios';
import { useNavigate, useParams } from 'react-router-dom';


export const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMsg[]>([{
    id: 'welcome',
    type: 'ai',
    content: 'Welcome to Converse AI. Ask anything about your enterprise documents.',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiId, setAiId] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { chatId } = useParams();

  const { data: chatData, execute: sendQuestion,
    error: chatError, loading: answerLoading } = useApi<ChatResponseDto, [string]>(
      (userQuestion: string) => chatService.askAssistant(userQuestion, chatId)
    );


  const { data: chatMessages, execute: getChatMessages, error: chatMessagesError, loading: chatMessagesLoading } = useApi<PaginatedChatMessageDto, [string, number, number]>(
    (chatId: string, page: number, limit: number) => chatService.getChatMessages(chatId, page, limit));

  useError(chatMessagesError);

  const isLoadingThread = Boolean(chatId) && chatMessagesLoading;

  //fetch chat messages using chatid
  useEffect(() => {
    if (!chatId) return;
    getChatMessages(chatId, 1, 10);
  }, [chatId]);

  //set messages to chat messages
  useEffect(() => {
    if (!chatMessages?.data) return;
    const newMessages: ChatMsg[] = chatMessages.data.map((message) => ({
      id: message.id,
      type: message.role === 'USER' ? 'user' : 'ai',
      content: message.content,
      timestamp: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));
    setMessages(newMessages);
  }, [chatMessages?.data]);


  useEffect(() => {

    if (!chatError || !aiId) return;

    const fallback = 'Unable to complete the request. Please try again.';

    const message = isAxiosError(chatError)
      ? ((chatError.response?.data as { message?: string } | undefined)?.message ?? fallback)
      : fallback;

    setMessages((prev) => prev.map((m) => m.id === aiId ? { ...m, content: message, isLoading: false } : m));
    setIsLoading(false)

  }, [chatError, aiId])

  useError(chatError);

  useEffect(() => {

    if (answerLoading) {
      // console.log("answerLoading", answerLoading)
      setIsLoading(true)
    }

  }, [answerLoading])

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const handleSend = async (text?: string) => {
    const content = (text ?? inputValue).trim();
    if (!content || isLoading) return;

    sendQuestion(content);


    const userMsg: ChatMsg = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: '',
    };
    const aiId = (Date.now() + 1).toString();
    setAiId(aiId);
    setMessages((prev) => [
      ...prev,
      userMsg,
      {
        id: aiId,
        type: 'ai',
        content: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isLoading: true,
      },
    ]);
    setInputValue('');


  };

  const handleNewChat = () => {
    setMessages([
      {
        id: 'welcome',
        type: 'ai',
        content: 'Welcome to Converse AI. Ask anything about your enterprise documents.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  useEffect(() => {
    if (!chatData?.response) return;


    const content = inputValue.trim();

    const reply =
      (chatData?.response) ?? `I've analyzed your question about "${content}" against the indexed knowledge base. The most relevant sources are cited in the panel on the right.`;


    navigate(`/chat/${chatData?.chatId ?? ''}`);

    setMessages((prev) =>
      prev.map((m) =>
        m.id === aiId ? { ...m, content: reply, isLoading: false } : m
      )
    );

    setIsLoading(false)

  }, [chatData])

  return (
    <AppShell bare hideTopNav>
      <div className="flex flex-1 min-h-0 h-full overflow-hidden">
        {/* Main chat column */}
        <div className="flex-1 flex flex-col min-w-0 bg-background">
          <ChatHeader threadTitle="Q4 Earnings Analysis" onNewChat={handleNewChat} />

          <div ref={scrollRef} className="flex-1 overflow-y-auto terminal-scroll">
            <div className="max-w-3xl mx-auto w-full px-6 lg:px-8">
              {isLoadingThread ? (
                <ChatMessagesLoader />
              ) : (
                <ChatMessages messages={messages} />
              )}
            </div>
          </div>

          {/* Input dock */}
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
                  {/* <div className="flex items-center gap-0.5 flex-wrap">
                    <button
                      type="button"
                      className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-smooth"
                      aria-label="Attach"
                    >
                      <Icon name="attach_file" size={20} />
                    </button>
                    <button
                      type="button"
                      className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-smooth"
                      aria-label="Voice"
                    >
                      <Icon name="mic" size={20} />
                    </button>
                    <div className="h-5 w-px bg-outline-variant/30 mx-1.5 hidden sm:block" />
                    <div className="hidden sm:flex items-center gap-1.5 bg-surface-container px-2.5 py-1 rounded-lg border border-outline-variant/20">
                      <Icon name="description" size={15} className="text-primary" />
                      <span className="text-xs text-on-surface font-medium">Acme_Q4_10K.pdf</span>
                      <button type="button" className="text-on-surface-variant hover:text-error ml-0.5">
                        <Icon name="close" size={14} />
                      </button>
                    </div>
                  </div> */}
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
