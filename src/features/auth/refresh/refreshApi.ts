import apiClient from '../../../shared/api/client';
import type { AuthResponse } from '../../../shared/contracts/types';
import type { RefreshRequest } from './types';

export async function refresh(data: RefreshRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/refresh', data);
  return response.data;
}
