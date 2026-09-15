import instance from "../utils/axios.wrapper";
import { convertObjToQueryParams } from "../utils/basic.utils";
import {
  LaundryItemType,
  LaundryItemTypeFormValues,
  LaundryItemTypeListResponse,
} from "../components/admincomponents/laundry/laundryItemType.types";

const laundryItemTypesPath = "v1/laundry/item-types";

export interface LaundryItemTypeListQuery {
  branch_id: number;
  page?: number;
  perPage?: number;
  sort_order?: "asc" | "desc";
  search?: string;
}

export const getLaundryItemTypes = async (
  query: LaundryItemTypeListQuery,
): Promise<LaundryItemTypeListResponse> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${laundryItemTypesPath}${convertObjToQueryParams(query)}`);
  return data;
};

export const getLaundryItemType = async (id: number | string): Promise<LaundryItemType> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${laundryItemTypesPath}/${id}`);
  return data?.data || data;
};

export const createLaundryItemType = async (body: LaundryItemTypeFormValues) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(laundryItemTypesPath, body);
  return data;
};

export const updateLaundryItemType = async (
  id: number | string,
  body: LaundryItemTypeFormValues,
) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.put(`${laundryItemTypesPath}/${id}`, body);
  return data;
};

export const deleteLaundryItemType = async (id: number | string) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.delete(`${laundryItemTypesPath}/${id}`);
  return data;
};
