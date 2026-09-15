import { LoadingOutlined } from "@ant-design/icons";
import { Vendor } from "./vendor.types";

type Props = {
  vendors: Vendor[];
  loading?: boolean;
  deletingId?: number | null;
  onView: (vendor: Vendor) => void;
  onEdit: (vendor: Vendor) => void;
  onDelete: (vendor: Vendor) => void;
};

const statusBadge = (status: Vendor["status"]) =>
  status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700";

export default function VendorList({ vendors, loading, deletingId, onView, onEdit, onDelete }: Props) {
  const actions = (vendor: Vendor) => {
    const isDeleting = deletingId === vendor.id;
    return (
      <div className="flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => onView(vendor)}
          disabled={isDeleting}
          className="rounded-lg border border-slate-400 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          View
        </button>
        <button
          type="button"
          onClick={() => onEdit(vendor)}
          disabled={isDeleting}
          className="rounded-lg border border-blue-700 px-3 py-2 text-sm font-medium text-blue-800 transition hover:bg-blue-50 disabled:opacity-60"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Delete ${vendor.name}?`)) onDelete(vendor);
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
    return <div className="py-10 text-center text-slate-500">Loading vendors...</div>;
  }

  if (vendors.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-slate-500">
        No vendors yet.
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-3">Vendor</th>
              <th className="px-3 py-3">Company</th>
              <th className="px-3 py-3">Contact</th>
              <th className="px-3 py-3">Credit Balance</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70">
                <td className="px-3 py-4">
                  <div className="font-medium text-slate-900">{vendor.name}</div>
                  <div className="mt-1 text-xs text-slate-500">
                    {vendor.first_name} {vendor.last_name}
                  </div>
                </td>
                <td className="px-3 py-4 text-slate-700">{vendor.company_name || "-"}</td>
                <td className="px-3 py-4">
                  <div className="text-slate-700">{vendor.email}</div>
                  <div className="mt-1 text-xs text-slate-500">{vendor.phone}</div>
                </td>
                <td className="px-3 py-4 text-slate-700">{vendor.credit_balance}</td>
                <td className="px-3 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusBadge(vendor.status)}`}
                  >
                    {vendor.status}
                  </span>
                </td>
                <td className="px-3 py-4">{actions(vendor)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {vendors.map((vendor) => (
          <article key={vendor.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900">{vendor.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{vendor.company_name || "-"}</p>
              </div>
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusBadge(vendor.status)}`}
              >
                {vendor.status}
              </span>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-slate-50 p-2">
                <dt className="text-xs text-slate-500">Contact</dt>
                <dd className="mt-1 text-sm font-medium text-slate-800">{vendor.phone}</dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <dt className="text-xs text-slate-500">Credit Balance</dt>
                <dd className="mt-1 text-sm font-medium text-slate-800">{vendor.credit_balance}</dd>
              </div>
            </dl>

            <div className="mt-4">{actions(vendor)}</div>
          </article>
        ))}
      </div>
    </>
  );
}
