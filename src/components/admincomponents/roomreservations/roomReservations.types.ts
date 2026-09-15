import { Room, RoomTypeSummary } from "../rooms/room.types";
import { Guest } from "../guest/guest.types";

export type BookingStatus =
  | "Pending"
  | "Booked"
  | "CheckedIn"
  | "CheckedOut"
  | "Cancelled"
  | string;

export type BookingPaymentStatus =
  | "Unpaid"
  | "PartiallyPaid"
  | "COMPLETELYPAID"
  | string;

export type RoomReservedState = "Reserved" | "NotReserved" | string;

export type AvailableRoom = Room;

export interface AvailableRoomType {
  room_type_id: number;
  room_type_name: string;
  room_type: RoomTypeSummary;
  available_rooms: number;
  available_room_ids: number[];
  total_rooms: number;
  start_date: string;
  end_date: string;
}

export interface BookingRoomParam {
  room_id: number;
  price_per_night: number;
  check_in_date: string;
  check_out_date: string;
  start_date: string;
  end_date: string;
  adult_count: number;
  children_count: number;
  discount: number;
  tax: number;
  reserved: RoomReservedState;
  temp_reserved_until: string | null;
}

export interface BookingRoom {
  id: number;
  booking_id: number;
  room_id: number;
  price_per_night: string;
  check_in_date: string;
  check_out_date: string;
  start_date: string;
  end_date: string;
  reserved: RoomReservedState;
  temp_reserved_until: string | null;
  adult_count: number;
  children_count: number;
  number_of_nights: number;
  total_price: string;
}

export interface BookingPayment {
  id: number;
  booking_id: number;
  laundry_order_id: number | null;
  expense_id: number | null;
  payment_method_id: number;
  amount: string;
  currency: string;
  status: string;
  payment_gateway: string;
  transaction_id: string;
  gateway_response: Record<string, unknown> | null;
  paid_at: string | null;
  payment_reference: string;
  credit_payment_id: number | null;
  paid_via_credit: boolean;
  direction: string;
  type: string;
  payment_method: PaymentMethod;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethod {
  id: number;
  branch_id: number;
  name: string;
  description: string;
  type: string;
  is_default: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: number;
  guest_id: number;
  guest: Guest;
  branch_id: number;
  booking_reference: string;
  booking_status: BookingStatus;
  payment_status: BookingPaymentStatus;
  total_rooms: number;
  subtotal: string;
  discount: string;
  tax: string;
  service_charge: string;
  grand_total: string;
  special_request: string;
  booking_source: string;
  payment_made: string;
  staff_id?: number | null;
  booking_rooms: BookingRoom[];
  payments: BookingPayment[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateBookingPayload {
  guest_id: number;
  branch_id: number;
  discount: number;
  tax: number;
  service_charge: number;
  total_rooms: number;
  booking_status: string;
  payment_status: string;
  special_request: string;
  booking_source: string;
  staff_id: number;
  booking_room_params: BookingRoomParam[];
}

export type UpdateBookingPayload = Partial<CreateBookingPayload>;

export interface BookingListResponse {
  status: string;
  message: string;
  data: Booking[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
    number_of_booking_session?: number;
    number_of_rooms_booked?: number;
    paid_transactions?: number;
    pending_transactions?: number;
    amount_paid?: number;
    amount_on_credit?: number;
    distribution_by_payment_method?: Array<{
      method: number;
      payment_method: PaymentMethod;
      amount: number;
    }>;
  };
}

export type PaymentStatus = "PAID" | "PENDING" | "FAILED" | "REFUNDED" | string;

export type Payment = BookingPayment;

export interface CreatePaymentPayload {
  booking_id: number;
  payment_method_id: number;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_gateway: string;
  transaction_id: string;
  gateway_response: Record<string, unknown>;
  paid_at: string;
}

export type UpdatePaymentPayload = Partial<CreatePaymentPayload>;

export interface PaymentListResponse {
  status: string;
  message: string;
  data: Payment[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export interface AvailableRoomsResponse {
  status: string;
  message: string;
  data: AvailableRoom[];
  meta: null;
}

export interface AvailableRoomTypesResponse {
  status: string;
  message: string;
  data: AvailableRoomType[];
  meta: null;
}
