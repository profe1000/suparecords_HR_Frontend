import instance from "../utils/axios.wrapper";
import { convertObjToQueryParams } from "../utils/basic.utils";
import { ListResponse } from "../components/admincomponents/Approvals/approvals.types";
import {
  ApplicantStatus,
  JobApplicant,
  JobApplicationFormValues,
  JobOpening,
  JobOpeningFormValues,
  CareersContext,
  PublicJobOpening,
} from "../components/admincomponents/Recruitment/recruitment.types";

const cleanQuery = (query: object) =>
  convertObjToQueryParams(
    Object.fromEntries(
      Object.entries(query).filter(([, value]) => value !== undefined && value !== ""),
    ),
  );

/** Empty optional strings are sent as null so the API stores "not set". */
const toJobPayload = (values: JobOpeningFormValues) => ({
  title: values.title.trim(),
  department: values.department.trim() || null,
  location: values.location.trim() || null,
  employment_type: values.employment_type,
  description: values.description.trim(),
  requirements: values.requirements.trim() || null,
  salary_range: values.salary_range.trim() || null,
  closing_date: values.closing_date || null,
  status: values.status,
  branch_id: values.branch_id || null,
});

// --- HR (requires Admin/HR login) ---------------------------------------

export const getJobs = async (
  query: { status?: string; branch_id?: number; search?: string; page?: number; perPage?: number } = {},
): Promise<ListResponse<JobOpening>> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`v1/jobs/${cleanQuery(query)}`);
  return data;
};

export const getJob = async (id: number | string): Promise<JobOpening> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`v1/jobs/${id}`);
  return data?.data;
};

export const createJob = async (values: JobOpeningFormValues): Promise<JobOpening> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.post("v1/jobs/", toJobPayload(values));
  return data?.data;
};

export const updateJob = async (id: number, values: Partial<JobOpeningFormValues>): Promise<JobOpening> => {
  const axios = await instance(null, null, true, true);
  const body = "title" in values ? toJobPayload(values as JobOpeningFormValues) : values;
  const { data } = await axios.put(`v1/jobs/${id}`, body);
  return data?.data;
};

export const deleteJob = async (id: number) => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.delete(`v1/jobs/${id}`);
  return data;
};

export const getApplicants = async (
  jobId: number | string,
  query: { status?: string; search?: string; page?: number; perPage?: number } = {},
): Promise<ListResponse<JobApplicant>> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.get(`v1/jobs/${jobId}/applicants${cleanQuery(query)}`);
  return data;
};

export const updateApplicant = async (
  id: number,
  body: { status?: ApplicantStatus; notes?: string | null },
): Promise<JobApplicant> => {
  const axios = await instance(null, null, true, true);
  const { data } = await axios.patch(`v1/jobs/applicants/${id}`, body);
  return data?.data;
};

// --- Public careers page for one business (no login) -----------------------

/** Public URL candidates use for a business's careers page. */
export const careersPageUrl = (businessId: number | string) =>
  `${window.location.origin}/careers/${businessId}`;

export const getCareersContext = async (businessId: number | string): Promise<CareersContext> => {
  const axios = await instance("", null, false, false);
  const { data } = await axios.get(`v1/careers/${businessId}`);
  return data?.data;
};

export const getOpenJobs = async (
  businessId: number | string,
  query: { branch_id?: number; search?: string; page?: number; perPage?: number } = {},
): Promise<ListResponse<PublicJobOpening>> => {
  const axios = await instance("", null, false, false);
  const { data } = await axios.get(`v1/careers/${businessId}/jobs${cleanQuery(query)}`);
  return data;
};

export const getOpenJob = async (
  businessId: number | string,
  id: number | string,
): Promise<PublicJobOpening> => {
  const axios = await instance("", null, false, false);
  const { data } = await axios.get(`v1/careers/${businessId}/jobs/${id}`);
  return data?.data;
};

export const applyForJob = async (
  businessId: number | string,
  id: number | string,
  values: JobApplicationFormValues,
) => {
  const axios = await instance("", null, false, false);
  const { data } = await axios.post(`v1/careers/${businessId}/jobs/${id}/apply`, {
    full_name: values.full_name.trim(),
    email: values.email.trim(),
    phone: values.phone.trim() || null,
    cv_url: values.cv_url.trim(),
    cover_letter: values.cover_letter.trim() || null,
  });
  return data;
};
