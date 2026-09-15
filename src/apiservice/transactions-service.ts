import instance from "../utils/axios.wrapper";
import { convertObjToQueryParams } from "../utils/basic.utils";
import { Transaction, TransactionListResponse } from "./transactions-service.type";

const transactionsPath = "v1/payments/";

export interface TransactionListQuery {
  status?: string;
  direction?: string;
  type?: string;
  page?: number;
  perPage?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  search?: string;
}

export const getTransactions = async (query: TransactionListQuery): Promise<TransactionListResponse> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${transactionsPath}${convertObjToQueryParams(query)}`);
  return data;
};

export const getTransaction = async (id: number | string): Promise<Transaction> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${transactionsPath}${id}`);
  return data?.data || data;
};

export const deleteTransaction = async (id: number | string) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.delete(`${transactionsPath}${id}`);
  return data;
};
