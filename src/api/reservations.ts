import apiClient from './client';
import type { Reservation, CreateReservationRequest } from '../types';

export const reservationsService = {
  async getReservations(): Promise<Reservation[]> {
    const response = await apiClient.get<Reservation[]>('/reservations');
    return response.data;
  },

  async createReservation(data: CreateReservationRequest): Promise<Reservation> {
    const response = await apiClient.post<Reservation>('/reservations', data);
    return response.data;
  },
};
