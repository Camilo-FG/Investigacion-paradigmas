export interface CreateReservationRequest {
  roomId: string;
  guestName: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
}
