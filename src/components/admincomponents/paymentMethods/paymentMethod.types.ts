export type PaymentMethodStatus = "ACTIVE" | "INACTIVE";

export interface PaymentMethod {
  id: number;
  branch_id: number;
  name: string;
  description: string;
  type: string;
  is_default: boolean;
  status: PaymentMethodStatus;
  created_at: string;
  updated_at: string;
}

export type PaymentMethodFormValues = Omit<
  PaymentMethod,
  "id" | "created_at" | "updated_at"
>;

export interface PaymentMethodListResponse {
  status: string;
  message: string;
  data: PaymentMethod[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}
