import { ArrowLeftOutlined, EditOutlined, EyeOutlined, LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  getStaff,
  getStaffOnboarding,
  getPublicStaffOnboarding,
  upsertStaffOnboarding,
  upsertPublicStaffOnboarding,
} from "../../../apiservice/staff-service";
import StaffOnboardingForm from "../../../components/admincomponents/StaffLogin/StaffOnboardingForm";
import {
  StaffOnboarding,
  StaffRecord,
} from "../../../components/admincomponents/StaffLogin/staffLogin.types";

const emptyOnboarding = (staff?: StaffRecord | null): StaffOnboarding => ({
  personal_information: {
    first_name: staff?.first_name || "",
    middle_name: "",
    last_name: staff?.last_name || "",
    date_of_birth: "",
    gender: "",
    marital_status: "",
    nationality: "",
    phone_number: staff?.phone || "",
    email_address: staff?.email || "",
    residential_address: "",
    state_lga: "",
  },
  employment_information: {
    date_of_employment: "",
    department: staff?.department || "",
    job_title: "",
    staff_role: "",
    branch_location: "",
    reporting_manager: "",
    employment_status: staff?.status || "",
    probation_end_date: "",
    employment_type: "FULL_TIME",
  },
  emergency_contact: {
    name: "",
    relationship: "",
    phone_number: "",
    address: "",
  },
  identification: { id_type: "", id_number: "" },
  bank_information: {
    bank_name: "",
    account_name: "",
    account_number: "",
    payment_method: "",
    salary_grade: "",
  },
  next_of_kin: {
    name: "",
    relationship: "",
    phone_number: "",
    address: "",
  },
  skills_and_qualifications: {
    highest_qualification: "",
    institution: "",
    course_of_study: "",
    professional_certifications: [],
    skills: [],
    years_of_experience: 0,
  },
  family_background: {
    father_name: "",
    father_occupation: "",
    mother_name: "",
    mother_occupation: "",
    spouse_name: "",
    spouse_occupation: "",
    number_of_children: 0,
    children_names: [],
    other_dependants: [],
    family_address: "",
    family_contact_number: "",
    additional_family_information: "",
  },
  references: [],
  reference_verification: {
    reference_checked_by: "",
    date_checked: "",
    verification_status: "",
    hr_remarks: "",
  },
  declaration: {
    information_confirmed: false,
    employee_signature: "",
    hr_officer: "",
    date: "",
    authorized_signature: "",
  },
  hr_use_only: {
    employee_record_number: "",
    date_received: "",
    verified_by: "",
    verification_date: "",
  },
  onboarding_status: "DRAFT",
});

type ApiValidationDetail = {
  loc?: Array<string | number>;
  msg?: string;
};

const localToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const normalizeOnboardingDates = (value: StaffOnboarding): StaffOnboarding => {
  const today = localToday();

  return {
    ...value,
    personal_information: {
      ...value.personal_information,
      date_of_birth: value.personal_information.date_of_birth || null,
    },
    employment_information: {
      ...value.employment_information,
      date_of_employment: value.employment_information.date_of_employment || today,
      probation_end_date: value.employment_information.probation_end_date || today,
    },
    reference_verification: {
      ...value.reference_verification,
      date_checked: value.reference_verification.date_checked || today,
    },
    declaration: {
      ...value.declaration,
      date: value.declaration.date || today,
    },
    hr_use_only: {
      ...value.hr_use_only,
      date_received: value.hr_use_only.date_received || today,
      verification_date: value.hr_use_only.verification_date || today,
    },
  };
};

const parseApiError = (requestError: any) => {
  const detail = requestError?.response?.data?.detail;
  if (!Array.isArray(detail)) {
    return {
      message:
        detail ||
        requestError?.response?.data?.message ||
        "Unable to save onboarding form.",
      fields: {},
    };
  }

  const fields: Record<string, string> = {};
  const messages = detail.map((item: ApiValidationDetail) => {
    const path = (item.loc || []).filter((part) => part !== "body").join(".");
    if (path && item.msg) fields[path] = item.msg;
    const label = path
      .split(".")
      .map((part) => part.replace(/_/g, " "))
      .join(" - ");
    return `${label || "Form"}: ${item.msg || "Invalid value"}`;
  });

  return {
    message: messages.join(" "),
    fields,
  };
};

