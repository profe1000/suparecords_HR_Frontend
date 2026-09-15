import instance from "../utils/axios.wrapper";
import { convertObjToQueryParams } from "../utils/basic.utils";
import {
  RoomType,
  RoomTypeFormValues,
  RoomTypeListResponse,
} from "../components/admincomponents/roomTypes/roomType.types";

const roomTypesPath = "v1/rooms/types";

export interface RoomTypeListQuery {
  branch_id: number;
  page?: number;
  perPage?: number;
  sort_order?: "asc" | "desc";
  search?: string;
}

export const getRoomTypes = async (
  query: RoomTypeListQuery,
): Promise<RoomTypeListResponse> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${roomTypesPath}${convertObjToQueryParams(query)}`);
  return data;
};

export const getRoomType = async (id: number | string): Promise<RoomType> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${roomTypesPath}/${id}`);
  return data?.data || data;
};

export const createRoomType = async (body: RoomTypeFormValues) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(roomTypesPath, body);
  return data;
};

export const updateRoomType = async (
  id: number | string,
  body: RoomTypeFormValues,
) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.put(`${roomTypesPath}/${id}`, body);
  return data;
};

export const deleteRoomType = async (id: number | string) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.delete(`${roomTypesPath}/${id}`);
  return data;
};