import instance from "../utils/axios.wrapper";
import { convertObjToQueryParams } from "../utils/basic.utils";
import {
  Room,
  RoomFormValues,
  RoomListResponse,
} from "../components/admincomponents/rooms/room.types";

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

export const getRoom = async (id: number | string): Promise<Room> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${roomsPath}${id}`);
  return data?.data || data;
};

export const createRoom = async (body: RoomFormValues) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(roomsPath, body);
  return data;
};

export const updateRoom = async (id: number | string, body: RoomFormValues) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.put(`${roomsPath}${id}`, body);
  return data;
};

export const deleteRoom = async (id: number | string) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.delete(`${roomsPath}${id}`);
  return data;
};