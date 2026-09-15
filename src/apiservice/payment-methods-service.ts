import instance from "../utils/axios.wrapper";
import { convertObjToQueryParams } from "../utils/basic.utils";
import {
  PaymentMethod,
  PaymentMethodFormValues,
  PaymentMethodListResponse,
} from "../components/admincomponents/paymentMethods/paymentMethod.types";

const paymentMethodsPath = "v1/payments/methods";

export interface PaymentMethodListQuery {
  branch_id: number;
  page?: number;
  perPage?: number;
  sort_order?: "asc" | "desc";
  search?: string;
}

export const getPaymentMethods = async (
  query: PaymentMethodListQuery,
): Promise<PaymentMethodListResponse> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${paymentMethodsPath}${convertObjToQueryParams(query)}`);
  return data;
};

export const getPaymentMethod = async (id: number | string): Promise<PaymentMethod> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${paymentMethodsPath}/${id}`);
  return data?.data || data;
};

export const createPaymentMethod = async (body: PaymentMethodFormValues) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(paymentMethodsPath, body);
  return data;
};

export const updatePaymentMethod = async (
  id: number | string,
  body: PaymentMethodFormValues,
) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.put(`${paymentMethodsPath}/${id}`, body);
  return data;
};

export const deletePaymentMethod = async (id: number | string) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.delete(`${paymentMethodsPath}/${id}`);
  return data;
};
