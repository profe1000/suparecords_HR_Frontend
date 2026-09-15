import { LoadingOutlined } from "@ant-design/icons";
import { Room } from "../rooms/room.types";
import { StaffRecord } from "../StaffLogin/staffLogin.types";
import { MaintenanceLog } from "./roomMaintainance.types";

type Props = {
  records: MaintenanceLog[];
  roomOptions: Room[];
  staffOptions: StaffRecord[];
  loading?: boolean;
  deletingId?: number | null;
  onEdit: (record: MaintenanceLog) => void;
  onDelete: (record: MaintenanceLog) => void;
};

const badgeClass = (value: string) => {
  const upper = value.toUpperCase();
  if (["RESOLVED", "CLOSED", "LOW"].includes(upper)) return "bg-emerald-100 text-emerald-700";
  if (["IN_PROGRESS", "MEDIUM", "PENDING"].includes(upper)) return "bg-amber-100 text-amber-700";
  if (["OPEN", "HIGH"].includes(upper)) return "bg-orange-100 text-orange-700";
  return "bg-rose-100 text-rose-700";
};

export default function RoomsMaintainanceList({
  records,
  roomOptions,
  staffOptions,
  loading,
  deletingId,
  onEdit,
  onDelete,
}: Props) {
  const roomLabel = (roomId: number) => {
    const room = roomOptions.find((item) => item.id === roomId);
    return room ? `Room ${room.room_number}` : `#${roomId}`;
  };

  const staffLabel = (staffId: number | null) => {
    if (!staffId) return "-";
    const staff = staffOptions.find((item) => item.id === staffId);
    return staff ? `${staff.first_name} ${staff.last_name}` : `#${staffId}`;
  };

  const badge = (value: string) => (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${badgeClass(value)}`}>
      {value}
    </span>
  );

  const actions = (record: MaintenanceLog) => {
    const isDeleting = deletingId === record.id;
    return (
      <div className="flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => onEdit(record)}
          disabled={isDeleting}
          className="rounded-lg border border-blue-700 px-3 py-2 text-sm font-medium text-blue-800 transition hover:bg-blue-50 disabled:opacity-60"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Delete maintenance record "${record.title}"?`)) {
              onDelete(record);
            }
          }}
          disabled={isDeleting}
          className="inline-flex items-center gap-2 rounded-lg border border-red-500 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
        >
          {isDeleting && <LoadingOutlined />}
          Delete
        </button>
      </div>
    );
  };

  if (loading) {
    return <div className="py-10 text-center text-slate-500">Loading maintenance records...</div>;
  }

  if (records.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-slate-500">
        No maintenance records yet.
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-3">Room</th>
              <th className="px-3 py-3">Issue</th>
              <th className="px-3 py-3">Type</th>
              <th className="px-3 py-3">Assigned to</th>
              <th className="px-3 py-3">Priority</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70">
                <td className="px-3 py-4 font-medium text-slate-900">{roomLabel(record.room_id)}</td>
                <td className="px-3 py-4 text-slate-700">
                  <div className="font-medium text-slate-900">{record.title}</div>
                  <div className="max-w-xs truncate text-xs text-slate-500">{record.description}</div>
                </td>
                <td className="px-3 py-4 text-slate-700">{record.maintenance_type}</td>
                <td className="px-3 py-4 text-slate-700">{staffLabel(record.assigned_staff_id)}</td>
                <td className="px-3 py-4">{badge(record.priority)}</td>
                <td className="px-3 py-4">{badge(record.status)}</td>
                <td className="px-3 py-4">{actions(record)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {records.map((record) => (
          <article key={record.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900">{roomLabel(record.room_id)}</h3>
                <p className="mt-1 text-sm text-slate-500">{record.title}</p>
              </div>
              {badge(record.status)}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {badge(record.priority)}
              <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                {record.maintenance_type}
              </span>
            </div>

            <div className="mt-4">{actions(record)}</div>
          </article>
        ))}
      </div>
    </>
  );
}
