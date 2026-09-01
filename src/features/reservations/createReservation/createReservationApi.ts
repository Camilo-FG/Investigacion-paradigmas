import apiClient from '../../../shared/api/client';
import type { Reservation } from '../../../shared/contracts/types';
import type { CreateReservationRequest } from './types';

export async function createReservation(data: CreateReservationRequest): Promise<Reservation> {
  const response = await apiClient.post<Reservation>('/reservations', data);
  return response.data;
}
