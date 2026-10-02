import { FormEvent, useEffect, useState } from "react";
import { getStaffLeaveAllowances } from "../../../apiservice/leave-service";
import { LeaveAllowance } from "../Approvals/approvals.types";
import { BranchOption } from "../../../apiservice/staff-service";
import {
  StaffFormValues,
  StaffRecord,
  StaffRole,
  StaffUpdateValues,
} from "./staffLogin.types";

type Props = {
  formId: string;
  branchId: number;
  branches: BranchOption[];
  /** Only roles the current user may assign. */
  roles: StaffRole[];
  /** Editing your own record: the role can't be changed. */
  editingSelf?: boolean;
  initialValues?: StaffRecord | null;
  onSubmit: (values: StaffFormValues | StaffUpdateValues) => void;
};

export default function AddEditStaffLoginForm({
  formId,
  branchId,
  branches,
  roles,
  editingSelf = false,
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
    leave_days: "",
    leave_year: new Date().getFullYear(),
  });
  const [allowances, setAllowances] = useState<LeaveAllowance[]>([]);
  const [allowancesLoading, setAllowancesLoading] = useState(editing);

  useEffect(() => {
    if (!initialValues) return;
    getStaffLeaveAllowances(initialValues.id)
      .then((items) => {
        setAllowances(items);
        const existing = items.find((item) => item.year === new Date().getFullYear());
        if (existing) setValues((current) => ({ ...current, leave_days: existing.total_days }));
      })
      .catch(() => setAllowances([]))
      .finally(() => setAllowancesLoading(false));
  }, [initialValues]);

  const changeLeaveYear = (year: number) => {
    const existing = allowances.find((item) => item.year === year);
    setValues((current) => ({ ...current, leave_year: year, leave_days: existing ? existing.total_days : "" }));
  };

  const currentYear = new Date().getFullYear();
  const leaveYears = [currentYear - 1, currentYear, currentYear + 1];
  const savedAllowance = allowances.find((item) => item.year === values.leave_year);

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
        const submitValues = { ...values };
        if (submitValues.leave_days === "") {
          delete submitValues.leave_days;
          delete submitValues.leave_year;
        }
        if (editing) {
          if (!submitValues.password) delete submitValues.password;
          onSubmit(submitValues);
        } else {
          onSubmit(submitValues as StaffFormValues);
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
            disabled={editingSelf}
            value={values.staff_role_id}
            onChange={(event) => update("staff_role_id", event.target.value)}
            className={`${inputClass} bg-white disabled:bg-slate-100 disabled:text-slate-500`}
          >
            <option value="">Select a role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.title}
              </option>
            ))}
          </select>
          <span className="mt-1 block text-xs font-normal text-slate-500">
            {editingSelf
              ? "You can't change your own role."
              : "You can only give roles up to your own level."}
          </span>
        </label>

        {/* Every staff member must belong to a branch. Fixed when there is only one to choose. */}
        <label className="block text-sm font-medium text-slate-700">
            Branch <span className="text-red-600">*</span>
            <select
              required
              disabled={branches.length === 1}
              value={values.branch_id || ""}
              onChange={(event) => update("branch_id", Number(event.target.value))}
              className={`${inputClass} bg-white disabled:bg-slate-100 disabled:text-slate-500`}
            >
              <option value="">Select a branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.branch_name}
                  {branch.city ? ` (${branch.city})` : ""}
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

      <fieldset className="rounded-xl border border-slate-200 p-4">
        <legend className="px-1 text-sm font-semibold text-slate-800">Leave allowance</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            Year
            <select
              value={values.leave_year}
              onChange={(event) => changeLeaveYear(Number(event.target.value))}
              className={`${inputClass} bg-white`}
            >
              {leaveYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Leave days for the year
            <input
              type="number"
              min={0}
              max={366}
              step={1}
              inputMode="numeric"
              value={values.leave_days}
              disabled={allowancesLoading}
              onChange={(event) =>
                update("leave_days", event.target.value === "" ? "" : Number(event.target.value))
              }
              placeholder={allowancesLoading ? "Loading..." : "e.g. 21"}
              className={inputClass}
            />
          </label>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Calendar days this staff member can take in {values.leave_year}.{" "}
          {editing
            ? savedAllowance
              ? `Currently ${savedAllowance.total_days} day(s).`
              : "No allowance set for this year yet."
            : "Leave blank to set it later."}
        </p>
      </fieldset>
    </form>
  );
}

