import apiClient from '../../../shared/api/client';
import type { Room } from '../../../shared/contracts/types';

export async function getRooms(): Promise<Room[]> {
  const response = await apiClient.get<Room[]>('/rooms');
  return response.data;
}
