import { axiosInstance } from "../config/api";
import type { ChatResponseDto } from "../api";

export const chatService = {
    askAssistant: (userQuestion: string, chatId?: string): Promise<ChatResponseDto> =>
        axiosInstance.post(`/chat/ask-assistant${chatId ? `/${chatId}` : ''}`, { userQuestion }) as Promise<ChatResponseDto>,
}