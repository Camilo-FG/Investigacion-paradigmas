import apiClient from '../../../shared/api/client';
import type { UpdateUserStatusRequest } from './types';

export async function updateUserStatus(id: string, data: UpdateUserStatusRequest): Promise<void> {
  await apiClient.patch(`/users/${id}/status`, data);
}
