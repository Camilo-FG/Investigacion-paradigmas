import apiClient from '../../../shared/api/client';
import type { Reservation } from '../../../shared/contracts/types';

export async function getReservations(): Promise<Reservation[]> {
  const response = await apiClient.get<Reservation[]>('/reservations');
  return response.data;
}
