import apiClient from '../../../shared/api/client';
import type { RegisterRequest } from './types';

export async function register(data: RegisterRequest): Promise<void> {
  await apiClient.post('/register', data);
}
