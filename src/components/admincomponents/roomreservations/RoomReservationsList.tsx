import { LoadingOutlined } from "@ant-design/icons";
import { Booking } from "./roomReservations.types";

type Props = {
  reservations: Booking[];
  loading?: boolean;
  actionLoadingId?: number | null;
  actionType?: "checkin" | "checkout" | "cancel" | null;
  onView: (reservation: Booking) => void;
  onAddPayment: (reservation: Booking) => void;
  onCheckIn: (reservation: Booking) => void;
  onCheckOut: (reservation: Booking) => void;
  onCancel: (reservation: Booking) => void;
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

const getStayWindow = (reservation: Booking) => {
  if (!reservation.booking_rooms.length) {
    return { checkIn: "-", checkOut: "-" };
  }

  const checkIns = reservation.booking_rooms.map((room) => room.check_in_date).filter(Boolean).sort();
  const checkOuts = reservation.booking_rooms
    .map((room) => room.check_out_date)
    .filter(Boolean)
    .sort();

  return {
    checkIn: checkIns[0] || "-",
    checkOut: checkOuts[checkOuts.length - 1] || "-",
  };
};

export default function RoomReservationsList({
  reservations,
  loading,
  actionLoadingId,
  actionType,
  onView,
  onAddPayment,
  onCheckIn,
  onCheckOut,
  onCancel,
}: Props) {
  const actions = (reservation: Booking) => {
    const isBusy = actionLoadingId === reservation.id;
    const isCheckingIn = isBusy && actionType === "checkin";
    const isCheckingOut = isBusy && actionType === "checkout";
    const isCancelling = isBusy && actionType === "cancel";
    return (
      <div className="flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => onView(reservation)}
          disabled={isBusy}
          className="rounded-lg border border-slate-400 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          View
        </button>
        <button
          type="button"
          onClick={() => onAddPayment(reservation)}
          disabled={isBusy}
          className="rounded-lg border border-emerald-600 px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-60"
        >
          Add Payment
        </button>
        <button
          type="button"
          onClick={() => onCheckIn(reservation)}
          disabled={isBusy}
          className="inline-flex items-center gap-2 rounded-lg border border-emerald-600 px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-60"
        >
          {isCheckingIn && <LoadingOutlined />}
          Check-in
        </button>
        <button
          type="button"
          onClick={() => onCheckOut(reservation)}
          disabled={isBusy}
          className="inline-flex items-center gap-2 rounded-lg border border-blue-700 px-3 py-2 text-sm font-medium text-blue-800 transition hover:bg-blue-50 disabled:opacity-60"
        >
          {isCheckingOut && <LoadingOutlined />}
          Check-out
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Cancel booking ${reservation.booking_reference}?`)) {
              onCancel(reservation);
            }
          }}
          disabled={isBusy}
          className="inline-flex items-center gap-2 rounded-lg border border-red-500 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
        >
          {isCancelling && <LoadingOutlined />}
          Cancel
        </button>
      </div>
    );
  };

  if (loading) {
    return <div className="py-10 text-center text-slate-500">Loading reservations...</div>;
  }

  if (reservations.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-slate-500">
        No reservations yet.
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
              <th className="px-3 py-3">Guest Info</th>
              <th className="px-3 py-3">Rooms</th>
              <th className="px-3 py-3">Stay window</th>
              <th className="px-3 py-3">Payment</th>
              <th className="px-3 py-3">Booking</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => {
              const stay = getStayWindow(reservation);
              const firstRoom = reservation.booking_rooms[0];

              return (
                <tr
                  key={reservation.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                >
                  <td className="px-3 py-4 font-medium text-slate-900">{reservation.booking_reference}</td>
                  <td className="px-3 py-4 text-slate-700">
                    <div className="font-medium text-slate-900">
                      {reservation.guest?.first_name} {reservation.guest?.last_name}
                    </div>
                    <div className="text-xs text-slate-500">{reservation.guest?.email}</div>
                    <div className="text-xs text-slate-500">{reservation.guest?.phone}</div>
                  </td>
                  <td className="px-3 py-4 text-slate-700">
                    <div>{reservation.total_rooms} room(s)</div>
                    <div className="text-xs text-slate-500">
                      {firstRoom ? `Room #${firstRoom.room_id}` : "-"}
                    </div>
                  </td>
                  <td className="px-3 py-4 text-slate-700">
                    <div>{stay.checkIn}</div>
                    <div className="text-xs text-slate-500">to {stay.checkOut}</div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="mb-1 text-xs text-slate-500">
                      {currency(Number(reservation.payment_made))} / {currency(Number(reservation.grand_total))}
                    </div>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${paymentBadge(reservation.payment_status)}`}
                    >
                      {reservation.payment_status}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${reservationBadge(reservation.booking_status)}`}
                    >
                      {reservation.booking_status}
                    </span>
                  </td>
                  <td className="px-3 py-4">{actions(reservation)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {reservations.map((reservation) => {
          const stay = getStayWindow(reservation);

          return (
            <article
              key={reservation.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{reservation.booking_reference}</h3>
                  <p className="mt-1 text-sm text-slate-700">
                    {reservation.guest?.first_name} {reservation.guest?.last_name}
                  </p>
                  <p className="text-xs text-slate-500">{reservation.guest?.email}</p>
                  <p className="text-xs text-slate-500">{reservation.guest?.phone}</p>
                </div>
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${paymentBadge(reservation.payment_status)}`}
                >
                  {reservation.payment_status}
                </span>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-slate-50 p-2">
                  <dt className="text-xs text-slate-500">Rooms</dt>
                  <dd className="mt-1 text-sm font-medium text-slate-800">{reservation.total_rooms}</dd>
                </div>
                <div className="rounded-lg bg-slate-50 p-2">
                  <dt className="text-xs text-slate-500">Stay</dt>
                  <dd className="mt-1 text-sm font-medium text-slate-800">
                    {stay.checkIn} - {stay.checkOut}
                  </dd>
                </div>
              </dl>

              <div className="mt-4">{actions(reservation)}</div>
            </article>
          );
        })}
      </div>
    </>
  );
}
