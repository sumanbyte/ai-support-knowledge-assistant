import { axiosInstance } from '../config/api';
import type { UploadResponseDto } from '../api';

export const uploadService = {
  uploadFile: (file: File): Promise<UploadResponseDto> => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosInstance.post('/upload/file', formData) as Promise<UploadResponseDto>;
  },
};
