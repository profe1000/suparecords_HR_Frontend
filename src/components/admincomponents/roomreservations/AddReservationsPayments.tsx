import { BookingPayment } from "./roomReservations.types";

type Props = {
  payments: BookingPayment[];
};

const currency = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);

export default function AddReservationsPayments({ payments }: Props) {
  if (!payments.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-500">
        No payments recorded yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full min-w-[640px] text-left">
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr>
            <th className="px-3 py-3 text-xs uppercase tracking-wide text-slate-500">Date</th>
            <th className="px-3 py-3 text-xs uppercase tracking-wide text-slate-500">Gateway</th>
            <th className="px-3 py-3 text-xs uppercase tracking-wide text-slate-500">Reference</th>
            <th className="px-3 py-3 text-xs uppercase tracking-wide text-slate-500">Status</th>
            <th className="px-3 py-3 text-xs uppercase tracking-wide text-slate-500">Amount</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id} className="border-b border-slate-100 last:border-0">
              <td className="px-3 py-3 text-sm text-slate-700">{payment.paid_at?.slice(0, 10) || "-"}</td>
              <td className="px-3 py-3 text-sm text-slate-700">{payment.payment_gateway}</td>
              <td className="px-3 py-3 text-sm text-slate-700">{payment.payment_reference}</td>
              <td className="px-3 py-3 text-sm text-slate-700">{payment.status}</td>
              <td className="px-3 py-3 text-sm font-medium text-slate-900">
                {currency(Number(payment.amount))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
