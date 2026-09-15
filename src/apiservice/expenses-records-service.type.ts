import { PaymentMethod } from "../components/admincomponents/roomreservations/roomReservations.types";
import { ExpenseCategory } from "./expenses-service.type";

export type ExpenseStatus = "PENDING" | "PARTIALLY_PAID" | "PAID" | "APPROVED" | "REJECTED" | string;

export interface ExpenseItemParam {
  name: string;
  quantity: number;
  unit_cost: number;
}

export interface ExpenseItem extends ExpenseItemParam {
  id: number;
  total: number;
}

export interface ExpenseVendorSummary {
  id: number;
  first_name: string;
  last_name: string;
  company_name: string;
  email: string;
  phone: string;
}

export interface ExpensePayment {
  id: number;
  payment_reference: string;
  amount: number;
  currency: string;
  status: string;
  paid_at: string | null;
  payment_method: PaymentMethod;
  paid_via_credit: boolean;
  credit_payment_id: number | null;
}

export interface ExpensePaymentByMethod {
  method: number;
  payment_method: PaymentMethod;
  amount: number;
}

export interface Expense {
  id: number;
  branch_id: number;
  expense_category_id: number;
  vendor_id: number;
  reference: string;
  amount: number;
  description: string;
  status: ExpenseStatus;
  requested_by: number;
  approved_by: number | null;
  approved_at: string | null;
  inventory_software_expense_id: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: number | null;
  updated_by: number | null;
  deleted_by: number | null;
  inventory_synced: boolean;
  inventory_last_synced_at: string | null;
  inventory_sync_error: string | null;
  expense_category: ExpenseCategory;
  vendor: ExpenseVendorSummary;
  items: ExpenseItem[];
  payments: ExpensePayment[];
  amountPaid: number;
  payments_by_method: ExpensePaymentByMethod[];
}

export interface CreateExpensePayload {
  branch_id: number;
  expense_category_id: number;
  vendor_id: number;
  description: string;
  requested_by: number;
  items: ExpenseItemParam[];
}

export interface ApproveExpensePayload {
  approved_by: number;
  approved: boolean;
}

export interface CreateExpensePaymentPayload {
  expense_id: number;
  payment_method_id: number;
  amount: number;
  currency: string;
  status: string;
  payment_gateway?: string;
  transaction_id?: string;
  paid_at: string;
}

export interface ExpenseListResponse {
  status: string;
  message: string;
  data: Expense[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
    number_of__expenses?: number;
    number_of_expenses_items?: number;
    paid_transactions?: number;
    pending_transactions?: number;
    amount_paid?: number;
    amount_on_credit?: number;
    distribution_by_payment_method?: ExpensePaymentByMethod[];
  };
}

export interface ExpensePaymentResponse {
  status: string;
  message: string;
  data: ExpensePayment;
}
