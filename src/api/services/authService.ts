import apiClient from '../client';
import { endpoints } from '../endpoints';
import {
  RegisterRequest,
  RegisterResponse,
  LoginResponse,
  UserProfile,
} from '@/types';

export const authService = {
  /**
   * POST /api/auth/register — Create a new user account.
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>(
      endpoints.authRegister,
      data
    );
    return response.data;
  },

  /**
   * POST /api/auth/login — Login using OAuth2 form-encoded body.
   * Returns JWT access_token.
   */
  login: async (
    username: string,
    password: string
  ): Promise<LoginResponse> => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await apiClient.post<LoginResponse>(
      endpoints.authLogin,
      formData,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );
    return response.data;
  },

  /**
   * GET /api/auth/me — Get current user's profile.
   */
  getMe: async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>(endpoints.authMe);
    return response.data;
  },

  /**
   * Logout — clear stored credentials (client-side only).
   */
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },
};
