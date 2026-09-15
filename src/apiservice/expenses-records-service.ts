import instance from "../utils/axios.wrapper";
import { convertObjToQueryParams } from "../utils/basic.utils";
import {
  Expense,
  ExpenseListResponse,
  CreateExpensePayload,
  ApproveExpensePayload,
  CreateExpensePaymentPayload,
  ExpensePaymentResponse,
} from "./expenses-records-service.type";

const expensesPath = "v1/expenses/";
const expensePaymentsPath = "v1/payments/expenses";

export interface ExpenseListQuery {
  branch_id: number;
  page?: number;
  perPage?: number;
  sort_order?: "asc" | "desc";
  search?: string;
  vendor_id?: number;
  expense_category_id?: number;
}

export const getExpenses = async (query: ExpenseListQuery): Promise<ExpenseListResponse> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${expensesPath}${convertObjToQueryParams(query)}`);
  return data;
};

export const getExpense = async (id: number | string): Promise<Expense> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${expensesPath}${id}`);
  return data?.data || data;
};

export const createExpense = async (body: CreateExpensePayload) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(expensesPath, body);
  return data;
};

export const approveExpense = async (id: number | string, body: ApproveExpensePayload) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(`${expensesPath}${id}/approval`, body);
  return data;
};

export const deleteExpense = async (id: number | string) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.delete(`${expensesPath}${id}`);
  return data;
};

export const createExpensePayment = async (
  body: CreateExpensePaymentPayload,
): Promise<ExpensePaymentResponse> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(expensePaymentsPath, body);
  return data;
};
