import { LaundryOrder } from "../../../apiservice/laundry-orders-service.type";

type Props = {
  order: LaundryOrder;
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

export default function ViewLaundryOrderDetails({ order }: Props) {
  const outstanding = Math.max(order.total - order.payments_total, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Guest</h3>
          <p className="text-sm font-medium text-slate-900">
            {order.guest?.first_name} {order.guest?.last_name}
          </p>
          <p className="mt-1 text-sm text-slate-600">{order.guest?.email}</p>
          <p className="mt-1 text-sm text-slate-600">{order.guest?.phone}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Order</h3>
          <p className="text-sm text-slate-700">
            Ref: <span className="font-medium text-slate-900">{order.order_reference}</span>
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Room:{" "}
            <span className="font-medium text-slate-900">
              #{order.room?.room_number} (Floor {order.room?.floor})
            </span>
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Notes: <span className="font-medium text-slate-900">{order.notes || "-"}</span>
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Order total</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{currency(order.total)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Amount paid</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{currency(order.payments_total)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Outstanding</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{currency(outstanding)}</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Items</h3>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-xs text-slate-500">Item</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{item.laundry_item_type?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Quantity</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{item.quantity}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Unit price</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{currency(item.unit_price)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Item total</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{currency(item.total)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusBadge(order.status)}`}>
          Status: {order.status}
        </span>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Payments</h3>
        {order.payments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-500">
            No payments recorded yet.
          </div>
        ) : (
          <div className="space-y-3">
            {order.payments.map((payment) => (
              <div
                key={payment.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">{payment.payment_reference}</p>
                  <p className="mt-1 text-xs text-slate-500">{payment.payment_method?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{currency(payment.amount)}</p>
                  <p className="mt-1 text-xs text-slate-500">{payment.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