type Props = {
  publicMode?: boolean;
};

export default function StaffOnboardingPage({ publicMode = false }: Props) {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const editing = publicMode || searchParams.get("mode") === "edit";
  const [staff, setStaff] = useState<StaffRecord | null>(null);
  const [onboarding, setOnboarding] = useState<StaffOnboarding>(emptyOnboarding());
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const formId = "staff-onboarding-form";

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setError("Staff ID is missing.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      try {
        const staffRecord = publicMode ? null : await getStaff(id);
        setStaff(staffRecord);
        try {
          const onboardingRecord = publicMode
            ? await getPublicStaffOnboarding(id)
            : await getStaffOnboarding(id);
          setOnboarding(onboardingRecord);
          setExists(true);
        } catch (requestError: any) {
          const detail = requestError?.response?.data?.detail;
          const status = requestError?.response?.status;
          if (status === 404 || detail === "Staff onboarding form not found") {
            setOnboarding(emptyOnboarding(staffRecord));
            setExists(false);
          } else {
            throw requestError;
          }
        }
      } catch (requestError: any) {
        setError(
          requestError?.response?.data?.detail ||
            requestError?.response?.data?.message ||
            "Unable to load onboarding information.",
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, publicMode]);

  const save = async () => {
    if (!id) return;
    setSaving(true);
    setError("");
    setFieldErrors({});
    setMessage("");
    try {
      const payload = normalizeOnboardingDates(onboarding);
      const saved = publicMode
        ? await upsertPublicStaffOnboarding(id, payload)
        : await upsertStaffOnboarding(id, payload);
      setOnboarding(saved?.personal_information ? saved : payload);
      setExists(true);
      setMessage("Onboarding form saved successfully.");
      if (!publicMode) setSearchParams({});
    } catch (requestError: any) {
      const parsedError = parseApiError(requestError);
      setError(parsedError.message);
      setFieldErrors(parsedError.fields);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center bg-slate-50">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6">
      <div className={publicMode ? "mx-auto w-full max-w-5xl" : ""}>
      {!publicMode && (
        <Link
          to={id ? `/admin/staff-login/${id}` : "/admin/staff-login"}
          className="inline-flex items-center gap-2 text-sm font-medium text-red-800 hover:text-red-950"
        >
          <ArrowLeftOutlined /> Back to staff details
        </Link>
      )}

      <div className={`${publicMode ? "mb-5" : "my-5"} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Staff Onboarding</h1>
          <p className="mt-1 text-sm text-slate-500">
            {staff
              ? `${staff.first_name} ${staff.last_name}`
              : publicMode
                ? "Complete and submit your employment information."
                : "Staff record"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {exists && editing && !publicMode && (
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <EyeOutlined /> View Form
            </button>
          )}
          {!editing && !publicMode && (
            <button
              type="button"
              onClick={() => setSearchParams({ mode: "edit" })}
              className="inline-flex items-center gap-2 rounded-lg bg-red-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-900"
            >
              <EditOutlined /> {exists ? "Update Onboarding" : "Create Onboarding"}
            </button>
          )}
          {editing && (
            <button
              type="submit"
              form={formId}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-red-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-900 disabled:opacity-60"
            >
              {saving && <LoadingOutlined />} Save Onboarding
            </button>
          )}
        </div>
      </div>

      {message && (
        <div role="status" className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </div>
      )}
      {error && (
        <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {!exists && !editing && !error && (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
          <h2 className="text-lg font-semibold text-slate-900">No onboarding form found</h2>
          <p className="mt-2 text-sm text-slate-500">Create a draft onboarding form for this staff member.</p>
          <button
            type="button"
            onClick={() => setSearchParams({ mode: "edit" })}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-900"
          >
            <EditOutlined /> Create Onboarding
          </button>
        </div>
      )}

      {(exists || editing) && (
        <StaffOnboardingForm
          formId={formId}
          value={onboarding}
          readOnly={!editing}
          showStatus={!publicMode}
          fieldErrors={fieldErrors}
          onChange={(nextValue) => {
            setOnboarding(nextValue);
            if (Object.keys(fieldErrors).length) setFieldErrors({});
          }}
          onSubmit={save}
        />
      )}
      </div>
    </div>
  );
}
