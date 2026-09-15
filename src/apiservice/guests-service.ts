import instance from "../utils/axios.wrapper";
import { convertObjToQueryParams } from "../utils/basic.utils";
import {
  Guest,
  GuestFormValues,
  GuestListResponse,
} from "../components/admincomponents/guest/guest.types";

const guestsPath = "v1/guests/";

export interface GuestListQuery {
  page?: number;
  perPage?: number;
  sort_order?: "asc" | "desc";
  search?: string;
}

export const getGuests = async (query: GuestListQuery): Promise<GuestListResponse> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${guestsPath}${convertObjToQueryParams(query)}`);
  return data;
};

export const getGuest = async (id: number | string): Promise<Guest> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${guestsPath}${id}`);
  return data?.data || data;
};

export const createGuest = async (body: GuestFormValues) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(guestsPath, body);
  return data;
};

export const updateGuest = async (id: number | string, body: GuestFormValues) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.put(`${guestsPath}${id}`, body);
  return data;
};

export const deleteGuest = async (id: number | string) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.delete(`${guestsPath}${id}`);
  return data;
};
