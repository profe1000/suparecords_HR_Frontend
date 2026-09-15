import { Payment } from "../roomreservations/roomReservations.types";
import { PaymentMethod } from "../paymentMethods/paymentMethod.types";

type Props = {
  payments: Payment[];
  paymentMethods: PaymentMethod[];
  loading?: boolean;
};

const currency = (value: number, code: string) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: code || "NGN",
    maximumFractionDigits: 0,
  }).format(value);

const statusBadge = (value: string) => {
  if (value === "PAID") return "bg-emerald-100 text-emerald-700";
  if (value === "PENDING") return "bg-amber-100 text-amber-700";
  if (value === "FAILED") return "bg-rose-100 text-rose-700";
  if (value === "REFUNDED") return "bg-slate-200 text-slate-700";
  return "bg-slate-100 text-slate-700";
};

export default function PaymentTransactionsList({ payments, paymentMethods, loading }: Props) {
  const methodName = (methodId: number) =>
    paymentMethods.find((method) => method.id === methodId)?.name || `Method #${methodId}`;

  if (loading) {
    return <div className="py-10 text-center text-slate-500">Loading payments...</div>;
  }

  if (payments.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-slate-500">
        No payments yet.
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-3">Reference</th>
              <th className="px-3 py-3">Booking</th>
              <th className="px-3 py-3">Method</th>
              <th className="px-3 py-3">Gateway</th>
              <th className="px-3 py-3">Amount</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Paid at</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70">
                <td className="px-3 py-4">
                  <div className="font-medium text-slate-900">{payment.payment_reference}</div>
                  {payment.transaction_id && (
                    <div className="mt-1 max-w-xs truncate text-xs text-slate-500">
                      Txn: {payment.transaction_id}
                    </div>
                  )}
                </td>
                <td className="px-3 py-4 text-slate-700">#{payment.booking_id}</td>
                <td className="px-3 py-4 text-slate-700">{methodName(payment.payment_method_id)}</td>
                <td className="px-3 py-4 text-slate-700">{payment.payment_gateway}</td>
                <td className="px-3 py-4 font-medium text-slate-900">
                  {currency(Number(payment.amount), payment.currency)}
                </td>
                <td className="px-3 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusBadge(payment.status)}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-3 py-4 text-slate-700">
                  {payment.paid_at ? payment.paid_at.slice(0, 10) : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {payments.map((payment) => (
          <article key={payment.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900">{payment.payment_reference}</h3>
                <p className="mt-1 text-sm text-slate-500">Booking #{payment.booking_id}</p>
              </div>
              <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusBadge(payment.status)}`}>
                {payment.status}
              </span>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-slate-50 p-2">
                <dt className="text-xs text-slate-500">Amount</dt>
                <dd className="mt-1 text-sm font-medium text-slate-800">
                  {currency(Number(payment.amount), payment.currency)}
                </dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <dt className="text-xs text-slate-500">Method</dt>
                <dd className="mt-1 text-sm font-medium text-slate-800">{methodName(payment.payment_method_id)}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </>
  );
}
