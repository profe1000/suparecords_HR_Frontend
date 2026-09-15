import { PaymentMethod } from "../components/admincomponents/roomreservations/roomReservations.types";
import { Guest } from "../components/admincomponents/guest/guest.types";
import { Room } from "./laundry-orders-service.type";

export type PaymentDirection = "INFLOW" | "OUTFLOW";
export type PaymentTransactionType = "BOOKING" | "LAUNDRY" | "EXPENSE" | string;

export interface TransactionBookingRoom {
  id: number;
  room_id: number;
  check_in_date: string;
  check_out_date: string;
  room: Room;
}

export interface TransactionBookingSummary {
  id: number;
  booking_reference: string;
  guest_id: number;
  guest: Guest;
  booking_rooms: TransactionBookingRoom[];
}

export interface TransactionLaundryItemSummary {
  laundry_item_type_id: number;
  quantity: number;
  unit_price: string;
  total: string;
  laundry_item_type: { id: number; name: string; price: string };
}

export interface TransactionLaundryOrderSummary {
  id: number;
  order_reference: string;
  room_id: number;
  guest_id: number;
  total: string;
  status: string;
  guest: Guest;
  room: Room;
  items: TransactionLaundryItemSummary[];
}

export interface TransactionExpenseItemSummary {
  id: number;
  name: string;
  quantity: string;
  unit_cost: string;
  total: string;
}

export interface TransactionExpenseVendorSummary {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface TransactionExpenseSummary {
  id: number;
  amount: string;
  status: string;
  description: string;
  vendor_id: number;
  vendor: TransactionExpenseVendorSummary;
  items: TransactionExpenseItemSummary[];
}

export interface Transaction {
  id: number;
  booking_id: number | null;
  laundry_order_id: number | null;
  expense_id: number | null;
  payment_method_id: number;
  amount: string;
  currency: string;
  status: string;
  payment_gateway: string;
  transaction_id: string | null;
  gateway_response: Record<string, unknown> | null;
  paid_at: string | null;
  payment_reference: string;
  credit_payment_id: number | null;
  paid_via_credit: boolean;
  direction: PaymentDirection;
  type: PaymentTransactionType;
  payment_method: PaymentMethod;
  created_at: string;
  updated_at: string;
  booking: TransactionBookingSummary | null;
  laundry_order: TransactionLaundryOrderSummary | null;
  expense: TransactionExpenseSummary | null;
  credit_allocations: unknown[];
}

export interface TransactionDirectionSummary {
  transactions: number;
  paid_transactions: number;
  pending_transactions: number;
  amount: number;
}

export interface TransactionPaymentByMethod {
  method: number;
  payment_method: PaymentMethod;
  amount: number;
}

export interface TransactionListResponse {
  status: string;
  message: string;
  data: Transaction[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
    paid_transactions?: number;
    pending_transactions?: number;
    amount_paid?: number;
    inflow_summary?: TransactionDirectionSummary;
    outflow_summary?: TransactionDirectionSummary;
    booking_summary?: TransactionDirectionSummary;
    laundry_summary?: TransactionDirectionSummary;
    expenses_summary?: TransactionDirectionSummary;
    distribution_by_payment_method?: TransactionPaymentByMethod[];
  };
}
