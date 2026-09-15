import instance from "../utils/axios.wrapper";
import { convertObjToQueryParams } from "../utils/basic.utils";
import {
  Task,
  TaskFormValues,
  TaskListResponse,
} from "../components/admincomponents/roomMaintenance/roomMaintainance.types";

const tasksPath = "v1/tasks/";

export interface TaskListQuery {
  assigned_staff_id?: number;
  task_type?: string;
  status?: string;
  priority?: string;
  page?: number;
  perPage?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  search?: string;
}

export const getTasks = async (
  query: TaskListQuery,
): Promise<TaskListResponse> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${tasksPath}${convertObjToQueryParams(query)}`);
  return data;
};

export const getTask = async (id: number | string): Promise<Task> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`${tasksPath}${id}`);
  return data?.data || data;
};

export const createTask = async (body: TaskFormValues) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post(tasksPath, body);
  return data;
};

export const updateTask = async (
  id: number | string,
  body: TaskFormValues,
) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.put(`${tasksPath}${id}`, body);
  return data;
};

export const deleteTask = async (id: number | string) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.delete(`${tasksPath}${id}`);
  return data;
};
