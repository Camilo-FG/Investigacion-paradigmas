import apiClient from './client';
import type { User, UpdateUserStatusRequest, UpdateSubscriptionExpirationRequest } from '../types';

export const usersService = {
  async getMe(): Promise<User> {
    const response = await apiClient.get<User>('/users/me');
    return response.data;
  },

  async getUsers(): Promise<User[]> {
    const response = await apiClient.get<User[]>('/users');
    return response.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  async updateUserStatus(id: string, data: UpdateUserStatusRequest): Promise<void> {
    await apiClient.patch(`/users/${id}/status`, data);
  },

  async updateSubscriptionExpiration(id: string, data: UpdateSubscriptionExpirationRequest): Promise<void> {
    await apiClient.patch(`/users/${id}/subscription-expiration`, data);
  },
};
