import apiClient from '../../../shared/api/client';
import type { Room } from '../../../shared/contracts/types';
import type { CreateRoomRequest } from './types';

export async function createRoom(data: CreateRoomRequest): Promise<Room> {
  const response = await apiClient.post<Room>('/rooms', data);
  return response.data;
}
