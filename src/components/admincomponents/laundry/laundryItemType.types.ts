export interface LaundryItemType {
  id: number;
  branch_id: number;
  name: string;
  price: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: number | null;
  updated_by: number | null;
  deleted_by: number | null;
}

export type LaundryItemTypeFormValues = Pick<LaundryItemType, "branch_id" | "name" | "price">;

export interface LaundryItemTypeListResponse {
  status: string;
  message: string;
  data: LaundryItemType[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}
