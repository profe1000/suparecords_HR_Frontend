import { LoadingOutlined } from "@ant-design/icons";
import { Room } from "./room.types";

type Props = {
  rooms: Room[];
  loading?: boolean;
  deletingId?: number | null;
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
  onView: (room: Room) => void;
};

const currency = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);

const badgeClass = (value: Room["status"] | Room["cleaning_status"]) => {
  if (value === "Available" || value === "Clean") {
    return "bg-emerald-100 text-emerald-700";
  }
  if (value === "Occupied" || value === "Dirty") {
    return "bg-amber-100 text-amber-700";
  }
  return "bg-rose-100 text-rose-700";
};

export default function RoomsList({ rooms, loading, deletingId, onEdit, onDelete, onView }: Props) {
  const thumbnail = (room: Room) =>
    room.room_type?.feature_image ? (
      <img
        src={room.room_type.feature_image}
        alt={room.room_type.name}
        className="h-14 w-20 rounded-lg object-cover"
      />
    ) : (
      <div className="flex h-14 w-20 items-center justify-center rounded-lg bg-slate-100 text-[10px] text-slate-400">
        No image
      </div>
    );
  const badge = (value: Room["status"] | Room["cleaning_status"]) => (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${badgeClass(value)}`}>
      {value}
    </span>
  );

  const actions = (room: Room) => {
    const isDeleting = deletingId === room.id;
    return (
      <div className="flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => onView(room)}
          disabled={isDeleting}
          className="rounded-lg border border-slate-400 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          View
        </button>
        <button
          type="button"
          onClick={() => onEdit(room)}
          disabled={isDeleting}
          className="rounded-lg border border-blue-700 px-3 py-2 text-sm font-medium text-blue-800 transition hover:bg-blue-50 disabled:opacity-60"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Delete room ${room.room_number}?`)) onDelete(room);
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
    return <div className="py-10 text-center text-slate-500">Loading rooms…</div>;
  }

  if (rooms.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-slate-500">
        No rooms yet.
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-3">Image</th>
              <th className="px-3 py-3">Room</th>
              <th className="px-3 py-3">Type</th>
              <th className="px-3 py-3">Floor</th>
              <th className="px-3 py-3">Nightly rate</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Cleaning</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70">
                <td className="px-3 py-4">{thumbnail(room)}</td>
                <td className="px-3 py-4 font-medium text-slate-900">{room.room_number}</td>
                <td className="px-3 py-4 text-slate-700">{room.room_type?.name || "-"}</td>
                <td className="px-3 py-4 text-slate-700">{room.floor}</td>
                <td className="px-3 py-4 font-medium text-slate-900">{currency(Number(room.room_type?.base_price || 0))}</td>
                <td className="px-3 py-4">{room.status ? badge(room.status) : "-"}</td>
                <td className="px-3 py-4">{room.cleaning_status ? badge(room.cleaning_status) : "-"}</td>
                <td className="px-3 py-4">{actions(room)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {rooms.map((room) => (
          <article key={room.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3">
                {thumbnail(room)}
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Room {room.room_number}</h3>
                  <p className="mt-1 text-sm text-slate-500">{room.room_type?.name || "-"}</p>
                </div>
              </div>
              <strong className="whitespace-nowrap text-right text-red-800">{currency(Number(room.room_type?.base_price || 0))}</strong>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {room.status && badge(room.status)}
              {room.cleaning_status && badge(room.cleaning_status)}
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-slate-50 p-2">
                <dt className="text-xs text-slate-500">Floor</dt>
                <dd className="mt-1 text-sm font-medium text-slate-800">{room.floor}</dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <dt className="text-xs text-slate-500">Notes</dt>
                <dd className="mt-1 line-clamp-2 text-sm font-medium text-slate-800">{room.maintenance_note || "-"}</dd>
              </div>
            </dl>

            <div className="mt-4">{actions(room)}</div>
          </article>
        ))}
      </div>
    </>
  );
}