import { axiosInstance } from '../config/api';
import type {
  AuthUserDto,
  LoginDto,
  LoginResponseDto,
  SignupDto,
} from '../api';

export const authService = {
  signup: async (data: SignupDto): Promise<AuthUserDto> =>
    axiosInstance.post('/auth/signup', data) as Promise<AuthUserDto>,

  login: async (data: LoginDto): Promise<LoginResponseDto> =>
    axiosInstance.post('/auth/login', data) as Promise<LoginResponseDto>,

  getCurrentUser: (): Promise<AuthUserDto> =>
    axiosInstance.get('/auth/me') as Promise<AuthUserDto>,

  logout: (): Promise<{ ok: boolean }> =>
    axiosInstance.post('/auth/logout') as Promise<{ ok: boolean }>,

  /** Server-side Passport redirect flow (see GET /auth/google on the API). */
  startGoogleLogin: (): void => {
    const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';
    window.location.href = `${baseURL}/auth/google`;
  },
};
