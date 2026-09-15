import { FormEvent, useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { getAvailableRooms, getAvailableRoomTypes } from "../../../apiservice/bookings-service";
import { createGuest, getGuests } from "../../../apiservice/guests-service";
import { appZIndex } from "../../../utils/appconst";
import AddEditGuestForm from "../guest/AddEditGuestForm";
import { Guest, GuestFormValues } from "../guest/guest.types";
import {
  AvailableRoom,
  AvailableRoomType,
  BookingRoomParam,
  CreateBookingPayload,
} from "./roomReservations.types";

type Props = {
  formId: string;
  branchId: number;
  staffId: number;
  onSubmit: (values: CreateBookingPayload) => void;
};

type AvailabilityMode = "roomType" | "room";

const today = new Date().toISOString().slice(0, 10);

const nightsBetween = (checkInDate: string, checkOutDate: string) => {
  if (!checkInDate || !checkOutDate) return 1;
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 1;
  const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(diff, 1);
};

const currency = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);

type SelectedRoom = BookingRoomParam & { roomTypeName: string; roomNumber: string };

export default function AddEditReservations({ formId, branchId, staffId, onSubmit }: Props) {
  const [guestId, setGuestId] = useState(0);
  const [guestOptions, setGuestOptions] = useState<Guest[]>([]);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [specialRequest, setSpecialRequest] = useState("");
  const [bookingSource, setBookingSource] = useState("website");
  const [serviceCharge, setServiceCharge] = useState(0);
  const [availabilityMode, setAvailabilityMode] = useState<AvailabilityMode>("roomType");
  const [availableRoomTypes, setAvailableRoomTypes] = useState<AvailableRoomType[]>([]);
  const [availableRooms, setAvailableRooms] = useState<AvailableRoom[]>([]);
  const [roomTypePicks, setRoomTypePicks] = useState<Record<number, number>>({});
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [selectedRooms, setSelectedRooms] = useState<SelectedRoom[]>([]);
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [savingGuest, setSavingGuest] = useState(false);
  const [guestFormError, setGuestFormError] = useState("");
  const guestFormId = "reservation-quick-guest-form";

  const inputClass =
    "mt-1 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100";

  const loadGuests = () =>
    getGuests({ page: 1, perPage: 100, sort_order: "desc" })
      .then((response) => setGuestOptions(response.data || []))
      .catch(() => setGuestOptions([]));

  useEffect(() => {
    loadGuests();
  }, []);

  const openGuestModal = () => {
    setGuestFormError("");
    setGuestModalOpen(true);
  };
  const closeGuestModal = () => setGuestModalOpen(false);

  const saveNewGuest = async (values: GuestFormValues) => {
    setSavingGuest(true);
    setGuestFormError("");
    try {
      const response = await createGuest(values);
      const newGuest: Guest | undefined = response?.data || response;
      await loadGuests();
      if (newGuest?.id) {
        setGuestId(newGuest.id);
      } else {
        const refreshed = await getGuests({ page: 1, perPage: 100, sort_order: "desc" });
        const match = (refreshed.data || []).find((guest) => guest.email === values.email);
        if (match) setGuestId(match.id);
      }
      closeGuestModal();
    } catch (requestError: any) {
      setGuestFormError(requestError?.response?.data?.message || "Unable to add guest.");
    } finally {
      setSavingGuest(false);
    }
  };

  const searchAvailability = async () => {
    setSearching(true);
    setSearchError("");
    try {
      const [roomTypesResponse, roomsResponse] = await Promise.all([
        getAvailableRoomTypes({ branch_id: branchId, start_date: startDate, end_date: endDate }),
        getAvailableRooms({ branch_id: branchId, start_date: startDate, end_date: endDate }),
      ]);
      setAvailableRoomTypes(roomTypesResponse.data || []);
      setAvailableRooms(roomsResponse.data || []);
      setRoomTypePicks({});
    } catch (requestError: any) {
      setSearchError(requestError?.response?.data?.message || "Unable to load availability.");
    } finally {
      setSearching(false);
    }
  };

  const usedRoomIds = new Set(selectedRooms.map((room) => room.room_id));

  const roomsForType = (roomTypeId: number) =>
    availableRooms.filter(
      (room) => room.room_type_id === roomTypeId && !usedRoomIds.has(room.id),
    );

  const addRoom = (room: AvailableRoom, pricePerNight: number, roomTypeName: string) => {
    if (usedRoomIds.has(room.id)) return;

    setSelectedRooms((current) => [
      ...current,
      {
        room_id: room.id,
        price_per_night: pricePerNight,
        check_in_date: startDate,
        check_out_date: endDate,
        start_date: startDate,
        end_date: endDate,
        adult_count: 1,
        children_count: 0,
        discount: 0,
        tax: 0,
        reserved: "NotReserved",
        temp_reserved_until: null,
        roomTypeName,
        roomNumber: room.room_number,
      },
    ]);
  };

  const addRoomFromType = (roomType: AvailableRoomType) => {
    const pickedRoomId = roomTypePicks[roomType.room_type_id];
    const room =
      availableRooms.find((item) => item.id === pickedRoomId) ||
      roomsForType(roomType.room_type_id)[0];
    if (!room) return;
    addRoom(room, Number(roomType.room_type.base_price), roomType.room_type_name);
  };

  const updateRoom = (index: number, patch: Partial<SelectedRoom>) => {
    setSelectedRooms((current) =>
      current.map((room, roomIndex) => (roomIndex === index ? { ...room, ...patch } : room)),
    );
  };

  const removeRoom = (index: number) => {
    setSelectedRooms((current) => current.filter((_, roomIndex) => roomIndex !== index));
  };

  const roomsTotal = selectedRooms.reduce((sum, room) => {
    const nights = nightsBetween(room.check_in_date, room.check_out_date);
    return sum + room.price_per_night * nights - room.discount + room.tax;
  }, 0);
  const grandTotal = Math.max(roomsTotal + serviceCharge, 0);

  return (
    <>
    <form
      id={formId}
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit({
          guest_id: guestId,
          branch_id: branchId,
          discount: 0,
          tax: 0,
          service_charge: serviceCharge,
          total_rooms: selectedRooms.length,
          booking_status: "Pending",
          payment_status: "Unpaid",
          special_request: specialRequest,
          booking_source: bookingSource,
          staff_id: staffId,
          booking_room_params: selectedRooms.map(({ roomTypeName, roomNumber, ...room }) => room),
        });
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="block text-sm font-medium text-slate-700">
          <div className="flex items-center justify-between">
            <span>
              Guest <span className="text-red-600">*</span>
            </span>
            <button
              type="button"
              onClick={openGuestModal}
              className="text-xs font-medium text-red-700 underline hover:text-red-900"
            >
              + Add guest
            </button>
          </div>
          <select
            required
            value={guestId || ""}
            onChange={(event) => setGuestId(Number(event.target.value))}
            className={`${inputClass} bg-white`}
          >
            <option value="">Select a guest</option>
            {guestOptions.map((guest) => (
              <option key={guest.id} value={guest.id}>
                {guest.first_name} {guest.last_name} ({guest.email})
              </option>
            ))}
          </select>
        </div>

        <label className="block text-sm font-medium text-slate-700">
          Staff
          <input
            disabled
            value={staffId ? `Staff #${staffId}` : "Not signed in"}
            className={`${inputClass} bg-slate-100 text-slate-500`}
          />
        </label>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="mb-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <h3 className="text-sm font-semibold text-slate-900">Check availability</h3>
          <div className="inline-flex rounded-lg border border-slate-300 bg-white p-1">
            <button
              type="button"
              onClick={() => setAvailabilityMode("roomType")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                availabilityMode === "roomType" ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              By room type
            </button>
            <button
              type="button"
              onClick={() => setAvailabilityMode("room")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                availabilityMode === "room" ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              By room
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <label className="block text-sm font-medium text-slate-700">
            Start date
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className={inputClass}
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            End date
            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className={inputClass}
            />
          </label>

          <div className="flex items-end">
            <button
              type="button"
              onClick={searchAvailability}
              disabled={searching}
              className="h-11 w-full rounded-lg bg-slate-800 px-4 text-sm font-medium text-white transition hover:bg-slate-900 disabled:opacity-60"
            >
              {searching ? "Searching..." : "Search availability"}
            </button>
          </div>
        </div>

        {searchError && (
          <div role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {searchError}
          </div>
        )}

        {availabilityMode === "roomType" && !!availableRoomTypes.length && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {availableRoomTypes.map((roomType) => {
              const roomsLeft = roomsForType(roomType.room_type_id);
              const pickedRoomId = roomTypePicks[roomType.room_type_id] || roomsLeft[0]?.id || "";

              return (
                <div key={roomType.room_type_id} className="rounded-lg border border-slate-200 bg-white p-3">
                  <p className="text-sm font-semibold text-slate-900">{roomType.room_type_name}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {roomType.available_rooms} of {roomType.total_rooms} available
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {currency(Number(roomType.room_type.base_price))} / night
                  </p>

                  <label className="mt-2 block text-xs font-medium text-slate-600">
                    Room number
                    <select
                      value={pickedRoomId}
                      onChange={(event) =>
                        setRoomTypePicks((current) => ({
                          ...current,
                          [roomType.room_type_id]: Number(event.target.value),
                        }))
                      }
                      className="mt-1 h-9 w-full rounded-lg border border-slate-300 bg-white px-2 text-sm outline-none focus:border-red-700 focus:ring-2 focus:ring-red-100"
                    >
                      {!roomsLeft.length && <option value="">No rooms available</option>}
                      {roomsLeft.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.room_number}
                        </option>
                      ))}
                    </select>
                  </label>

                  <button
                    type="button"
                    onClick={() => addRoomFromType(roomType)}
                    disabled={!roomsLeft.length}
                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    + Add room {pickedRoomId && roomsLeft.length ? `#${roomsLeft.find((room) => room.id === pickedRoomId)?.room_number}` : ""}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {availabilityMode === "room" && !!availableRooms.length && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {availableRooms.map((room) => {
              const alreadyUsed = usedRoomIds.has(room.id);
              return (
                <div key={room.id} className="rounded-lg border border-slate-200 bg-white p-3">
                  <p className="text-sm font-semibold text-slate-900">Room {room.room_number}</p>
                  <p className="mt-1 text-xs text-slate-500">{room.room_type.name}</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {currency(Number(room.room_type.base_price))} / night
                  </p>
                  <button
                    type="button"
                    onClick={() => addRoom(room, Number(room.room_type.base_price), room.room_type.name)}
                    disabled={alreadyUsed}
                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {alreadyUsed ? "Already added" : "+ Add room"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Selected rooms</h3>

        {!selectedRooms.length ? (
          <p className="text-sm text-slate-500">Search availability and add rooms to this booking.</p>
        ) : (
          <div className="space-y-4">
            {selectedRooms.map((room, index) => (
              <div key={`${room.room_id}-${index}`} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">
                    Room {room.roomNumber} - {room.roomTypeName}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeRoom(index)}
                    className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <label className="block text-sm font-medium text-slate-700">
                    Check-in date
                    <input
                      type="date"
                      value={room.check_in_date}
                      onChange={(event) =>
                        updateRoom(index, { check_in_date: event.target.value, start_date: event.target.value })
                      }
                      className={inputClass}
                    />
                  </label>

                  <label className="block text-sm font-medium text-slate-700">
                    Check-out date
                    <input
                      type="date"
                      value={room.check_out_date}
                      onChange={(event) =>
                        updateRoom(index, { check_out_date: event.target.value, end_date: event.target.value })
                      }
                      className={inputClass}
                    />
                  </label>

                  <label className="block text-sm font-medium text-slate-700">
                    Price per night (NGN)
                    <input
                      min="0"
                      type="number"
                      value={room.price_per_night || ""}
                      onChange={(event) => updateRoom(index, { price_per_night: Number(event.target.value) })}
                      className={inputClass}
                    />
                  </label>

                  <label className="block text-sm font-medium text-slate-700">
                    Adult count
                    <input
                      min="1"
                      type="number"
                      value={room.adult_count}
                      onChange={(event) => updateRoom(index, { adult_count: Number(event.target.value) })}
                      className={inputClass}
                    />
                  </label>

                  <label className="block text-sm font-medium text-slate-700">
                    Children count
                    <input
                      min="0"
                      type="number"
                      value={room.children_count}
                      onChange={(event) => updateRoom(index, { children_count: Number(event.target.value) })}
                      className={inputClass}
                    />
                  </label>

                  <label className="block text-sm font-medium text-slate-700">
                    Discount (NGN)
                    <input
                      min="0"
                      type="number"
                      value={room.discount || ""}
                      onChange={(event) => updateRoom(index, { discount: Number(event.target.value) })}
                      className={inputClass}
                    />
                  </label>

                  <label className="block text-sm font-medium text-slate-700">
                    Tax (NGN)
                    <input
                      min="0"
                      type="number"
                      value={room.tax || ""}
                      onChange={(event) => updateRoom(index, { tax: Number(event.target.value) })}
                      className={inputClass}
                    />
                  </label>

                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="text-xs text-slate-500">Nights</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">
                      {nightsBetween(room.check_in_date, room.check_out_date)}
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="text-xs text-slate-500">Room total</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {currency(
                        room.price_per_night * nightsBetween(room.check_in_date, room.check_out_date) -
                          room.discount +
                          room.tax,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Booking source
          <input
            value={bookingSource}
            onChange={(event) => setBookingSource(event.target.value)}
            placeholder="e.g. website, walk-in"
            className={inputClass}
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Service charge (NGN)
          <input
            min="0"
            type="number"
            value={serviceCharge || ""}
            onChange={(event) => setServiceCharge(Number(event.target.value))}
            className={inputClass}
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Special request
        <textarea
          value={specialRequest}
          onChange={(event) => setSpecialRequest(event.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100"
        />
      </label>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-right">
        <p className="text-xs text-slate-500">Estimated grand total</p>
        <p className="text-lg font-semibold text-slate-900">{currency(grandTotal)}</p>
      </div>
    </form>

    <Modal
      zIndex={appZIndex.tooltips}
      open={guestModalOpen}
      title="Add Guest"
      onCancel={closeGuestModal}
      footer={null}
      destroyOnClose
      centered
      width={720}
    >
      <div style={{ maxHeight: "70vh", overflowY: "scroll" }}>
        <div className="space-y-4">
          {guestFormError && (
            <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {guestFormError}
            </div>
          )}

          <AddEditGuestForm formId={guestFormId} onSubmit={saveNewGuest} />

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={closeGuestModal}
              disabled={savingGuest}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              form={guestFormId}
              disabled={savingGuest}
              className="inline-flex items-center gap-2 rounded-lg bg-red-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-900 disabled:opacity-60"
            >
              {savingGuest && <LoadingOutlined />}
              Add Guest
            </button>
          </div>
        </div>
      </div>
    </Modal>
    </>
  );
}
