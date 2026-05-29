import { axiosInstance } from '../config/api';
import type { DeleteResponseDto, UploadResponseDto } from '../api';

export const uploadService = {
  deleteFile: (id: string, publicId: string): Promise<DeleteResponseDto> => {
    return axiosInstance.delete(`/upload/${id}`, { data: { public_id: publicId } }) as Promise<DeleteResponseDto>;
  },
  uploadFile: (file: File): Promise<UploadResponseDto> => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosInstance.post('/upload/file', formData) as Promise<UploadResponseDto>;
  },
};
