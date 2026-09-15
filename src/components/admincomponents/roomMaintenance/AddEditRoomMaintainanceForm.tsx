import { FormEvent, useState } from "react";
import { StaffRecord } from "../StaffLogin/staffLogin.types";
import {
  Task,
  TaskFormValues,
  TaskPriority,
  TaskStatus,
  TaskType,
} from "./roomMaintainance.types";

type Props = {
  formId: string;
  initialValues?: Task | null;
  staffOptions: StaffRecord[];
  onSubmit: (values: TaskFormValues) => void;
};

export default function AddEditRoomMaintainanceForm({
  formId,
  initialValues,
  staffOptions,
  onSubmit,
}: Props) {
  const [values, setValues] = useState<TaskFormValues>({
    assigned_staff_id: initialValues?.assigned_staff_id ?? null,
    title: initialValues?.title || "",
    description: initialValues?.description || "",
    task_type: initialValues?.task_type || "Repairs",
    status: initialValues?.status || "OPEN",
    priority: initialValues?.priority || "MEDIUM",
  });

  const update = <K extends keyof TaskFormValues>(
    key: K,
    value: TaskFormValues[K],
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
      <label className="block text-sm font-medium text-slate-700">
        Assigned staff
        <select
          value={values.assigned_staff_id ?? ""}
          onChange={(event) =>
            update(
              "assigned_staff_id",
              event.target.value ? Number(event.target.value) : null,
            )
          }
          className={`${inputClass} bg-white`}
        >
          <option value="">Unassigned</option>
          {staffOptions.map((staff) => (
            <option key={staff.id} value={staff.id}>
              {staff.first_name} {staff.last_name}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Title <span className="text-red-600">*</span>
        <input
          required
          value={values.title}
          onChange={(event) => update("title", event.target.value)}
          placeholder="e.g. Repair of Generator"
          className={inputClass}
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Description
        <textarea
          value={values.description}
          onChange={(event) => update("description", event.target.value)}
          rows={4}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100"
        />
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="block text-sm font-medium text-slate-700">
          Task type
          <select
            value={values.task_type}
            onChange={(event) =>
              update("task_type", event.target.value as TaskType)
            }
            className={`${inputClass} bg-white`}
          >
            <option value="Cleaning">Cleaning</option>
            <option value="Repairs">Repairs</option>
            <option value="Replace">Replace</option>
          </select>
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Priority
          <select
            value={values.priority}
            onChange={(event) => update("priority", event.target.value as TaskPriority)}
            className={`${inputClass} bg-white`}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Status
          <select
            value={values.status}
            onChange={(event) => update("status", event.target.value as TaskStatus)}
            className={`${inputClass} bg-white`}
          >
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
            <option value="PENDING">Pending</option>
          </select>
        </label>
      </div>
    </form>
  );
}
