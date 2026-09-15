import { useEffect, useState } from "react";
import { getVendor } from "../../../apiservice/vendors-service";
import { Vendor } from "./vendor.types";

type Props = {
  vendorId?: string;
};

const currency = (value: string | number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(value));

const statusBadge = (status: Vendor["status"]) =>
  status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700";

export default function VendorDetailsCard({ vendorId }: Props) {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!vendorId) return;
    setLoading(true);
    setError("");
    getVendor(vendorId)
      .then((response) => setVendor(response))
      .catch((requestError) => setError(requestError?.response?.data?.message || "Unable to load vendor."))
      .finally(() => setLoading(false));
  }, [vendorId]);

  if (loading) {
    return <div className="py-10 text-center text-slate-500">Loading vendor...</div>;
  }

  if (error || !vendor) {
    return (
      <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error || "Vendor not found."}
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{vendor.name}</h1>
          <p className="mt-1 text-sm text-slate-500">Vendor profile and credit summary.</p>
        </div>
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusBadge(vendor.status)}`}>
          {vendor.status}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Contact</h3>
          <p className="text-sm text-slate-700">
            {vendor.first_name} {vendor.last_name}
          </p>
          <p className="mt-1 text-sm text-slate-700">Email: <span className="font-medium text-slate-900">{vendor.email}</span></p>
          <p className="mt-1 text-sm text-slate-700">Phone: <span className="font-medium text-slate-900">{vendor.phone}</span></p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Company</h3>
          <p className="text-sm text-slate-700">{vendor.company_name || "-"}</p>
          <p className="mt-1 text-sm text-slate-700">{vendor.address}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:col-span-2">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Balances</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs text-slate-500">Opening balance</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{currency(vendor.opening_balance)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Credit balance</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{currency(vendor.credit_balance)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Active Credits</h3>
        {vendor.active_credits.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center text-sm text-slate-500">
            No active credits.
          </div>
        ) : (
          <div className="space-y-3">
            {vendor.active_credits.map((credit) => (
              <div
                key={credit.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-3"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">{credit.description}</p>
                  <p className="mt-1 text-xs text-slate-500">{credit.created_at.slice(0, 10)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{currency(credit.remaining_amount)}</p>
                  <p className="mt-1 text-xs text-slate-500">of {currency(credit.original_amount)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
