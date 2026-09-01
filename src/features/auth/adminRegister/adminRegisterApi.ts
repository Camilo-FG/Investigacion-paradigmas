import apiClient from '../../../shared/api/client';
import type { AdminRegisterRequest } from './types';

export async function adminRegister(data: AdminRegisterRequest): Promise<void> {
  await apiClient.post('/admin/register', data);
}
