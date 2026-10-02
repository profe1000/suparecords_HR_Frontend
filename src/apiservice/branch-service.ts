import instance from "../utils/axios.wrapper";

/** Branches of the logged-in admin's business (Super Admin / General Admin only). */
export interface Branch {
  id: number;
  business_id: number;
  branch_name: string;
  description: string | null;
  email: string | null;
  phone_number: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  address: string | null;
  status: string | null;
  /** The business's first branch; it can never be deleted. */
  is_main: boolean;
  staff_count: number;
  task_count: number;
  job_count: number;
}

export interface BranchFormValues {
  branch_name: string;
  city: string;
  state: string;
  country: string;
  address: string;
  phone_number: string;
  email: string;
}

const branchPath = "v1/branches/";

/** Empty optional strings are sent as null. */
const toPayload = (values: BranchFormValues) =>
  Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, key === "branch_name" ? value.trim() : value.trim() || null]),
  );

export const getBranches = async (): Promise<Branch[]> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(branchPath);
  return data?.data || [];
};

export const createBranch = async (values: BranchFormValues): Promise<Branch> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(branchPath, toPayload(values));
  return data?.data;
};

export const updateBranch = async (id: number, values: BranchFormValues): Promise<Branch> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.put(`${branchPath}${id}`, toPayload(values));
  return data?.data;
};

export const deleteBranch = async (id: number) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.delete(`${branchPath}${id}`);
  return data;
};
