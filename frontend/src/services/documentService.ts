import type { DocumentResponseDto } from "../api";
import { axiosInstance } from "../config/api";
export interface LogMessage {
    id: string;
    timestamp: string;
    type: 'info' | 'success' | 'warn' | 'error' | 'system';
    message: string;
}

export const documentService = {
    getAllDocuments: (): Promise<DocumentResponseDto> =>
        axiosInstance.get('/documents/all') as Promise<DocumentResponseDto>,

    getLogsHistory: (): Promise<LogMessage[]> =>
        axiosInstance.get('/documents/logs/history') as Promise<LogMessage[]>,

};
