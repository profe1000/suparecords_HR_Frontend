import { LoadingOutlined } from "@ant-design/icons";
import { Transaction } from "../../../apiservice/transactions-service.type";

type Props = {
  transactions: Transaction[];
  loading?: boolean;
  deletingId?: number | null;
  onView: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
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

const counterparty = (transaction: Transaction) => {
  if (transaction.booking) {
    return {
      label: `${transaction.booking.guest?.first_name || ""} ${transaction.booking.guest?.last_name || ""}`.trim(),
      sub: transaction.booking.booking_reference,
    };
  }
  if (transaction.laundry_order) {
    return {
      label: `${transaction.laundry_order.guest?.first_name || ""} ${transaction.laundry_order.guest?.last_name || ""}`.trim(),
      sub: transaction.laundry_order.order_reference,
    };
  }
  if (transaction.expense) {
    return {
      label: transaction.expense.vendor?.name || "Vendor",
      sub: transaction.expense.description,
    };
  }
  return { label: "-", sub: "" };
};

export default function TransactionsList({ transactions, loading, deletingId, onView, onDelete }: Props) {
  const actions = (transaction: Transaction) => {
    const isDeleting = deletingId === transaction.id;
    return (
      <div className="flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => onView(transaction)}
          disabled={isDeleting}
          className="rounded-lg border border-slate-400 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          View
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Delete transaction ${transaction.payment_reference}?`)) {
              onDelete(transaction);
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
    return <div className="py-10 text-center text-slate-500">Loading transactions...</div>;
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-slate-500">
        No transactions yet.
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1200px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-3">Reference</th>
              <th className="px-3 py-3">Type</th>
              <th className="px-3 py-3">Counterparty</th>
              <th className="px-3 py-3">Method</th>
              <th className="px-3 py-3">Amount</th>
              <th className="px-3 py-3">Direction</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Paid at</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => {
              const party = counterparty(transaction);
              return (
                <tr key={transaction.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70">
                  <td className="px-3 py-4 font-medium text-slate-900">{transaction.payment_reference}</td>
                  <td className="px-3 py-4 text-slate-700">{transaction.type}</td>
                  <td className="px-3 py-4 text-slate-700">
                    <div className="font-medium text-slate-900">{party.label}</div>
                    <div className="text-xs text-slate-500">{party.sub}</div>
                  </td>
                  <td className="px-3 py-4 text-slate-700">{transaction.payment_method?.name}</td>
                  <td className="px-3 py-4 text-sm font-medium text-slate-900">
                    {currency(transaction.amount, transaction.currency)}
                  </td>
                  <td className="px-3 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${directionBadge(transaction.direction)}`}>
                      {transaction.direction}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusBadge(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-slate-700">
                    {transaction.paid_at ? transaction.paid_at.slice(0, 10) : "-"}
                  </td>
                  <td className="px-3 py-4">{actions(transaction)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {transactions.map((transaction) => {
          const party = counterparty(transaction);
          return (
            <article key={transaction.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{transaction.payment_reference}</h3>
                  <p className="mt-1 text-sm text-slate-700">{party.label}</p>
                  <p className="text-xs text-slate-500">{party.sub}</p>
                </div>
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusBadge(transaction.status)}`}>
                  {transaction.status}
                </span>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-slate-50 p-2">
                  <dt className="text-xs text-slate-500">Amount</dt>
                  <dd className="mt-1 text-sm font-medium text-slate-800">
                    {currency(transaction.amount, transaction.currency)}
                  </dd>
                </div>
                <div className="rounded-lg bg-slate-50 p-2">
                  <dt className="text-xs text-slate-500">Method</dt>
                  <dd className="mt-1 text-sm font-medium text-slate-800">{transaction.payment_method?.name}</dd>
                </div>
                <div className="rounded-lg bg-slate-50 p-2">
                  <dt className="text-xs text-slate-500">Direction</dt>
                  <dd className="mt-1 text-sm font-medium text-slate-800">{transaction.direction}</dd>
                </div>
                <div className="rounded-lg bg-slate-50 p-2">
                  <dt className="text-xs text-slate-500">Type</dt>
                  <dd className="mt-1 text-sm font-medium text-slate-800">{transaction.type}</dd>
                </div>
              </dl>

              <div className="mt-4">{actions(transaction)}</div>
            </article>
          );
        })}
      </div>
    </>
  );
}
