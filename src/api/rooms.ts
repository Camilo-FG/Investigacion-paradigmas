import apiClient from './client';
import type { Room, CreateRoomRequest } from '../types';

export const roomsService = {
  async getRooms(): Promise<Room[]> {
    const response = await apiClient.get<Room[]>('/rooms');
    return response.data;
  },

  async createRoom(data: CreateRoomRequest): Promise<Room> {
    const response = await apiClient.post<Room>('/rooms', data);
    return response.data;
  },
};
