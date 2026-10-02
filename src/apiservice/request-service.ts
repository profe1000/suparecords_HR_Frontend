import instance from "../utils/axios.wrapper";
import { convertObjToQueryParams } from "../utils/basic.utils";
import {
  ListResponse,
  StaffRequest,
  StaffRequestFormValues,
} from "../components/admincomponents/Approvals/approvals.types";

const requestPath = "v1/requests/";

export interface RequestListQuery {
  status?: string;
  request_type?: string;
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

export const getMyRequests = async (
  query: RequestListQuery = {},
): Promise<ListResponse<StaffRequest>> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${requestPath}me${cleanQuery(query)}`);
  return data;
};

export const submitRequest = async (body: StaffRequestFormValues) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(requestPath, {
    request_type: body.request_type,
    title: body.title.trim(),
    description: body.description.trim() || null,
    amount: body.amount ? body.amount : null,
  });
  return data?.data as StaffRequest;
};

export const cancelRequest = async (id: number) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(`${requestPath}${id}/cancel`);
  return data?.data as StaffRequest;
};

export const getRequests = async (
  query: RequestListQuery = {},
): Promise<ListResponse<StaffRequest>> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${requestPath}${cleanQuery(query)}`);
  return data;
};

export const approveRequest = async (id: number, comment?: string) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(`${requestPath}${id}/approve`, {
    comment: comment?.trim() || null,
  });
  return data?.data as StaffRequest;
};

export const rejectRequest = async (id: number, comment: string) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(`${requestPath}${id}/reject`, {
    comment: comment.trim(),
  });
  return data?.data as StaffRequest;
};
