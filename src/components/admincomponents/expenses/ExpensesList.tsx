import { LoadingOutlined } from "@ant-design/icons";
import { Expense } from "../../../apiservice/expenses-records-service.type";

type Props = {
  expenses: Expense[];
  loading?: boolean;
  deletingId?: number | null;
  onView: (expense: Expense) => void;
  onAddPayment: (expense: Expense) => void;
  onApprove: (expense: Expense, approved: boolean) => void;
  onDelete: (expense: Expense) => void;
};

const currency = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);

const statusBadge = (value: string) => {
  if (value === "PAID" || value === "APPROVED") return "bg-emerald-100 text-emerald-700";
  if (value === "PARTIALLY_PAID") return "bg-blue-100 text-blue-700";
  if (value === "REJECTED") return "bg-rose-100 text-rose-700";
  return "bg-amber-100 text-amber-700";
};

const approvalBadge = (approved: boolean) =>
  approved ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700";

export default function ExpensesList({ expenses, loading, deletingId, onView, onAddPayment, onApprove, onDelete }: Props) {
  const actions = (expense: Expense) => {
    const isApproved = Boolean(expense.approved_by);
    const isDeleting = deletingId === expense.id;
    return (
      <div className="flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => onView(expense)}
          disabled={isDeleting}
          className="rounded-lg border border-slate-400 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          View
        </button>
        <button
          type="button"
          onClick={() => onAddPayment(expense)}
          className="rounded-lg border border-emerald-600 px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
        >
          Add Payment
        </button>
        <button
          type="button"
          onClick={() => onApprove(expense, !isApproved)}
          className={
            isApproved
              ? "rounded-lg border border-amber-600 px-3 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-50"
              : "rounded-lg border border-blue-700 px-3 py-2 text-sm font-medium text-blue-800 transition hover:bg-blue-50"
          }
        >
          {isApproved ? "Revoke Approval" : "Approve"}
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Delete expense ${expense.reference}?`)) {
              onDelete(expense);
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
    return <div className="py-10 text-center text-slate-500">Loading expenses...</div>;
  }

  if (expenses.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-slate-500">
        No expenses yet.
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
              <th className="px-3 py-3">Vendor</th>
              <th className="px-3 py-3">Category</th>
              <th className="px-3 py-3">Items</th>
              <th className="px-3 py-3">Total</th>
              <th className="px-3 py-3">Paid</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Approved</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70">
                <td className="px-3 py-4 font-medium text-slate-900">{expense.reference}</td>
                <td className="px-3 py-4 text-slate-700">
                  <div className="font-medium text-slate-900">
                    {expense.vendor?.company_name || `${expense.vendor?.first_name} ${expense.vendor?.last_name}`}
                  </div>
                  <div className="text-xs text-slate-500">{expense.vendor?.phone}</div>
                </td>
                <td className="px-3 py-4 text-slate-700">{expense.expense_category?.name}</td>
                <td className="px-3 py-4 text-slate-700">{expense.items?.length || 0} items</td>
                <td className="px-3 py-4 text-sm font-medium text-slate-900">{currency(expense.amount)}</td>
                <td className="px-3 py-4 text-sm text-emerald-700">{currency(expense.amountPaid)}</td>
                <td className="px-3 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusBadge(expense.status)}`}>
                    {expense.status}
                  </span>
                </td>
                <td className="px-3 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${approvalBadge(Boolean(expense.approved_by))}`}>
                    {expense.approved_by ? "Approved" : "Pending"}
                  </span>
                </td>
                <td className="px-3 py-4">{actions(expense)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {expenses.map((expense) => (
          <article key={expense.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900">{expense.reference}</h3>
                <p className="mt-1 text-sm text-slate-700">
                  {expense.vendor?.company_name || `${expense.vendor?.first_name} ${expense.vendor?.last_name}`}
                </p>
                <p className="text-xs text-slate-500">{expense.expense_category?.name}</p>
              </div>
              <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusBadge(expense.status)}`}>
                {expense.status}
              </span>
            </div>

            <div className="mt-2">
              <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${approvalBadge(Boolean(expense.approved_by))}`}>
                {expense.approved_by ? "Approved" : "Pending approval"}
              </span>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-slate-50 p-2">
                <dt className="text-xs text-slate-500">Items</dt>
                <dd className="mt-1 text-sm font-medium text-slate-800">{expense.items?.length || 0}</dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <dt className="text-xs text-slate-500">Total</dt>
                <dd className="mt-1 text-sm font-medium text-slate-800">{currency(expense.amount)}</dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <dt className="text-xs text-slate-500">Paid</dt>
                <dd className="mt-1 text-sm font-medium text-slate-800">{currency(expense.amountPaid)}</dd>
              </div>
            </dl>

            <div className="mt-4">{actions(expense)}</div>
          </article>
        ))}
      </div>
    </>
  );
}
