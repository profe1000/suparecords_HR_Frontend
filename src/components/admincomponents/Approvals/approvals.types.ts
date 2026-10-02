export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface StaffSummary {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  department: string | null;
}

export interface ListMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface ListResponse<T> {
  status: string;
  message: string;
  data: T[];
  meta: ListMeta;
}

export interface ReviewFields {
  status: ApprovalStatus;
  reviewed_by: number | null;
  reviewed_at: string | null;
  review_comment: string | null;
  created_at: string;
  staff: StaffSummary;
  reviewer: StaffSummary | null;
}

export interface StaffPermissions {
  /** Super Admin, General Admin or HR Manager: full admin area. Others get self-service only. */
  is_manager: boolean;
  /** Super Admin / General Admin: whole business, branch filter, branch management. */
  can_filter_branches: boolean;
  can_approve_leave: boolean;
  can_approve_requests: boolean;
}

export type LeaveType =
  | "ANNUAL"
  | "SICK"
  | "CASUAL"
  | "MATERNITY"
  | "PATERNITY"
  | "COMPASSIONATE"
  | "STUDY"
  | "OTHER";

export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  ANNUAL: "Annual",
  SICK: "Sick",
  CASUAL: "Casual",
  MATERNITY: "Maternity",
  PATERNITY: "Paternity",
  COMPASSIONATE: "Compassionate",
  STUDY: "Study",
  OTHER: "Other",
};

export interface LeaveBalance {
  staff_id: number;
  year: number;
  total_days: number;
  used_days: number;
  pending_days: number;
  remaining_days: number;
}

export interface LeaveAllowance {
  id: number;
  staff_id: number;
  year: number;
  total_days: number;
  updated_at: string;
}

export interface LeaveApplication extends ReviewFields {
  id: number;
  staff_id: number;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  days: number;
  reason: string | null;
}

export interface LeaveApplicationFormValues {
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  reason: string;
}

export type RequestType =
  | "CASH_ADVANCE"
  | "LOAN"
  | "EXPENSE_REIMBURSEMENT"
  | "EQUIPMENT"
  | "OTHER";

export const REQUEST_TYPE_LABELS: Record<RequestType, string> = {
  CASH_ADVANCE: "Cash Advance",
  LOAN: "Loan",
  EXPENSE_REIMBURSEMENT: "Expense Reimbursement",
  EQUIPMENT: "Equipment",
  OTHER: "Other",
};

/** Request types that must include an amount (and that Finance can approve). */
export const FINANCIAL_REQUEST_TYPES: RequestType[] = [
  "CASH_ADVANCE",
  "LOAN",
  "EXPENSE_REIMBURSEMENT",
];

export interface StaffRequest extends ReviewFields {
  id: number;
  staff_id: number;
  request_type: RequestType;
  title: string;
  description: string | null;
  amount: string | null;
}

export interface StaffRequestFormValues {
  request_type: RequestType;
  title: string;
  description: string;
  amount: string;
}
