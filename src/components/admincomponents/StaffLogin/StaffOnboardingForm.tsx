import { FormEvent } from "react";
import {
  StaffOnboarding,
  StaffOnboardingStatus,
  StaffReference,
} from "./staffLogin.types";

type Props = {
  formId: string;
  value: StaffOnboarding;
  readOnly?: boolean;
  showStatus?: boolean;
  fieldErrors?: Record<string, string>;
  onChange: (value: StaffOnboarding) => void;
  onSubmit: () => void;
};

type SectionKey = Exclude<
  keyof StaffOnboarding,
  "references" | "onboarding_status"
>;

const sectionTitles: Record<SectionKey, string> = {
  personal_information: "Personal Information",
  employment_information: "Employment Information",
  emergency_contact: "Emergency Contact",
  identification: "Identification",
  bank_information: "Bank Information",
  next_of_kin: "Next of Kin",
  skills_and_qualifications: "Skills and Qualifications",
  family_background: "Family Background",
  reference_verification: "Reference Verification",
  declaration: "Declaration",
  hr_use_only: "HR Use Only",
};

const dateFields = new Set([
  "date_of_birth",
  "date_of_employment",
  "probation_end_date",
  "date_checked",
  "date",
  "date_received",
  "verification_date",
]);

const multilineFields = new Set([
  "residential_address",
  "address",
  "family_address",
  "additional_family_information",
  "hr_remarks",
]);

const arrayFields = new Set([
  "professional_certifications",
  "skills",
  "children_names",
  "other_dependants",
]);

const labelFor = (key: string) =>
  key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export default function StaffOnboardingForm({
  formId,
  value,
  readOnly,
  showStatus = true,
  fieldErrors = {},
  onChange,
  onSubmit,
}: Props) {
  const inputClass =
    "mt-1 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-600";

  const updateSection = (section: SectionKey, key: string, nextValue: unknown) => {
    onChange({
      ...value,
      [section]: {
        ...(value[section] as object),
        [key]: nextValue,
      },
    });
  };

  const updateReference = (
    index: number,
    key: keyof StaffReference,
    nextValue: string,
  ) => {
    const references = value.references.map((reference, referenceIndex) =>
      referenceIndex === index ? { ...reference, [key]: nextValue } : reference,
    );
    onChange({ ...value, references });
  };

  const renderField = (section: SectionKey, key: string, fieldValue: unknown) => {
    const fieldId = `${section}-${key}`;
    const fieldPath = `${section}.${key}`;
    const fieldError = fieldErrors[fieldPath];

    if (typeof fieldValue === "boolean") {
      return (
        <label key={fieldId} className={`flex items-center gap-3 rounded-lg border p-3 text-sm font-medium text-slate-700 ${fieldError ? "border-red-400 bg-red-50" : "border-slate-200"}`}>
          <input
            type="checkbox"
            checked={fieldValue}
            disabled={readOnly}
            onChange={(event) => updateSection(section, key, event.target.checked)}
            className="h-4 w-4 accent-red-800"
          />
          {labelFor(key)}
        </label>
      );
    }

    const isArray = arrayFields.has(key);
    const displayValue = isArray
      ? (fieldValue as string[]).join(", ")
      : String(fieldValue ?? "");

    return (
      <label key={fieldId} className="block text-sm font-medium text-slate-700">
        {labelFor(key)}
        {multilineFields.has(key) ? (
          <textarea
            value={displayValue}
            disabled={readOnly}
            rows={3}
            onChange={(event) =>
              updateSection(
                section,
                key,
                isArray
                  ? event.target.value.split(",").map((item) => item.trim()).filter(Boolean)
                  : event.target.value,
              )
            }
            className={`${inputClass} h-auto py-3`}
          />
        ) : (
          <input
            type={
              dateFields.has(key)
                ? "date"
                : key.includes("email")
                  ? "email"
                  : typeof fieldValue === "number"
                    ? "number"
                    : "text"
            }
            required={key === "date_of_birth"}
            min={typeof fieldValue === "number" ? 0 : undefined}
            value={displayValue}
            disabled={readOnly}
            placeholder={isArray ? "Separate entries with commas" : undefined}
            onChange={(event) =>
              updateSection(
                section,
                key,
                typeof fieldValue === "number"
                  ? Number(event.target.value)
                  : isArray
                    ? event.target.value.split(",").map((item) => item.trim()).filter(Boolean)
                    : event.target.value,
              )
            }
            className={inputClass}
          />
        )}
        {fieldError && <span className="mt-1 block text-xs font-normal text-red-600">{fieldError}</span>}
      </label>
    );
  };

  return (
    <form
      id={formId}
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit();
      }}
      className="space-y-5"
    >
      {showStatus && (
        <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
          <label className="block text-sm font-medium text-slate-700">
            Onboarding Status
            <select
              value={value.onboarding_status}
              disabled={readOnly}
              onChange={(event) =>
                onChange({
                  ...value,
                  onboarding_status: event.target.value as StaffOnboardingStatus,
                })
              }
              className={inputClass}
            >
              <option value="DRAFT">Draft</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="VERIFIED">Verified</option>
            </select>
          </label>
        </div>
      )}

      {(Object.keys(sectionTitles) as SectionKey[]).map((section) => (
        <section key={section} className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
          <h2 className="mb-4 text-base font-semibold text-slate-900">{sectionTitles[section]}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(value[section]).map(([key, fieldValue]) =>
              renderField(section, key, fieldValue),
            )}
          </div>
        </section>
      ))}

      <section className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-slate-900">References</h2>
          {!readOnly && (
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...value,
                  references: [
                    ...value.references,
                    {
                      full_name: "",
                      relationship_to_employee: "",
                      occupation_position: "",
                      company_organization: "",
                      phone_number: "",
                      email_address: "",
                      address: "",
                    },
                  ],
                })
              }
              className="rounded-lg border border-red-700 px-3 py-2 text-sm font-medium text-red-800 hover:bg-red-50"
            >
              Add Reference
            </button>
          )}
        </div>

        {value.references.length === 0 && (
          <p className="text-sm text-slate-500">No references added.</p>
        )}

        <div className="space-y-4">
          {value.references.map((reference, index) => (
            <div key={index} className="rounded-lg bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800">Reference {index + 1}</h3>
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...value,
                        references: value.references.filter((_, referenceIndex) => referenceIndex !== index),
                      })
                    }
                    className="text-sm font-medium text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {(Object.entries(reference) as [keyof StaffReference, string][]).map(([key, fieldValue]) => (
                  <label key={key} className="block text-sm font-medium text-slate-700">
                    {labelFor(key)}
                    {key === "address" ? (
                      <textarea
                        value={fieldValue}
                        disabled={readOnly}
                        rows={3}
                        onChange={(event) => updateReference(index, key, event.target.value)}
                        className={`${inputClass} h-auto py-3`}
                      />
                    ) : (
                      <input
                        type={key === "email_address" ? "email" : "text"}
                        value={fieldValue}
                        disabled={readOnly}
                        onChange={(event) => updateReference(index, key, event.target.value)}
                        className={inputClass}
                      />
                    )}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </form>
  );
}
