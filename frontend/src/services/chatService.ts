import { axiosInstance } from "../config/api";
import type { ChatResponseDto, PaginatedChatDto, PaginatedChatMessageDto } from "../api";

export const chatService = {
    askAssistant: (userQuestion: string, chatId?: string): Promise<ChatResponseDto> =>
        axiosInstance.post(`/chat/ask-assistant${chatId ? `/${chatId}` : ''}`, { userQuestion }) as Promise<ChatResponseDto>,

    getChatHistory: (): Promise<PaginatedChatDto> =>
        axiosInstance.get('/chat/history') as Promise<PaginatedChatDto>,

    getChatMessages: (chatId: string, page: number, limit: number): Promise<PaginatedChatMessageDto> =>
        axiosInstance.get(`/chat/messages/${chatId}?page=${page}&limit=${limit}`) as Promise<PaginatedChatMessageDto>,
};
