export interface ExpenseCategory {
  id: number;
  branch_id: number;
  name: string;
  description: string;
  inventory_expenses_category_id: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: number | null;
  updated_by: number | null;
  deleted_by: number | null;
  inventory_synced: boolean;
  inventory_last_synced_at: string | null;
  inventory_sync_error: string | null;
}

export interface CreateExpenseCategoryPayload {
  branch_id: number;
  name: string;
  description: string;
}

export type UpdateExpenseCategoryPayload = Partial<Omit<CreateExpenseCategoryPayload, "branch_id">>;

export interface ExpenseCategoryListResponse {
  status: string;
  message: string;
  data: ExpenseCategory[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}
