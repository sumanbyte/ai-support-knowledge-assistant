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
};
