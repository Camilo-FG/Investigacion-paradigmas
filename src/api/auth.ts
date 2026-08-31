import apiClient from './client';
import type { AuthResponse, LoginRequest, RegisterRequest, AdminRegisterRequest, RefreshRequest } from '../types';

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/login', data);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<void> {
    await apiClient.post('/register', data);
  },

  async adminRegister(data: AdminRegisterRequest): Promise<void> {
    await apiClient.post('/admin/register', data);
  },

  async refresh(data: RefreshRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/refresh', data);
    return response.data;
  },

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      await apiClient.post('/logout', { refreshToken });
    }
  },
};
