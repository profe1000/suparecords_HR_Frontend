import { FormEvent, useState } from "react";
import { StaffFormValues, StaffRole } from "./staffLogin.types";

type Props = {
  formId: string;
  branchId: number;
  roles: StaffRole[];
  onSubmit: (values: StaffFormValues) => void;
};

export default function AddEditStaffLoginForm({
  formId,
  branchId,
  roles,
  onSubmit,
}: Props) {
  const [values, setValues] = useState<StaffFormValues>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    branch_id: branchId,
    phone: "",
    department: "",
    staff_role_id: roles[0]?.id || "",
  });

  const update = <K extends keyof StaffFormValues>(
    key: K,
    value: StaffFormValues[K],
  ) => setValues((current) => ({ ...current, [key]: value }));

  const inputClass =
    "mt-1 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100";

  return (
    <form
      id={formId}
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(values);
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
          Password <span className="text-red-600">*</span>
          <input
            required
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
    </form>
  );
}

