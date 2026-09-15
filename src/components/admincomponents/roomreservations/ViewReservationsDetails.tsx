import AddReservationsPayments from "./AddReservationsPayments";
import { Booking } from "./roomReservations.types";

type Props = {
  reservation: Booking;
};

const currency = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);

const paymentBadge = (value: string) => {
  if (value === "COMPLETELYPAID") return "bg-emerald-100 text-emerald-700";
  if (value === "PartiallyPaid") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
};

const reservationBadge = (value: string) => {
  if (value === "Booked" || value === "CheckedIn" || value === "CheckedOut") {
    return "bg-emerald-100 text-emerald-700";
  }
  if (value === "Cancelled") return "bg-rose-100 text-rose-700";
  return "bg-amber-100 text-amber-700";
};

export default function ViewReservationsDetails({ reservation }: Props) {
  const adults = reservation.booking_rooms.reduce((sum, room) => sum + room.adult_count, 0);
  const children = reservation.booking_rooms.reduce((sum, room) => sum + room.children_count, 0);
  const grandTotal = Number(reservation.grand_total);
  const paidTotal = Number(reservation.payment_made);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Guest</h3>
          <p className="text-sm font-medium text-slate-900">Guest ID: {reservation.guest_id}</p>
          <p className="mt-1 text-sm text-slate-600">Branch ID: {reservation.branch_id}</p>
          <p className="mt-1 text-sm text-slate-600">Source: {reservation.booking_source || "-"}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Booking</h3>
          <p className="text-sm text-slate-700">
            Ref: <span className="font-medium text-slate-900">{reservation.booking_reference}</span>
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Rooms: <span className="font-medium text-slate-900">{reservation.total_rooms}</span>
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Guests: <span className="font-medium text-slate-900">{adults} adult(s), {children} child(ren)</span>
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Grand total</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{currency(grandTotal)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Amount paid</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{currency(paidTotal)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Outstanding</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {currency(Math.max(grandTotal - paidTotal, 0))}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Subtotal</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{currency(Number(reservation.subtotal))}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Discount</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{currency(Number(reservation.discount))}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Tax</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{currency(Number(reservation.tax))}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Service charge</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{currency(Number(reservation.service_charge))}</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Booked Rooms</h3>
        <div className="space-y-3">
          {reservation.booking_rooms.map((room) => (
            <div key={room.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-xs text-slate-500">Room</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">#{room.room_id}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Stay</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {room.check_in_date} to {room.check_out_date}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Guests</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {room.adult_count} adult(s), {room.children_count} child(ren)
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Nights</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{room.number_of_nights}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Price / night</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{currency(Number(room.price_per_night))}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Reserved</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{room.reserved}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Room total</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{currency(Number(room.total_price))}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${paymentBadge(reservation.payment_status)}`}>
          Payment: {reservation.payment_status}
        </span>
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${reservationBadge(reservation.booking_status)}`}>
          Booking: {reservation.booking_status}
        </span>
      </div>

      {reservation.special_request && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-900">Special request</h3>
          <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            {reservation.special_request}
          </p>
        </div>
      )}

      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Payments</h3>
        <AddReservationsPayments payments={reservation.payments} />
      </div>
    </div>
  );
}

