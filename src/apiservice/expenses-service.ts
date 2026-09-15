import instance from "../utils/axios.wrapper";
import { convertObjToQueryParams } from "../utils/basic.utils";
import {
  ExpenseCategory,
  ExpenseCategoryListResponse,
  CreateExpenseCategoryPayload,
  UpdateExpenseCategoryPayload,
} from "./expenses-service.type";

const expenseCategoriesPath = "v1/expenses/categories";

export interface ExpenseCategoryListQuery {
  branch_id: number;
  page?: number;
  perPage?: number;
  sort_order?: "asc" | "desc";
  search?: string;
}

export const getExpenseCategories = async (
  query: ExpenseCategoryListQuery,
): Promise<ExpenseCategoryListResponse> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${expenseCategoriesPath}${convertObjToQueryParams(query)}`);
  return data;
};

export const getExpenseCategory = async (
  id: number | string,
): Promise<ExpenseCategory> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${expenseCategoriesPath}/${id}`);
  return data?.data || data;
};

export const createExpenseCategory = async (
  body: CreateExpenseCategoryPayload,
) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(expenseCategoriesPath, body);
  return data;
};

export const updateExpenseCategory = async (
  id: number | string,
  body: UpdateExpenseCategoryPayload,
) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.put(`${expenseCategoriesPath}/${id}`, body);
  return data;
};

export const deleteExpenseCategory = async (id: number | string) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.delete(`${expenseCategoriesPath}/${id}`);
  return data;
};
