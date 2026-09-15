import instance from "../utils/axios.wrapper";
import { convertObjToQueryParams } from "../utils/basic.utils";
import {
  CreatePaymentPayload,
  Payment,
  PaymentListResponse,
  UpdatePaymentPayload,
} from "../components/admincomponents/roomreservations/roomReservations.types";

const paymentsPath = "v1/payments/";

export interface PaymentListQuery {
  page?: number;
  perPage?: number;
  sort_order?: "asc" | "desc";
  search?: string;
  booking_id?: number;
}

export const getPayments = async (query: PaymentListQuery): Promise<PaymentListResponse> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${paymentsPath}${convertObjToQueryParams(query)}`);
  return data;
};

export const getPayment = async (id: number | string): Promise<Payment> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${paymentsPath}${id}`);
  return data?.data || data;
};

export const createPayment = async (body: CreatePaymentPayload) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(paymentsPath, body);
  return data;
};

export const updatePayment = async (id: number | string, body: UpdatePaymentPayload) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.put(`${paymentsPath}${id}`, body);
  return data;
};

export const deletePayment = async (id: number | string) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.delete(`${paymentsPath}${id}`);
  return data;
};

export const refundPayment = async (id: number | string) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(`${paymentsPath}${id}/refund`);
  return data;
};
