import type { RoomType } from '../../../shared/contracts/types';

export interface CreateRoomRequest {
  number: string;
  type: RoomType;
  floor: number;
  capacity: number;
  basePricePerNight: number;
}
