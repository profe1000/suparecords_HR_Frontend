import { FormEvent, useState } from "react";
import { Room } from "../../../apiservice/rooms-service";
import { StaffRecord } from "../StaffLogin/staffLogin.types";
import {
  MaintenanceLog,
  MaintenanceLogFormValues,
  MaintenancePriority,
  MaintenanceStatus,
  MaintenanceType,
} from "./roomMaintainance.types";

type Props = {
  formId: string;
  initialValues?: MaintenanceLog | null;
  roomOptions: Room[];
  staffOptions: StaffRecord[];
  defaultRoomId?: number;
  onSubmit: (values: MaintenanceLogFormValues) => void;
};

export default function AddEditRoomMaintainanceForm({
  formId,
  initialValues,
  roomOptions,
  staffOptions,
  defaultRoomId,
  onSubmit,
}: Props) {
  const [values, setValues] = useState<MaintenanceLogFormValues>({
    room_id: initialValues?.room_id || defaultRoomId || roomOptions[0]?.id || 0,
    assigned_staff_id: initialValues?.assigned_staff_id ?? null,
    title: initialValues?.title || "",
    description: initialValues?.description || "",
    maintenance_type: initialValues?.maintenance_type || "REPAIRS",
    status: initialValues?.status || "OPEN",
    priority: initialValues?.priority || "MEDIUM",
  });

  const update = <K extends keyof MaintenanceLogFormValues>(
    key: K,
    value: MaintenanceLogFormValues[K],
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
          Room <span className="text-red-600">*</span>
          <select
            required
            value={values.room_id}
            onChange={(event) => update("room_id", Number(event.target.value))}
            className={`${inputClass} bg-white`}
          >
            <option value="" disabled>
              Select a room
            </option>
            {roomOptions.map((room) => (
              <option key={room.id} value={room.id}>
                Room {room.room_number}
                {room.floor ? ` (Floor ${room.floor})` : ""}
              </option>
            ))}
          </select>
        </label>

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
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Title <span className="text-red-600">*</span>
        <input
          required
          value={values.title}
          onChange={(event) => update("title", event.target.value)}
          placeholder="e.g. Repair of Ac"
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
          Maintenance type
          <select
            value={values.maintenance_type}
            onChange={(event) =>
              update("maintenance_type", event.target.value as MaintenanceType)
            }
            className={`${inputClass} bg-white`}
          >
            <option value="CLEANING">Cleaning</option>
            <option value="REPAIRS">Repairs</option>
            <option value="REPLACE">Replace</option>
          </select>
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Priority
          <select
            value={values.priority}
            onChange={(event) => update("priority", event.target.value as MaintenancePriority)}
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
            onChange={(event) => update("status", event.target.value as MaintenanceStatus)}
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
