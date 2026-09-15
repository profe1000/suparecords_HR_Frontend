import instance from "../utils/axios.wrapper";
import { convertObjToQueryParams } from "../utils/basic.utils";
import {
  MaintenanceLog,
  MaintenanceLogFormValues,
  MaintenanceLogListResponse,
} from "../components/admincomponents/roomMaintenance/roomMaintainance.types";

const maintenancePath = "v1/maintenance/";

export interface MaintenanceLogListQuery {
  room_id?: number;
  maintenance_type?: string;
  status?: string;
  page?: number;
  perPage?: number;
  sort_order?: "asc" | "desc";
  search?: string;
}

export const getMaintenanceLogs = async (
  query: MaintenanceLogListQuery,
): Promise<MaintenanceLogListResponse> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${maintenancePath}${convertObjToQueryParams(query)}`);
  return data;
};

export const getMaintenanceLog = async (id: number | string): Promise<MaintenanceLog> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${maintenancePath}${id}`);
  return data?.data || data;
};

export const createMaintenanceLog = async (body: MaintenanceLogFormValues) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(maintenancePath, body);
  return data;
};

export const updateMaintenanceLog = async (
  id: number | string,
  body: MaintenanceLogFormValues,
) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.put(`${maintenancePath}${id}`, body);
  return data;
};

export const deleteMaintenanceLog = async (id: number | string) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.delete(`${maintenancePath}${id}`);
  return data;
};
