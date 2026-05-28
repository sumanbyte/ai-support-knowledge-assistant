import type { DocumentResponseDto } from "../api";
import { axiosInstance } from "../config/api";


export const documentService = {
    getAllDocuments: (): Promise<DocumentResponseDto> =>
        axiosInstance.get('/documents/all') as Promise<DocumentResponseDto>,

};
