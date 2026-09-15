export type MaintenanceType = "CLEANING" | "REPAIRS" | "REPLACE";

export type MaintenanceStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED"
  | "PENDING"
  | string;

export type MaintenancePriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | string;

export interface MaintenanceLog {
  id: number;
  room_id: number;
  assigned_staff_id: number | null;
  title: string;
  description: string;
  maintenance_type: MaintenanceType;
  status: MaintenanceStatus;
  priority: MaintenancePriority;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: number | null;
  updated_by: number | null;
  deleted_by: number | null;
}

export type MaintenanceLogFormValues = Omit<
  MaintenanceLog,
  | "id"
  | "resolved_at"
  | "created_at"
  | "updated_at"
  | "deleted_at"
  | "created_by"
  | "updated_by"
  | "deleted_by"
>;

export interface MaintenanceLogListResponse {
  status: string;
  message: string;
  data: MaintenanceLog[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

