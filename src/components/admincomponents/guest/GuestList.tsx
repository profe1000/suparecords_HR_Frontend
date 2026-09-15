import { LoadingOutlined } from "@ant-design/icons";
import { Guest } from "./guest.types";

type Props = {
  guests: Guest[];
  loading?: boolean;
  deletingId?: number | null;
  onView: (guest: Guest) => void;
  onEdit: (guest: Guest) => void;
  onDelete: (guest: Guest) => void;
};

const verifiedBadge = (verified: boolean) =>
  verified ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700";

export default function GuestList({ guests, loading, deletingId, onView, onEdit, onDelete }: Props) {
  const fullName = (guest: Guest) => `${guest.first_name} ${guest.last_name}`.trim();

  const actions = (guest: Guest) => {
    const isDeleting = deletingId === guest.id;
    return (
      <div className="flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => onView(guest)}
          disabled={isDeleting}
          className="rounded-lg border border-slate-400 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          View
        </button>
        <button
          type="button"
          onClick={() => onEdit(guest)}
          disabled={isDeleting}
          className="rounded-lg border border-blue-700 px-3 py-2 text-sm font-medium text-blue-800 transition hover:bg-blue-50 disabled:opacity-60"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Delete ${fullName(guest)}?`)) onDelete(guest);
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
    return <div className="py-10 text-center text-slate-500">Loading guests...</div>;
  }

  if (guests.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-slate-500">
        No guests yet.
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-3">Guest</th>
              <th className="px-3 py-3">Contact</th>
              <th className="px-3 py-3">Nationality</th>
              <th className="px-3 py-3">Location</th>
              <th className="px-3 py-3">Credit Balance</th>
              <th className="px-3 py-3">Verified</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest) => (
              <tr
                key={guest.id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
              >
                <td className="px-3 py-4">
                  <div className="font-medium text-slate-900">{fullName(guest)}</div>
                  {guest.id_type && (
                    <div className="mt-1 max-w-xs truncate text-xs text-slate-500">
                      {guest.id_type}: {guest.id_number}
                    </div>
                  )}
                </td>
                <td className="px-3 py-4 text-slate-700">
                  <div>{guest.email}</div>
                  <div className="mt-1 text-xs text-slate-500">{guest.phone}</div>
                </td>
                <td className="px-3 py-4 text-slate-700">{guest.nationality}</td>
                <td className="px-3 py-4 text-slate-700">
                  {[guest.city, guest.state, guest.country].filter(Boolean).join(", ")}
                </td>
                <td className="px-3 py-4 text-slate-700">{guest.credit_balance}</td>
                <td className="px-3 py-4">
                  <div className="flex flex-col gap-1">
                    <span
                      className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium ${verifiedBadge(guest.email_verified)}`}
                    >
                      Email {guest.email_verified ? "verified" : "unverified"}
                    </span>
                    <span
                      className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium ${verifiedBadge(guest.phone_verified)}`}
                    >
                      Phone {guest.phone_verified ? "verified" : "unverified"}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-4">{actions(guest)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {guests.map((guest) => (
          <article
            key={guest.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900">{fullName(guest)}</h3>
                <p className="mt-1 text-sm text-slate-500">{guest.email}</p>
              </div>
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${verifiedBadge(guest.email_verified)}`}
              >
                {guest.email_verified ? "Verified" : "Unverified"}
              </span>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-slate-50 p-2">
                <dt className="text-xs text-slate-500">Phone</dt>
                <dd className="mt-1 text-sm font-medium text-slate-800">{guest.phone}</dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <dt className="text-xs text-slate-500">Nationality</dt>
                <dd className="mt-1 text-sm font-medium text-slate-800">{guest.nationality}</dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <dt className="text-xs text-slate-500">Credit Balance</dt>
                <dd className="mt-1 text-sm font-medium text-slate-800">{guest.credit_balance}</dd>
              </div>
            </dl>

            <div className="mt-4">{actions(guest)}</div>
          </article>
        ))}
      </div>
    </>
  );
}