import instance from "../utils/axios.wrapper";
import { convertObjToQueryParams } from "../utils/basic.utils";
import {
  StaffFormValues,
  StaffListResponse,
  StaffOnboarding,
  StaffRecord,
  StaffRole,
  StaffRoleListResponse,
  StaffUpdateValues,
} from "../components/admincomponents/StaffLogin/staffLogin.types";

const staffPath = "v1/staffs/";

/** Drops undefined/empty values so they are not sent as "undefined" query params. */
const cleanQuery = (query: object) =>
  convertObjToQueryParams(
    Object.fromEntries(
      Object.entries(query).filter(([, value]) => value !== undefined && value !== null && value !== ""),
    ),
  );

export interface StaffListQuery {
  /** Omit for all branches in the business. */
  branch_id?: number;
  page?: number;
  perPage?: number;
  sort_order?: "asc" | "desc";
  search?: string;
}

export const getStaffs = async (query: StaffListQuery): Promise<StaffListResponse> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${staffPath}${cleanQuery(query)}`);
  return data;
};

export const getPublicStaffs = async (
  query: StaffListQuery,
): Promise<StaffListResponse> => {
  const axios = await instance("", null, true, true);
  const { data } = await axios.get(`${staffPath}${convertObjToQueryParams(query)}`);
  return data;
};

export const getStaff = async (staffId: number | string): Promise<StaffRecord> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${staffPath}${staffId}`);
  return data?.data || data;
};

export const getStaffOnboarding = async (
  staffId: number | string,
): Promise<StaffOnboarding> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${staffPath}${staffId}/onboarding`);
  return data?.data || data;
};

export const upsertStaffOnboarding = async (
  staffId: number | string,
  body: StaffOnboarding,
) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.put(`${staffPath}${staffId}/onboarding`, body);
  return data?.data || data;
};

export const getPublicStaffOnboarding = async (
  staffId: number | string,
): Promise<StaffOnboarding> => {
  const axios = await instance("", null, true, true);
  const { data } = await axios.get(`${staffPath}${staffId}/onboarding`);
  return data?.data || data;
};

export const upsertPublicStaffOnboarding = async (
  staffId: number | string,
  body: StaffOnboarding,
) => {
  const axios = await instance("", null, true, true);
  const { data } = await axios.put(`${staffPath}${staffId}/onboarding`, body);
  return data?.data || data;
};

export const createStaff = async (body: StaffFormValues) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(staffPath, body);
  return data;
};

export const updateStaff = async (
  staffId: number | string,
  body: StaffUpdateValues,
) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.put(`${staffPath}${staffId}`, body);
  return data?.data || data;
};

export const deleteStaff = async (staffId: number | string) => {
  if (Number(staffId) === 1) {
    throw new Error("The first staff record cannot be deleted.");
  }

  const axios = await instance(null, null, true, true);
  const { data } = await axios.delete(`${staffPath}${staffId}`);
  return data;
};

export const getStaffRoles = async (): Promise<StaffRoleListResponse> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${staffPath}roles`);
  return data;
};

export const getStaffRole = async (roleId: string): Promise<StaffRole> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${staffPath}roles/${roleId}`);
  return data?.data || data;
};

export const getStaffRoleByName = async (name: string): Promise<StaffRole> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${staffPath}roles/by-name/${name}`);
  return data?.data || data;
};

export const getCurrentStaffBranch = async () => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${staffPath}branch`);
  return data?.data || data;
};

export const listCurrentStaffBranches = async () => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${staffPath}branches`);
  return data?.data || data;
};

export const getStaffBranch = async (staffId: number | string) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${staffPath}${staffId}/branch`);
  return data?.data || data;
};

export const listStaffBranches = async (staffId: number | string) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${staffPath}${staffId}/branches`);
  return data?.data || data;
};

export const listStaffByBranch = async (
  branchId: number | string,
  query?: Omit<StaffListQuery, "branch_id">,
): Promise<StaffListResponse> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(
    `${staffPath}by-branch/${branchId}${query ? convertObjToQueryParams(query) : ""}`,
  );
  return data;
};

export const changeMyPassword = async (currentPassword: string, newPassword: string) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(`${staffPath}me/change-password`, {
    current_password: currentPassword,
    new_password: newPassword,
  });
  return data;
};

export interface BranchOption {
  id: number;
  branch_name: string;
  city: string | null;
  state: string | null;
}

export interface BusinessContext {
  business: { id: number; business_name: string };
  current_branch_id: number | null;
  /** Super Admin / General Admin: whole business, may filter by branch. */
  can_filter_branches: boolean;
  /** Everyone else is limited to this branch, and `branches` contains only it. */
  locked_branch_id: number | null;
  branches: BranchOption[];
}

/** The logged-in staff member's business and all its branches. */
export const getMyBusiness = async (): Promise<BusinessContext> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${staffPath}me/business`);
  return data?.data;
};

/** Public: names of staff in the same business, for the onboarding form's manager picker. */
export const getOnboardingColleagues = async (
  staffId: number | string,
): Promise<{ id: number; first_name: string; last_name: string }[]> => {
  const axios = await instance("", null, true, true);
  const { data } = await axios.get(`${staffPath}${staffId}/onboarding/colleagues`);
  return data?.data || [];
};

export interface StaffPasswordResetResult {
  staff_id: number;
  temporary_password: string;
  email_sent: boolean;
  email_error: string | null;
}

/** Admin/HR: set a staff member's password (generated when newPassword is empty). */
export const resetStaffPassword = async (
  staffId: number | string,
  body: { new_password?: string; send_email: boolean },
): Promise<StaffPasswordResetResult> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(`${staffPath}${staffId}/reset-password`, body);
  return data?.data;
};

/** Roles the logged-in Admin/HR may give to staff (never higher than their own). */
export const getAssignableRoles = async (): Promise<StaffRole[]> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${staffPath}me/assignable-roles`);
  return data?.data || [];
};
