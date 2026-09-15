import { Guest } from "../components/admincomponents/guest/guest.types";
import { PaymentMethod } from "../components/admincomponents/roomreservations/roomReservations.types";

export type LaundryOrderStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | string;

export interface LaundryOrderItem {
  id: number;
  laundry_item_type_id: number;
  quantity: number;
  unit_price: number;
  total: number;
  laundry_item_type: {
    id: number;
    name: string;
    price: number;
  };
}

export interface LaundryOrderPayment {
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

export interface LaundryOrderPaymentByMethod {
  payment_method_id: number;
  payment_method: PaymentMethod;
  amount: number;
}

export interface Room {
  id: number;
  room_number: string;
  floor: string;
}

export interface LaundryOrder {
  id: number;
  branch_id: number;
  room_id: number;
  guest_id: number;
  order_reference: string;
  total: number;
  status: LaundryOrderStatus;
  notes: string;
  inventory_software_income_id: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: number | null;
  updated_by: number | null;
  deleted_by: number | null;
  inventory_synced: boolean;
  inventory_last_synced_at: string | null;
  inventory_sync_error: string | null;
  guest: Guest;
  room: Room;
  items: LaundryOrderItem[];
  payments: LaundryOrderPayment[];
  payments_total: number;
  payments_by_method: LaundryOrderPaymentByMethod[];
}

export interface CreateLaundryOrderPayload {
  branch_id: number;
  room_id: number;
  guest_id: number;
  notes: string;
  items: Array<{
    laundry_item_type_id: number;
    quantity: number;
    unit_price: number;
  }>;
}

export type UpdateLaundryOrderPayload = Partial<
  Omit<CreateLaundryOrderPayload, "branch_id">
>;

export interface LaundryOrderListResponse {
  status: string;
  message: string;
  data: LaundryOrder[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
    number_of_order_session?: number;
    number_of_order_items?: number;
    paid_transactions?: number;
    pending_transactions?: number;
    amount_paid?: number;
    amount_on_credit?: number;
    distribution_by_payment_method?: LaundryOrderPaymentByMethod[];
  };
}

export interface CreateLaundryPaymentPayload {
  laundry_order_id: number;
  payment_method_id: number;
  amount: number;
  currency: string;
  status: string;
  payment_gateway?: string;
  transaction_id?: string;
  paid_at: string;
}

export interface LaundryPaymentResponse {
  status: string;
  message: string;
  data: LaundryOrderPayment;
}
