import instance from "../utils/axios.wrapper";
import { convertObjToQueryParams } from "../utils/basic.utils";
import {
  LeaveAllowance,
  LeaveApplication,
  LeaveApplicationFormValues,
  LeaveBalance,
  ListResponse,
  StaffPermissions,
} from "../components/admincomponents/Approvals/approvals.types";

const leavePath = "v1/leave/";

export interface LeaveListQuery {
  status?: string;
  year?: number;
  staff_id?: number;
  branch_id?: number;
  search?: string;
  page?: number;
  perPage?: number;
  sort_order?: "asc" | "desc";
}

const cleanQuery = (query: object) =>
  convertObjToQueryParams(
    Object.fromEntries(
      Object.entries(query).filter(([, value]) => value !== undefined && value !== ""),
    ),
  );

export const getMyLeaveBalance = async (year?: number): Promise<LeaveBalance> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${leavePath}me/balance${cleanQuery({ year })}`);
  return data?.data;
};

export const getMyLeaveApplications = async (
  query: LeaveListQuery = {},
): Promise<ListResponse<LeaveApplication>> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${leavePath}me/applications${cleanQuery(query)}`);
  return data;
};

export const applyForLeave = async (body: LeaveApplicationFormValues) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(`${leavePath}applications`, {
    ...body,
    reason: body.reason.trim() || null,
  });
  return data?.data as LeaveApplication;
};

export const cancelLeaveApplication = async (id: number) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(`${leavePath}applications/${id}/cancel`);
  return data?.data as LeaveApplication;
};

export const getLeaveApplications = async (
  query: LeaveListQuery = {},
): Promise<ListResponse<LeaveApplication>> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${leavePath}applications${cleanQuery(query)}`);
  return data;
};

export const getStaffLeaveBalance = async (
  staffId: number,
  year?: number,
): Promise<LeaveBalance> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${leavePath}balances/${staffId}${cleanQuery({ year })}`);
  return data?.data;
};

export const approveLeaveApplication = async (id: number, comment?: string) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(`${leavePath}applications/${id}/approve`, {
    comment: comment?.trim() || null,
  });
  return data?.data as LeaveApplication;
};

export const rejectLeaveApplication = async (id: number, comment: string) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(`${leavePath}applications/${id}/reject`, {
    comment: comment.trim(),
  });
  return data?.data as LeaveApplication;
};

export const getStaffLeaveAllowances = async (
  staffId: number | string,
): Promise<LeaveAllowance[]> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`v1/staffs/${staffId}/leave-allowances`);
  return data?.data || [];
};

export const getMyPermissions = async (): Promise<StaffPermissions> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get("v1/staffs/me/permissions");
  return data?.data;
};

export interface StaffDashboardData {
  leaveBalance: LeaveBalance;
  nextLeave: LeaveApplication | null;
  pendingLeaveCount: number;
  requests: { pending: number; approved: number; rejected: number };
  openTasksCount: number;
  openTasks: {
    id: number;
    title: string;
    status: string;
    priority: string;
    task_type: string;
    created_at: string;
  }[];
}

export const getMyDashboard = async (): Promise<StaffDashboardData> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get("v1/dashboard/me");
  return data?.data;
};
