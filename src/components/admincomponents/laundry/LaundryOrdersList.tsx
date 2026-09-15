import { LoadingOutlined } from "@ant-design/icons";
import { LaundryOrder } from "../../../apiservice/laundry-orders-service.type";

type Props = {
  orders: LaundryOrder[];
  loading?: boolean;
  deletingId?: number | null;
  onView: (order: LaundryOrder) => void;
  onAddPayment: (order: LaundryOrder) => void;
  onDelete: (order: LaundryOrder) => void;
};

const currency = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);

const statusBadge = (value: string) => {
  if (value === "COMPLETED") return "bg-emerald-100 text-emerald-700";
  if (value === "IN_PROGRESS") return "bg-blue-100 text-blue-700";
  if (value === "CANCELLED") return "bg-rose-100 text-rose-700";
  return "bg-amber-100 text-amber-700";
};

export default function LaundryOrdersList({ orders, loading, deletingId, onView, onAddPayment, onDelete }: Props) {
  const actions = (order: LaundryOrder) => {
    const isDeleting = deletingId === order.id;
    return (
      <div className="flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => onView(order)}
          disabled={isDeleting}
          className="rounded-lg border border-slate-400 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          View
        </button>
        <button
          type="button"
          onClick={() => onAddPayment(order)}
          className="rounded-lg border border-emerald-600 px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
        >
          Add Payment
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Delete laundry order ${order.order_reference}?`)) {
              onDelete(order);
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
    return <div className="py-10 text-center text-slate-500">Loading laundry orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-slate-500">
        No laundry orders yet.
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-3">Reference</th>
              <th className="px-3 py-3">Guest Info</th>
              <th className="px-3 py-3">Room</th>
              <th className="px-3 py-3">Items</th>
              <th className="px-3 py-3">Total</th>
              <th className="px-3 py-3">Paid</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70">
                <td className="px-3 py-4 font-medium text-slate-900">{order.order_reference}</td>
                <td className="px-3 py-4 text-slate-700">
                  <div className="font-medium text-slate-900">
                    {order.guest?.first_name} {order.guest?.last_name}
                  </div>
                  <div className="text-xs text-slate-500">{order.guest?.email}</div>
                  <div className="text-xs text-slate-500">{order.guest?.phone}</div>
                </td>
                <td className="px-3 py-4 text-slate-700">
                  <div>Room {order.room?.room_number}</div>
                  <div className="text-xs text-slate-500">Floor {order.room?.floor}</div>
                </td>
                <td className="px-3 py-4 text-slate-700">{order.items?.length || 0} items</td>
                <td className="px-3 py-4 text-sm font-medium text-slate-900">{currency(order.total)}</td>
                <td className="px-3 py-4 text-sm text-emerald-700">{currency(order.payments_total)}</td>
                <td className="px-3 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-3 py-4">{actions(order)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {orders.map((order) => (
          <article key={order.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900">{order.order_reference}</h3>
                <p className="mt-1 text-sm text-slate-700">
                  {order.guest?.first_name} {order.guest?.last_name}
                </p>
                <p className="text-xs text-slate-500">{order.guest?.phone}</p>
              </div>
              <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusBadge(order.status)}`}>
                {order.status}
              </span>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-slate-50 p-2">
                <dt className="text-xs text-slate-500">Room</dt>
                <dd className="mt-1 text-sm font-medium text-slate-800">
                  {order.room?.room_number} (Floor {order.room?.floor})
                </dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <dt className="text-xs text-slate-500">Items</dt>
                <dd className="mt-1 text-sm font-medium text-slate-800">{order.items?.length || 0}</dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <dt className="text-xs text-slate-500">Total</dt>
                <dd className="mt-1 text-sm font-medium text-slate-800">{currency(order.total)}</dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <dt className="text-xs text-slate-500">Paid</dt>
                <dd className="mt-1 text-sm font-medium text-slate-800">{currency(order.payments_total)}</dd>
              </div>
            </dl>

            <div className="mt-4">{actions(order)}</div>
          </article>
        ))}
      </div>
    </>
  );
}

