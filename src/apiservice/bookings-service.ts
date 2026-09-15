import instance from "../utils/axios.wrapper";
import { convertObjToQueryParams } from "../utils/basic.utils";
import {
  AvailableRoomsResponse,
  AvailableRoomTypesResponse,
  Booking,
  BookingListResponse,
  CreateBookingPayload,
  UpdateBookingPayload,
} from "../components/admincomponents/roomreservations/roomReservations.types";

const bookingsPath = "v1/bookings/";

export interface AvailabilityQuery {
  branch_id: number;
  start_date: string;
  end_date: string;
}

export interface BookingListQuery {
  branch_id: number;
  page?: number;
  perPage?: number;
  sort_order?: "asc" | "desc";
  search?: string;
}

export const getAvailableRooms = async (
  query: AvailabilityQuery,
): Promise<AvailableRoomsResponse> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(
    `${bookingsPath}available-rooms${convertObjToQueryParams(query)}`,
  );
  return data;
};

export const getAvailableRoomTypes = async (
  query: AvailabilityQuery,
): Promise<AvailableRoomTypesResponse> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(
    `${bookingsPath}available-room-types${convertObjToQueryParams(query)}`,
  );
  return data;
};

export const getBookings = async (query: BookingListQuery): Promise<BookingListResponse> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${bookingsPath}${convertObjToQueryParams(query)}`);
  return data;
};

export const getBooking = async (id: number | string): Promise<Booking> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${bookingsPath}${id}`);
  return data?.data || data;
};

export const createBooking = async (body: CreateBookingPayload) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(bookingsPath, body);
  return data;
};

export const updateBooking = async (id: number | string, body: UpdateBookingPayload) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.put(`${bookingsPath}${id}`, body);
  return data;
};

export const checkInBooking = async (id: number | string) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(`${bookingsPath}${id}/check-in`);
  return data;
};

export const checkOutBooking = async (id: number | string) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(`${bookingsPath}${id}/check-out`);
  return data;
};

export const cancelBooking = async (id: number | string) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(`${bookingsPath}${id}/cancel`);
  return data;
};
