import apiClient from '../../../shared/api/client';
import type { User } from '../../../shared/contracts/types';

export async function getUserById(id: string): Promise<User> {
  const response = await apiClient.get<User>(`/users/${id}`);
  return response.data;
}
