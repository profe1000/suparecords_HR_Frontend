import { useState } from "react";
import { ExpenseListResponse } from "../../../apiservice/expenses-records-service.type";

interface ExpenseMetaDashboardProps {
  meta: ExpenseListResponse["meta"];
}

const paymentMethodColors: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  "1": { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", icon: "💰" },
  "2": { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", icon: "💳" },
  "3": { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", icon: "🏦" },
  "4": { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", icon: "📱" },
};

export default function ExpenseMetaDashboard({ meta }: ExpenseMetaDashboardProps) {
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);

  if (!meta) return null;

  const metricCards = [
    { label: "Total Expenses", value: meta.total || 0, icon: "📋", color: "text-blue-600" },
    { label: "Expense Items", value: meta.number_of_expenses_items || 0, icon: "🧾", color: "text-purple-600" },
    { label: "Paid Expenses", value: meta.paid_transactions || 0, icon: "✅", color: "text-emerald-600" },
    { label: "Pending Expenses", value: meta.pending_transactions || 0, icon: "⏳", color: "text-amber-600" },
    { label: "Amount Paid", value: `₦${(meta.amount_paid || 0)?.toLocaleString()}`, icon: "💚", color: "text-emerald-600" },
    { label: "Amount On Credit", value: `₦${(meta.amount_on_credit || 0)?.toLocaleString()}`, icon: "📊", color: "text-rose-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metricCards.map((card, idx) => (
          <div key={idx} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">{card.label}</p>
                <p className={`mt-1 text-2xl font-bold ${card.color}`}>{card.value}</p>
              </div>
              <span className="text-3xl">{card.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {meta.distribution_by_payment_method && meta.distribution_by_payment_method.length > 0 && (
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <button
            onClick={() => setShowPaymentMethods(!showPaymentMethods)}
            className="w-full px-4 py-4 text-left hover:bg-slate-50 transition flex items-center justify-between"
          >
            <div>
              <h3 className="font-semibold text-slate-900">Payment Method Distribution</h3>
              <p className="mt-1 text-sm text-slate-500">Total amount by payment method</p>
            </div>
            <span className={`text-xl transition ${showPaymentMethods ? "rotate-180" : ""}`}>▼</span>
          </button>

          {showPaymentMethods && (
            <div className="border-t border-slate-200 p-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {meta.distribution_by_payment_method.map((dist, idx) => {
                  const methodId = dist.method?.toString() || "1";
                  const colors = paymentMethodColors[methodId] || paymentMethodColors["1"];
                  return (
                    <div key={idx} className={`rounded-lg border-2 ${colors.border} ${colors.bg} p-4`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-sm font-medium ${colors.text}`}>
                            {dist.payment_method?.name || "Unknown"}
                          </p>
                          <p className={`mt-1 text-lg font-bold ${colors.text}`}>₦{dist.amount?.toLocaleString()}</p>
                        </div>
                        <span className="text-3xl">{colors.icon}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
