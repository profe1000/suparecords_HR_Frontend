export type StaffStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type StaffOnboardingStatus = "DRAFT" | "SUBMITTED" | "VERIFIED";

export interface StaffRole {
  id: string;
  name: string;
  title: string;
  description: string;
  permissions: string[] | null;
  is_system_role: boolean;
  is_active: boolean;
}

export interface StaffRecord {
  id: number;
  branch_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  department: string | null;
  status: StaffStatus;
  staff_role_id: string;
  created_at: string;
}

export interface StaffFormValues {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  branch_id: number;
  phone: string;
  department: string;
  staff_role_id: string;
}

export type StaffUpdateValues = Omit<StaffFormValues, "password"> & {
  password?: string;
  status: StaffStatus;
};

export interface StaffListResponse {
  status: string;
  message: string;
  data: StaffRecord[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export interface StaffRoleListResponse {
  status: string;
  message: string;
  data: StaffRole[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export interface StaffOnboarding {
  personal_information: {
    first_name: string;
    middle_name: string;
    last_name: string;
    date_of_birth: string | null;
    gender: string;
    marital_status: string;
    nationality: string;
    phone_number: string;
    email_address: string;
    residential_address: string;
    state_lga: string;
  };
  employment_information: {
    date_of_employment: string | null;
    department: string;
    job_title: string;
    staff_role: string;
    branch_location: string;
    reporting_manager: string;
    employment_status: string;
    probation_end_date: string | null;
    employment_type: string;
  };
  emergency_contact: ContactInformation;
  identification: {
    id_type: string;
    id_number: string;
  };
  bank_information: {
    bank_name: string;
    account_name: string;
    account_number: string;
    payment_method: string;
    salary_grade: string;
  };
  next_of_kin: ContactInformation;
  skills_and_qualifications: {
    highest_qualification: string;
    institution: string;
    course_of_study: string;
    professional_certifications: string[];
    skills: string[];
    years_of_experience: number;
  };
  family_background: {
    father_name: string;
    father_occupation: string;
    mother_name: string;
    mother_occupation: string;
    spouse_name: string;
    spouse_occupation: string;
    number_of_children: number;
    children_names: string[];
    other_dependants: string[];
    family_address: string;
    family_contact_number: string;
    additional_family_information: string;
  };
  references: StaffReference[];
  reference_verification: {
    reference_checked_by: string;
    date_checked: string | null;
    verification_status: string;
    hr_remarks: string;
  };
  declaration: {
    information_confirmed: boolean;
    employee_signature: string;
    hr_officer: string;
    date: string | null;
    authorized_signature: string;
  };
  hr_use_only: {
    employee_record_number: string;
    date_received: string | null;
    verified_by: string;
    verification_date: string | null;
  };
  onboarding_status: StaffOnboardingStatus;
}

export interface ContactInformation {
  name: string;
  relationship: string;
  phone_number: string;
  address: string;
}

export interface StaffReference {
  full_name: string;
  relationship_to_employee: string;
  occupation_position: string;
  company_organization: string;
  phone_number: string;
  email_address: string;
  address: string;
}

