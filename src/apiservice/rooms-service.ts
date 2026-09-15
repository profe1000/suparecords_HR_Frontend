import instance from "../utils/axios.wrapper";
import { convertObjToQueryParams } from "../utils/basic.utils";

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
}

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

const roomsPath = "v1/rooms/";

export interface RoomListQuery {
  branch_id: number;
  page?: number;
  perPage?: number;
  sort_order?: "asc" | "desc";
  room_type_id?: number;
  search?: string;
}

export const getRooms = async (query: RoomListQuery): Promise<RoomListResponse> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${roomsPath}${convertObjToQueryParams(query)}`);
  return data;
};
