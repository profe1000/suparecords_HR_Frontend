export type StaffStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface StaffRole {
  id: string;
  name: string;
  title: string;
  description: string;
  permissions: string[] | null;
  is_system_role: boolean;
  is_active: boolean;
}

export interface StaffRecord {
  id: number;
  branch_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  department: string | null;
  status: StaffStatus;
  staff_role_id: string;
  created_at: string;
}

export interface StaffFormValues {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  branch_id: number;
  phone: string;
  department: string;
  staff_role_id: string;
}

export interface StaffListResponse {
  status: string;
  message: string;
  data: StaffRecord[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export interface StaffRoleListResponse {
  status: string;
  message: string;
  data: StaffRole[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

