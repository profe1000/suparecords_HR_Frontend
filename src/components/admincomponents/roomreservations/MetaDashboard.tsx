import { useState } from "react";
import { BookingListResponse } from "./roomReservations.types";

type Props = {
  meta: BookingListResponse["meta"];
};

const currency = (value: number | undefined) =>
  value ? new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value) : "₦0";

const paymentMethodColors: Record<string, { bg: string; text: string; icon: string }> = {
  cash: { bg: "bg-green-100", text: "text-green-700", icon: "💵" },
  paystack: { bg: "bg-blue-100", text: "text-blue-700", icon: "💳" },
  card: { bg: "bg-purple-100", text: "text-purple-700", icon: "🪳" },
  bank_transfer: { bg: "bg-indigo-100", text: "text-indigo-700", icon: "🏦" },
  default: { bg: "bg-slate-100", text: "text-slate-700", icon: "💰" },
};

export default function MetaDashboard({ meta }: Props) {
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);

  if (!meta) return null;

  const getPaymentMethodStyle = (type: string) => {
    return paymentMethodColors[type.toLowerCase()] || paymentMethodColors.default;
  };

  return (
    <>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Bookings */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Total Bookings</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {meta.number_of_booking_session || 0}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Rooms Booked */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Rooms Booked</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {meta.number_of_rooms_booked || 0}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
            <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Paid Transactions */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Paid Transactions</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-600">
              {meta.paid_transactions || 0}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
            <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Pending Transactions */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Pending Transactions</p>
            <p className="mt-2 text-2xl font-semibold text-amber-600">
              {meta.pending_transactions || 0}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
            <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Amount Paid */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Amount Paid</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">
              {currency(meta.amount_paid)}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Amount on Credit */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Amount on Credit</p>
            <p className="mt-2 text-xl font-semibold text-orange-600">
              {currency(meta.amount_on_credit)}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
            <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    {/* Payment Method Distribution */}
    {meta.distribution_by_payment_method && meta.distribution_by_payment_method.length > 0 && (
      <div className="mb-6">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 p-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Payment Method Distribution</h3>
              <p className="mt-1 text-sm text-slate-500">Breakdown of payments by method</p>
            </div>
            <button
              type="button"
              onClick={() => setShowPaymentMethods(!showPaymentMethods)}
              className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              {showPaymentMethods ? "Hide" : "View"}
            </button>
          </div>

          {showPaymentMethods && (
            <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
              {meta.distribution_by_payment_method.map((distribution, idx) => {
                const style = getPaymentMethodStyle(distribution.payment_method.type);
                return (
                  <div
                    key={idx}
                    className="rounded-lg border border-slate-100 bg-slate-50 p-4 hover:border-slate-200 hover:bg-white transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${style.bg}`}>
                          <span className="text-lg">{style.icon}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{distribution.payment_method.name}</p>
                          <p className="text-xs text-slate-500">{distribution.payment_method.description}</p>
                        </div>
                      </div>
                    </div>
                    {distribution.payment_method.is_default && (
                      <div className="mt-2">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                          Default
                        </span>
                      </div>
                    )}
                    <div className="mt-3 border-t border-slate-200 pt-3">
                      <p className={`text-sm text-slate-500`}>Amount Paid</p>
                      <p className={`text-lg font-semibold ${style.text}`}>
                        {currency(distribution.amount)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    )}
    </>
  );
}
