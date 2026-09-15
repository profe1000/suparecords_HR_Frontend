import { LoadingOutlined } from "@ant-design/icons";
import { PaymentMethod } from "./paymentMethod.types";

type Props = {
  paymentMethods: PaymentMethod[];
  loading?: boolean;
  deletingId?: number | null;
  onEdit: (paymentMethod: PaymentMethod) => void;
  onDelete: (paymentMethod: PaymentMethod) => void;
};

const statusBadge = (status: PaymentMethod["status"]) =>
  status === "ACTIVE"
    ? "bg-emerald-100 text-emerald-700"
    : "bg-rose-100 text-rose-700";

export default function PaymentMethodList({
  paymentMethods,
  loading,
  deletingId,
  onEdit,
  onDelete,
}: Props) {
  const actions = (paymentMethod: PaymentMethod) => {
    const isDeleting = deletingId === paymentMethod.id;
    return (
      <div className="flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => onEdit(paymentMethod)}
          disabled={isDeleting}
          className="rounded-lg border border-blue-700 px-3 py-2 text-sm font-medium text-blue-800 transition hover:bg-blue-50 disabled:opacity-60"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Delete ${paymentMethod.name}?`)) onDelete(paymentMethod);
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
    return <div className="py-10 text-center text-slate-500">Loading payment methods...</div>;
  }

  if (paymentMethods.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-slate-500">
        No payment methods yet.
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Type</th>
              <th className="px-3 py-3">Default</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paymentMethods.map((paymentMethod) => (
              <tr
                key={paymentMethod.id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
              >
                <td className="px-3 py-4">
                  <div className="font-medium text-slate-900">{paymentMethod.name}</div>
                  {paymentMethod.description && (
                    <div className="mt-1 max-w-xs truncate text-xs text-slate-500">
                      {paymentMethod.description}
                    </div>
                  )}
                </td>
                <td className="px-3 py-4 text-slate-700">{paymentMethod.type}</td>
                <td className="px-3 py-4 text-slate-700">
                  {paymentMethod.is_default ? "Yes" : "No"}
                </td>
                <td className="px-3 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusBadge(paymentMethod.status)}`}
                  >
                    {paymentMethod.status}
                  </span>
                </td>
                <td className="px-3 py-4">{actions(paymentMethod)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {paymentMethods.map((paymentMethod) => (
          <article
            key={paymentMethod.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900">{paymentMethod.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{paymentMethod.type}</p>
              </div>
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusBadge(paymentMethod.status)}`}
              >
                {paymentMethod.status}
              </span>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-slate-50 p-2">
                <dt className="text-xs text-slate-500">Default</dt>
                <dd className="mt-1 text-sm font-medium text-slate-800">
                  {paymentMethod.is_default ? "Yes" : "No"}
                </dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <dt className="text-xs text-slate-500">Description</dt>
                <dd className="mt-1 text-sm font-medium text-slate-800">
                  {paymentMethod.description || "-"}
                </dd>
              </div>
            </dl>

            <div className="mt-4">{actions(paymentMethod)}</div>
          </article>
        ))}
      </div>
    </>
  );
}
