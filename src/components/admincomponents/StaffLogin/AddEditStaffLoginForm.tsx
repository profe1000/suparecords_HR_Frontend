import { FormEvent, useState } from "react";
import {
  StaffFormValues,
  StaffRecord,
  StaffRole,
  StaffUpdateValues,
} from "./staffLogin.types";

type Props = {
  formId: string;
  branchId: number;
  roles: StaffRole[];
  initialValues?: StaffRecord | null;
  onSubmit: (values: StaffFormValues | StaffUpdateValues) => void;
};

export default function AddEditStaffLoginForm({
  formId,
  branchId,
  roles,
  initialValues,
  onSubmit,
}: Props) {
  const editing = Boolean(initialValues);
  const [values, setValues] = useState<StaffUpdateValues>({
    first_name: initialValues?.first_name || "",
    last_name: initialValues?.last_name || "",
    email: initialValues?.email || "",
    password: "",
    branch_id: initialValues?.branch_id || branchId,
    phone: initialValues?.phone || "",
    department: initialValues?.department || "",
    staff_role_id: initialValues?.staff_role_id || roles[0]?.id || "",
    status: initialValues?.status || "ACTIVE",
  });

  const update = <K extends keyof StaffUpdateValues>(
    key: K,
    value: StaffUpdateValues[K],
  ) => setValues((current) => ({ ...current, [key]: value }));

  const inputClass =
    "mt-1 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100";

  return (
    <form
      id={formId}
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (editing) {
          const updateValues = { ...values };
          if (!updateValues.password) delete updateValues.password;
          onSubmit(updateValues);
        } else {
          onSubmit(values as StaffFormValues);
        }
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          First name <span className="text-red-600">*</span>
          <input
            required
            value={values.first_name}
            onChange={(event) => update("first_name", event.target.value)}
            className={inputClass}
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Last name <span className="text-red-600">*</span>
          <input
            required
            value={values.last_name}
            onChange={(event) => update("last_name", event.target.value)}
            className={inputClass}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Email <span className="text-red-600">*</span>
          <input
            required
            type="email"
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            className={inputClass}
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Password {!editing && <span className="text-red-600">*</span>}
          <input
            required={!editing}
            type="password"
            value={values.password}
            onChange={(event) => update("password", event.target.value)}
            className={inputClass}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Phone
          <input
            value={values.phone}
            onChange={(event) => update("phone", event.target.value)}
            className={inputClass}
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Department
          <input
            value={values.department}
            onChange={(event) => update("department", event.target.value)}
            className={inputClass}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Staff role <span className="text-red-600">*</span>
          <select
            required
            value={values.staff_role_id}
            onChange={(event) => update("staff_role_id", event.target.value)}
            className={`${inputClass} bg-white`}
          >
            <option value="">Select a role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.title}
              </option>
            ))}
          </select>
        </label>

        {editing && (
          <label className="block text-sm font-medium text-slate-700">
            Status
            <select
              value={values.status}
              onChange={(event) => update("status", event.target.value as StaffUpdateValues["status"])}
              className={`${inputClass} bg-white`}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </label>
        )}
      </div>
    </form>
  );
}

