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

export interface StaffListQuery {
  branch_id: number;
  page?: number;
  perPage?: number;
  sort_order?: "asc" | "desc";
  search?: string;
}

export const getStaffs = async (query: StaffListQuery): Promise<StaffListResponse> => {
  const axios = await instance(null, null, true, true);
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
