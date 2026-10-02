export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "TEMPORARY";
export type JobStatus = "DRAFT" | "OPEN" | "CLOSED";
export type ApplicantStatus = "NEW" | "SHORTLISTED" | "INTERVIEW" | "OFFERED" | "HIRED" | "REJECTED";

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  TEMPORARY: "Temporary",
};

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  DRAFT: "Draft",
  OPEN: "Open",
  CLOSED: "Closed",
};

export const APPLICANT_STATUS_LABELS: Record<ApplicantStatus, string> = {
  NEW: "New",
  SHORTLISTED: "Shortlisted",
  INTERVIEW: "Interview",
  OFFERED: "Offered",
  HIRED: "Hired",
  REJECTED: "Rejected",
};

export const APPLICANT_STATUS_CLASSES: Record<ApplicantStatus, string> = {
  NEW: "bg-sky-100 text-sky-800",
  SHORTLISTED: "bg-violet-100 text-violet-800",
  INTERVIEW: "bg-amber-100 text-amber-800",
  OFFERED: "bg-teal-100 text-teal-800",
  HIRED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-rose-100 text-rose-700",
};

/** What candidates see on the public careers page. */
export interface PublicJobOpening {
  id: number;
  /** null = open to the whole business */
  branch_id: number | null;
  title: string;
  department: string | null;
  location: string | null;
  employment_type: EmploymentType;
  description: string;
  requirements: string | null;
  salary_range: string | null;
  closing_date: string | null;
  created_at: string;
}

export interface JobOpening extends PublicJobOpening {
  business_id: number;
  status: JobStatus;
  updated_at: string;
  applicant_count: number;
  new_applicant_count: number;
}

export interface JobOpeningFormValues {
  title: string;
  department: string;
  location: string;
  employment_type: EmploymentType;
  description: string;
  requirements: string;
  salary_range: string;
  closing_date: string;
  status: JobStatus;
  /** "" = whole business */
  branch_id: number | "";
}

export interface CareersContext {
  business: { id: number; business_name: string };
  branches: { id: number; branch_name: string; city: string | null; state: string | null }[];
}

export interface JobApplicant {
  id: number;
  job_opening_id: number;
  full_name: string;
  email: string;
  phone: string | null;
  cv_url: string;
  cover_letter: string | null;
  status: ApplicantStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobApplicationFormValues {
  full_name: string;
  email: string;
  phone: string;
  cv_url: string;
  cover_letter: string;
}
