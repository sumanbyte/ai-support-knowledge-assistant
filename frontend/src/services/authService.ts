import { axiosInstance } from '../config/api';

export const authService = {
    signup: (data: any) => axiosInstance.post('/auth/signup', data),
    login: (data: any) => axiosInstance.post('/auth/login', data),
};
