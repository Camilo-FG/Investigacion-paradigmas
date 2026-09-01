import apiClient from '../../../shared/api/client';
import type { User } from '../../../shared/contracts/types';

export async function getMe(): Promise<User> {
  const response = await apiClient.get<User>('/users/me');
  return response.data;
}
