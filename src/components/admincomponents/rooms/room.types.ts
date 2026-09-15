import { RoomTypeImage } from "../roomTypes/roomType.types";

export interface RoomTypeSummary {
  id: number;
  branch_id: number;
  name: string;
  description: string;
  base_price: string;
  discounted_price: string;
  website_price: string;
  cooperate_price: string;
  max_adults: number;
  max_children: number;
  room_size: string;
  bed_type: string;
  total_beds: number;
  feature_image: string;
  feature_video_url: string;
  staff_id: number | null;
  images: RoomTypeImage[];
}

export interface Room {
  id: number;
  branch_id: number;
  room_type_id: number;
  room_number: string;
  floor: string;
  status: string;
  cleaning_status: string;
  maintenance_note: string;
  is_active: boolean;
  staff_id: number | null;
  images: RoomTypeImage[];
  room_type: RoomTypeSummary;
}

export type RoomFormValues = Omit<Room, "id" | "room_type"> & {
  room_type_id: number;
};

export interface RoomListResponse {
  status: string;
  message: string;
  data: Room[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}