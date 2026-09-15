import instance from "../utils/axios.wrapper";
import { convertObjToQueryParams } from "../utils/basic.utils";
import {
  LaundryOrder,
  LaundryOrderListResponse,
  CreateLaundryOrderPayload,
  UpdateLaundryOrderPayload,
  CreateLaundryPaymentPayload,
  LaundryPaymentResponse,
} from "./laundry-orders-service.type";

const laundryOrdersPath = "v1/laundry/orders";
const laundryPaymentsPath = "v1/payments/laundry";

export interface LaundryOrderListQuery {
  branch_id: number;
  page?: number;
  perPage?: number;
  sort_order?: "asc" | "desc";
  search?: string;
  room_id?: number;
  guest_id?: number;
}

export const getLaundryOrders = async (
  query: LaundryOrderListQuery,
): Promise<LaundryOrderListResponse> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${laundryOrdersPath}${convertObjToQueryParams(query)}`);
  return data;
};

export const getLaundryOrder = async (id: number | string): Promise<LaundryOrder> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${laundryOrdersPath}/${id}`);
  return data?.data || data;
};

export const createLaundryOrder = async (body: CreateLaundryOrderPayload) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(laundryOrdersPath, body);
  return data;
};

export const updateLaundryOrder = async (
  id: number | string,
  body: UpdateLaundryOrderPayload,
) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.put(`${laundryOrdersPath}/${id}`, body);
  return data;
};

export const deleteLaundryOrder = async (id: number | string) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.delete(`${laundryOrdersPath}/${id}`);
  return data;
};

export const createLaundryPayment = async (
  body: CreateLaundryPaymentPayload,
): Promise<LaundryPaymentResponse> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(laundryPaymentsPath, body);
  return data;
};
