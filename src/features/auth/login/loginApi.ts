import apiClient from '../../../shared/api/client';
import type { AuthResponse } from '../../../shared/contracts/types';
import type { LoginRequest } from './types';

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/login', data);
  return response.data;
}
