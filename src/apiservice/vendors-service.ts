import instance from "../utils/axios.wrapper";
import { convertObjToQueryParams } from "../utils/basic.utils";
import { Vendor, VendorFormValues, VendorListResponse } from "../components/admincomponents/vendors/vendor.types";

const vendorsPath = "v1/vendors/";

export interface VendorListQuery {
  branch_id: number;
  page?: number;
  perPage?: number;
  sort_order?: "asc" | "desc";
  search?: string;
}

export const getVendors = async (query: VendorListQuery): Promise<VendorListResponse> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${vendorsPath}${convertObjToQueryParams(query)}`);
  return data;
};

export const getVendor = async (id: number | string): Promise<Vendor> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${vendorsPath}${id}`);
  return data?.data || data;
};

export const createVendor = async (body: VendorFormValues) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(vendorsPath, body);
  return data;
};

export const updateVendor = async (id: number | string, body: VendorFormValues) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.put(`${vendorsPath}${id}`, body);
  return data;
};

export const deleteVendor = async (id: number | string) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.delete(`${vendorsPath}${id}`);
  return data;
};
