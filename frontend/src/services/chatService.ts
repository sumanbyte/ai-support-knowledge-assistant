import { axiosInstance } from "../config/api";
import type { ChatResponseDto } from "../api";

export const chatService = {
    askAssistant: (userQuestion: string): Promise<ChatResponseDto> =>
        axiosInstance.post('/chat/ask-assistant', { userQuestion }) as Promise<ChatResponseDto>,
}