import { LoadingOutlined } from "@ant-design/icons";
import { RoomType } from "./roomType.types";

type Props = {
  roomTypes: RoomType[];
  loading?: boolean;
  deletingId?: number | null;
  onEdit: (roomType: RoomType) => void;
  onDelete: (roomType: RoomType) => void;
  onView: (roomType: RoomType) => void;
};
const currency = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);

export default function RoomTypeList({
  roomTypes,
  loading,
  deletingId,
  onEdit,
  onDelete,
  onView,
}: Props) {
  const thumbnail = (roomType: RoomType) =>
    roomType.feature_image ? (
      <img
        src={roomType.feature_image}
        alt={roomType.name}
        className="h-14 w-20 rounded-lg object-cover"
      />
    ) : (
      <div className="flex h-14 w-20 items-center justify-center rounded-lg bg-slate-100 text-[10px] text-slate-400">
        No image
      </div>
    );
  const status = () => (
    <span
      className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700"
    >
      Active
    </span>
  );
  const actions = (roomType: RoomType) => {
    const isDeleting = deletingId === roomType.id;
    return (
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => onView(roomType)}
          disabled={isDeleting}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          View
        </button>
        <button
          type="button"
          onClick={() => onEdit(roomType)}
          disabled={isDeleting}
          className="rounded-lg border border-blue-700 px-3 py-2 text-sm font-medium text-blue-800 hover:bg-blue-50 disabled:opacity-60"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Delete ${roomType.name}?`)) onDelete(roomType);
          }}
          disabled={isDeleting}
          className="inline-flex items-center gap-2 rounded-lg border border-red-500 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
        >
          {isDeleting && <LoadingOutlined />}
          Delete
        </button>
      </div>
    );
  };
  if (loading)
    return (
      <div className="py-10 text-center text-slate-500">
        Loading room types…
      </div>
    );
  if (roomTypes.length === 0)
    return (
      <div className="py-10 text-center text-slate-500">No room types yet.</div>
    );
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-3">Image</th>
              <th className="px-3 py-3">Room type</th>
              <th className="px-3 py-3">Nightly rate</th>
              <th className="px-3 py-3">Capacity</th>
              <th className="px-3 py-3">Beds</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roomTypes.map((roomType) => (
              <tr
                key={roomType.id}
                className="border-b border-slate-100 last:border-0"
              >
                <td className="px-3 py-4">{thumbnail(roomType)}</td>
                <td className="px-3 py-4">
                  <div className="font-medium text-slate-900">
                    {roomType.name}
                  </div>
                  {roomType.description && (
                    <div className="mt-1 text-xs text-slate-500">
                      {roomType.description}
                    </div>
                  )}
                </td>
                <td className="px-3 py-4 font-medium text-slate-900">
                  {currency(Number(roomType.base_price))}
                </td>
                <td className="px-3 py-4">
                  {roomType.max_adults + roomType.max_children} guest{roomType.max_adults + roomType.max_children === 1 ? "" : "s"}
                </td>
                <td className="px-3 py-4">{roomType.bed_type}</td>
                <td className="px-3 py-4">{status()}</td>
                <td className="px-3 py-4">{actions(roomType)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-3 md:hidden">
        {roomTypes.map((roomType) => (
          <article
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            key={roomType.id}
          >
            <div className="flex justify-between gap-3">
              <div className="flex gap-3">
                {thumbnail(roomType)}
                <div>
                  <h3 className="mb-2 text-base font-semibold text-slate-900">
                    {roomType.name}
                  </h3>
                  {status()}
                </div>
              </div>
              <strong className="whitespace-nowrap text-right text-blue-800">
                {currency(Number(roomType.base_price))}
                <small className="block text-xs font-normal text-slate-500">
                  / night
                </small>
              </strong>
            </div>
            {roomType.description && (
              <p className="my-3 text-sm text-slate-500">
                {roomType.description}
              </p>
            )}
            <dl className="mb-4 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-slate-50 p-2">
                <dt className="text-xs text-slate-500">Capacity</dt>
                <dd className="mt-1 text-sm font-medium">
                  {roomType.max_adults + roomType.max_children} guest{roomType.max_adults + roomType.max_children === 1 ? "" : "s"}
                </dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <dt className="text-xs text-slate-500">Beds</dt>
                  <dd className="mt-1 text-sm font-medium">{roomType.bed_type}</dd>
              </div>
            </dl>
            {actions(roomType)}
          </article>
        ))}
      </div>
    </>
  );
}
