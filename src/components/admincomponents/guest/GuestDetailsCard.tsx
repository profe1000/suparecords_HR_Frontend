import { useEffect, useState } from "react";
import { getGuest } from "../../../apiservice/guests-service";
import { Guest } from "./guest.types";

type Props = {
  guestId?: string;
};

const currency = (value: string | number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(value));

const verifiedBadge = (verified: boolean) =>
  verified ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700";

export default function GuestDetailsCard({ guestId }: Props) {
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!guestId) return;
    setLoading(true);
    setError("");
    getGuest(guestId)
      .then((response) => setGuest(response))
      .catch((requestError) => setError(requestError?.response?.data?.message || "Unable to load guest."))
      .finally(() => setLoading(false));
  }, [guestId]);

  if (loading) {
    return <div className="py-10 text-center text-slate-500">Loading guest...</div>;
  }

  if (error || !guest) {
    return (
      <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error || "Guest not found."}
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-slate-900">
          {guest.first_name} {guest.last_name}
        </h1>
        <p className="mt-1 text-sm text-slate-500">Guest profile and credit summary.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Contact</h3>
          <p className="text-sm text-slate-700">Email: <span className="font-medium text-slate-900">{guest.email}</span></p>
          <p className="mt-1 text-sm text-slate-700">Phone: <span className="font-medium text-slate-900">{guest.phone}</span></p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${verifiedBadge(guest.email_verified)}`}>
              Email {guest.email_verified ? "verified" : "unverified"}
            </span>
            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${verifiedBadge(guest.phone_verified)}`}>
              Phone {guest.phone_verified ? "verified" : "unverified"}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Identification</h3>
          <p className="text-sm text-slate-700">Gender: <span className="font-medium text-slate-900">{guest.gender}</span></p>
          <p className="mt-1 text-sm text-slate-700">DOB: <span className="font-medium text-slate-900">{guest.date_of_birth}</span></p>
          <p className="mt-1 text-sm text-slate-700">
            {guest.id_type}: <span className="font-medium text-slate-900">{guest.id_number}</span>
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Location</h3>
          <p className="text-sm text-slate-700">{guest.address}</p>
          <p className="mt-1 text-sm text-slate-700">
            {[guest.city, guest.state, guest.country].filter(Boolean).join(", ")}
          </p>
          <p className="mt-1 text-sm text-slate-700">Nationality: {guest.nationality}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Balances</h3>
          <p className="text-sm text-slate-700">
            Opening balance: <span className="font-medium text-slate-900">{currency(guest.opening_balance)}</span>
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Credit balance: <span className="font-medium text-slate-900">{currency(guest.credit_balance)}</span>
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Active Credits</h3>
        {guest.active_credits.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center text-sm text-slate-500">
            No active credits.
          </div>
        ) : (
          <div className="space-y-3">
            {guest.active_credits.map((credit) => (
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
