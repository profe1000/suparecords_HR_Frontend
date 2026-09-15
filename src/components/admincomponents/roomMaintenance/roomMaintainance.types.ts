export type TaskType = "Cleaning" | "Repairs" | "Replace" | string;

export type TaskStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED"
  | "PENDING"
  | string;

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | string;

export interface Task {
  id: number;
  assigned_staff_id: number | null;
  title: string;
  description: string;
  task_type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export type TaskFormValues = Omit<
  Task,
  "id" | "resolved_at" | "created_at" | "updated_at"
>;

export interface TaskListResponse {
  status: string;
  message: string;
  data: Task[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

