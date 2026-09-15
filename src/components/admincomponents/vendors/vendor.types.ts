export type VendorStatus = "ACTIVE" | "INACTIVE";

export interface VendorCredit {
  id: number;
  vendor_id: number;
  payment_id: number;
  original_amount: string;
  remaining_amount: string;
  currency: string;
  description: string;
  created_at: string;
}

export interface Vendor {
  id: number;
  branch_id: number;
  first_name: string;
  last_name: string;
  company_name: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  opening_balance: string | number;
  status: VendorStatus;
  credit_balance: string;
  active_credits: VendorCredit[];
}

export type VendorFormValues = Omit<Vendor, "id" | "credit_balance" | "active_credits">;

export interface VendorListResponse {
  status: string;
  message: string;
  data: Vendor[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}
