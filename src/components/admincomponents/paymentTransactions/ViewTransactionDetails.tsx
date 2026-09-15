import { Transaction } from "../../../apiservice/transactions-service.type";

type Props = {
  transaction: Transaction;
};

const currency = (value: number | string, code = "NGN") =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: code || "NGN",
    maximumFractionDigits: 0,
  }).format(Number(value));

const statusBadge = (value: string) => {
  if (value === "PAID") return "bg-emerald-100 text-emerald-700";
  if (value === "PENDING") return "bg-amber-100 text-amber-700";
  if (value === "FAILED") return "bg-rose-100 text-rose-700";
  if (value === "REFUNDED") return "bg-slate-200 text-slate-700";
  return "bg-slate-100 text-slate-700";
};

const directionBadge = (value: string) =>
  value === "INFLOW" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700";

export default function ViewTransactionDetails({ transaction }: Props) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Transaction</h3>
          <p className="text-sm text-slate-700">
            Ref: <span className="font-medium text-slate-900">{transaction.payment_reference}</span>
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Method: <span className="font-medium text-slate-900">{transaction.payment_method?.name}</span>
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Gateway: <span className="font-medium text-slate-900">{transaction.payment_gateway}</span>
          </p>
          {transaction.transaction_id && (
            <p className="mt-1 text-sm text-slate-700">
              Gateway ref: <span className="font-medium text-slate-900">{transaction.transaction_id}</span>
            </p>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Amount</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">
            {currency(transaction.amount, transaction.currency)}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusBadge(transaction.status)}`}>
              {transaction.status}
            </span>
            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${directionBadge(transaction.direction)}`}>
              {transaction.direction}
            </span>
            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              {transaction.type}
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Paid at: {transaction.paid_at ? new Date(transaction.paid_at).toLocaleString() : "Not paid yet"}
          </p>
        </div>
      </div>

      {transaction.booking && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Booking</h3>
          <p className="text-sm text-slate-700">
            Ref: <span className="font-medium text-slate-900">{transaction.booking.booking_reference}</span>
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Guest:{" "}
            <span className="font-medium text-slate-900">
              {transaction.booking.guest?.first_name} {transaction.booking.guest?.last_name}
            </span>
          </p>
          <p className="mt-1 text-sm text-slate-700">{transaction.booking.guest?.phone}</p>
          {transaction.booking.booking_rooms?.map((room) => (
            <div key={room.id} className="mt-2 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
              Room {room.room?.room_number} (Floor {room.room?.floor}) — {room.check_in_date} to {room.check_out_date}
            </div>
          ))}
        </div>
      )}

      {transaction.laundry_order && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Laundry Order</h3>
          <p className="text-sm text-slate-700">
            Ref: <span className="font-medium text-slate-900">{transaction.laundry_order.order_reference}</span>
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Guest:{" "}
            <span className="font-medium text-slate-900">
              {transaction.laundry_order.guest?.first_name} {transaction.laundry_order.guest?.last_name}
            </span>
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Room: {transaction.laundry_order.room?.room_number} (Floor {transaction.laundry_order.room?.floor})
          </p>
          <div className="mt-2 space-y-2">
            {transaction.laundry_order.items?.map((item, idx) => (
              <div key={idx} className="rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
                {item.laundry_item_type?.name} x {item.quantity} — {currency(item.total)}
              </div>
            ))}
          </div>
        </div>
      )}

      {transaction.expense && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Expense</h3>
          <p className="text-sm text-slate-700">
            Description: <span className="font-medium text-slate-900">{transaction.expense.description}</span>
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Vendor: <span className="font-medium text-slate-900">{transaction.expense.vendor?.name}</span>
          </p>
          <p className="mt-1 text-sm text-slate-700">{transaction.expense.vendor?.phone}</p>
          <div className="mt-2 space-y-2">
            {transaction.expense.items?.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
                {item.name} x {item.quantity} — {currency(item.total)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
