import { LoadingOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { useEffect, useMemo, useState } from "react";
import { appZIndex } from "../../../utils/appconst";
import AddBookingPaymentForm from "./AddBookingPaymentForm";
import AddEditReservations from "./AddEditReservations";
import RoomReservationsList from "./RoomReservationsList";
import ViewReservationsDetails from "./ViewReservationsDetails";
import MetaDashboard from "./MetaDashboard";
import { Booking, BookingListResponse, CreateBookingPayload, CreatePaymentPayload } from "./roomReservations.types";
import {
  cancelBooking,
  checkInBooking,
  checkOutBooking,
  createBooking,
  getBookings,
} from "../../../apiservice/bookings-service";
import { createPayment } from "../../../apiservice/payments-service";
import { useAppSelector } from "../../../Redux/reduxCustomHook";
import type { RootState } from "../../../Redux/store";

export default function RoomReservationsWrapper() {
  const [reservations, setReservations] = useState<Booking[]>([]);
  const [metaData, setMetaData] = useState<BookingListResponse["meta"] | null>(null);
  const [search, setSearch] = useState("");
  const [selectedReservation, setSelectedReservation] = useState<Booking | null>(null);
  const [paymentTargetReservation, setPaymentTargetReservation] = useState<Booking | null>(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<"checkin" | "checkout" | "cancel" | null>(null);
  const [error, setError] = useState("");
  const reservationFormId = "reservation-form";
  const paymentFormId = "reservation-payment-form";
  const authData = useAppSelector((state: RootState) => state.AdminAuthData);
  const branchId = authData.staff?.branch_id || authData.data?.id || 1;
  const staffId = authData.staff?.id || 0;

  const loadReservations = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getBookings({
        branch_id: branchId,
        page: 1,
        perPage: 20,
        sort_order: "desc",
        ...(search.trim() ? { search: search.trim() } : {}),
      });
      setReservations(response.data || []);
      setMetaData(response.meta || null);
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to load reservations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId, search]);

  const visibleReservations = useMemo(() => reservations, [reservations]);

  const openAddModal = () => setFormModalOpen(true);
  const closeFormModal = () => setFormModalOpen(false);

  const openDetailsModal = (reservation: Booking) => {
    setSelectedReservation(reservation);
    setDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedReservation(null);
  };

  const openPaymentModal = (reservation: Booking) => {
    setPaymentTargetReservation(reservation);
    setPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    setPaymentModalOpen(false);
    setPaymentTargetReservation(null);
  };

  const saveReservation = async (values: CreateBookingPayload) => {
    setSubmitting(true);
    try {
      await createBooking(values);
      setMessage("Reservation created successfully.");
      closeFormModal();
      await loadReservations();
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to create reservation.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckIn = async (reservation: Booking) => {
    setActionLoadingId(reservation.id);
    setActionType("checkin");
    try {
      await checkInBooking(reservation.id);
      setMessage("Guest checked in successfully.");
      await loadReservations();
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to check in reservation.");
    } finally {
      setActionLoadingId(null);
      setActionType(null);
    }
  };

  const handleCheckOut = async (reservation: Booking) => {
    setActionLoadingId(reservation.id);
    setActionType("checkout");
    try {
      await checkOutBooking(reservation.id);
      setMessage("Guest checked out successfully.");
      await loadReservations();
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to check out reservation.");
    } finally {
      setActionLoadingId(null);
      setActionType(null);
    }
  };

  const handleCancel = async (reservation: Booking) => {
    setActionLoadingId(reservation.id);
    setActionType("cancel");
    try {
      await cancelBooking(reservation.id);
      setMessage("Reservation cancelled successfully.");
      await loadReservations();
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to cancel reservation.");
    } finally {
      setActionLoadingId(null);
      setActionType(null);
    }
  };

  const savePayment = async (values: CreatePaymentPayload) => {
    setPaymentSubmitting(true);
    try {
      await createPayment(values);
      setMessage("Payment recorded successfully.");
      closePaymentModal();
      await loadReservations();
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to record payment.");
    } finally {
      setPaymentSubmitting(false);
    }
  };

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6">
      <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Room Reservations</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Manage booking records, room allocations, payment progress, and stay lifecycle.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center rounded-lg bg-red-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-900"
        >
          + Add Reservation
        </button>
      </div>

      {message && (
        <div
          role="status"
          className="mb-4 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          <span>{message}</span>
          <button type="button" onClick={() => setMessage("")} className="font-bold">
            x
          </button>
        </div>
      )}

      {metaData && <MetaDashboard meta={metaData} />}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-slate-900">Reservations register</h2>
            <p className="mt-1 text-sm text-slate-500">
              Search reservations by reference, guest or booking source.
            </p>
          </div>

          <div className="grid w-full gap-3 sm:w-auto">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search reservations"
              className="h-10 rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100"
            />
          </div>
        </div>

        {error && (
          <div role="alert" className="mx-4 mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="p-3 sm:p-4">
          <RoomReservationsList
            reservations={visibleReservations}
            loading={loading}
            actionLoadingId={actionLoadingId}
            actionType={actionType}
            onView={openDetailsModal}
            onAddPayment={openPaymentModal}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            onCancel={handleCancel}
          />
        </div>
      </section>

      <Modal
        zIndex={appZIndex.modal}
        open={formModalOpen}
        title="Add Reservation"
        onCancel={closeFormModal}
        footer={null}
        destroyOnClose
        centered
        width={980}
      >
        <div style={{ maxHeight: "80vh", overflowY: "scroll" }}>
          <div className="space-y-5">
            <p className="text-sm text-slate-500">
              Search room availability, add rooms, then create the reservation.
            </p>

            <AddEditReservations
              formId={reservationFormId}
              branchId={branchId}
              staffId={staffId}
              onSubmit={saveReservation}
            />

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={closeFormModal}
                disabled={submitting}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                form={reservationFormId}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-lg bg-red-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-900 disabled:opacity-60"
              >
                {submitting && <LoadingOutlined />}
                Create Reservation
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        zIndex={appZIndex.modal}
        open={detailsModalOpen}
        title={
          selectedReservation
            ? `Reservation ${selectedReservation.booking_reference}`
            : "Reservation details"
        }
        onCancel={closeDetailsModal}
        footer={null}
        destroyOnClose
        centered
        width={960}
      >
        <div style={{ maxHeight: "80vh", overflowY: "scroll" }}>
          {selectedReservation && <ViewReservationsDetails reservation={selectedReservation} />}
        </div>
      </Modal>

      <Modal
        zIndex={appZIndex.modal}
        open={paymentModalOpen}
        title={
          paymentTargetReservation
            ? `Add Payment - ${paymentTargetReservation.booking_reference}`
            : "Add Payment"
        }
        onCancel={closePaymentModal}
        footer={null}
        destroyOnClose
        centered
        width={720}
      >
        <div style={{ maxHeight: "80vh", overflowY: "scroll" }}>
          {paymentTargetReservation && (
            <div className="space-y-5">
              <p className="text-sm text-slate-500">Record a payment for this booking.</p>

              <AddBookingPaymentForm
                formId={paymentFormId}
                branchId={branchId}
                reservation={paymentTargetReservation}
                onSubmit={savePayment}
              />

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={closePaymentModal}
                  disabled={paymentSubmitting}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form={paymentFormId}
                  disabled={paymentSubmitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-900 disabled:opacity-60"
                >
                  {paymentSubmitting && <LoadingOutlined />}
                  Add Payment
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
