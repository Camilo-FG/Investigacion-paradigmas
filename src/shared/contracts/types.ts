export type RoomType = 'Single' | 'Double' | 'Suite';

export interface User {
  id: string;
  email: string;
  role: 'Admin' | 'Subscription_L1';
  isActive: boolean;
  subscriptionExpirationDate: string;
}

export interface Room {
  id: string;
  number: string;
  type: RoomType;
  floor: number;
  capacity: number;
  basePricePerNight: number;
}

export interface Reservation {
  id: string;
  roomId: string;
  roomNumber: string;
  roomType: string;
  roomFloor: number;
  roomCapacity: number;
  basePricePerNight: number;
  guestName: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  totalPrice: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}
