import { Expense } from "../../../apiservice/expenses-records-service.type";

type Props = {
  expense: Expense;
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

export default function ViewExpenseDetails({ expense }: Props) {
  const outstanding = Math.max(expense.amount - expense.amountPaid, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Vendor</h3>
          <p className="text-sm font-medium text-slate-900">
            {expense.vendor?.company_name || `${expense.vendor?.first_name} ${expense.vendor?.last_name}`}
          </p>
          <p className="mt-1 text-sm text-slate-600">{expense.vendor?.email}</p>
          <p className="mt-1 text-sm text-slate-600">{expense.vendor?.phone}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Expense</h3>
          <p className="text-sm text-slate-700">
            Ref: <span className="font-medium text-slate-900">{expense.reference}</span>
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Category: <span className="font-medium text-slate-900">{expense.expense_category?.name}</span>
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Description: <span className="font-medium text-slate-900">{expense.description}</span>
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Expense total</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{currency(expense.amount)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Amount paid</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{currency(expense.amountPaid)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Outstanding</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{currency(outstanding)}</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Items</h3>
        <div className="space-y-3">
          {expense.items.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-xs text-slate-500">Item</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{item.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Quantity</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{item.quantity}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Unit cost</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{currency(item.unit_cost)}</p>
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
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusBadge(expense.status)}`}>
          Status: {expense.status}
        </span>
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
            expense.approved_by ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
          }`}
        >
          {expense.approved_by ? "Approved" : "Pending approval"}
        </span>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Payments</h3>
        {expense.payments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-500">
            No payments recorded yet.
          </div>
        ) : (
          <div className="space-y-3">
            {expense.payments.map((payment) => (
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
