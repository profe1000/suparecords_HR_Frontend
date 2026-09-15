export interface GuestCredit {
  id: number;
  guest_id: number;
  payment_id: number;
  original_amount: string;
  remaining_amount: string;
  currency: string;
  description: string;
  created_at: string;
}

export interface Guest {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string;
  nationality: string;
  country: string;
  state: string;
  city: string;
  address: string;
  id_type: string;
  id_number: string;
  profile_image: string;
  email_verified: boolean;
  phone_verified: boolean;
  opening_balance: string;
  credit_balance: string;                                                                                                                                                                                                                                                                                                                                                                                                                                                   
  active_credits: GuestCredit[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type GuestFormValues = Omit<
  Guest,
  "id" | "created_at" | "updated_at" | "deleted_at" | "credit_balance" | "active_credits"
>;

export interface GuestListResponse {
  status: string;
  message: string;
  data: Guest[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}