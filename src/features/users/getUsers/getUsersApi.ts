import apiClient from '../../../shared/api/client';
import type { User } from '../../../shared/contracts/types';

export async function getUsers(): Promise<User[]> {
  const response = await apiClient.get<User[]>('/users');
  return response.data;
}
