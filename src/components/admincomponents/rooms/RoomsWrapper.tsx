import { LoadingOutlined } from "@ant-design/icons";
import { Image, Modal } from "antd";
import { useEffect, useMemo, useState } from "react";
import {
  createRoom,
  deleteRoom as removeRoom,
  getRooms,
  updateRoom,
} from "../../../apiservice/rooms-service";
import { getRoomTypes } from "../../../apiservice/room-types-service";
import AddEditRoomForm from "./AddEditRoomForm";
import RoomsList from "./RoomsList";
import { Room, RoomFormValues } from "./room.types";
import { RoomType } from "../roomTypes/roomType.types";
import { appZIndex } from "../../../utils/appconst";
import { useAppSelector } from "../../../Redux/reduxCustomHook";
import type { RootState } from "../../../Redux/store";

const formatCurrency = (value?: string | number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export default function RoomsWrapper() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypeOptions, setRoomTypeOptions] = useState<RoomType[]>([]);
  const [search, setSearch] = useState("");
  const [roomTypeFilter, setRoomTypeFilter] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [cleaningFilter, setCleaningFilter] = useState("All");
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const authData = useAppSelector((state: RootState) => state.AdminAuthData);
  const branchId = authData.staff?.branch_id || authData.data?.id || 1;
  const formId = "room-form";

  const visibleRooms = useMemo(() => {
    return rooms.filter((room) => {
      const roomTypeMatch =
        roomTypeFilter === "All" ||
        room.room_type_id === Number(roomTypeFilter);
      const availabilityMatch =
        availabilityFilter === "All" || room.status === availabilityFilter;
      const cleaningMatch =
        cleaningFilter === "All" || room.cleaning_status === cleaningFilter;

      return roomTypeMatch && availabilityMatch && cleaningMatch;
    });
  }, [rooms, roomTypeFilter, availabilityFilter, cleaningFilter]);

  const loadRooms = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getRooms({
        branch_id: branchId,
        page: 1,
        perPage: 20,
        sort_order: "desc",
        ...(roomTypeFilter === "All"
          ? {}
          : { room_type_id: Number(roomTypeFilter) }),
        ...(search.trim() ? { search: search.trim() } : {}),
      });
      setRooms(response.data || []);
    } catch (requestError: any) {
      setError(
        requestError?.response?.data?.message || "Unable to load rooms.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoomTypes({
      branch_id: branchId,
      page: 1,
      perPage: 100,
      sort_order: "desc",
    })
      .then((response) => setRoomTypeOptions(response.data || []))
      .catch(() => setRoomTypeOptions([]));
  }, [branchId]);

  useEffect(() => {
    loadRooms();
  }, [branchId, roomTypeFilter, search]);

  const resetFilters = () => {
    setRoomTypeFilter("All");
    setAvailabilityFilter("All");
    setCleaningFilter("All");
    setSearch("");
  };

  const openAddModal = () => {
    setEditingRoom(null);
    setModalOpen(true);
  };

  const openEditModal = (room: Room) => {
    setEditingRoom(room);
    setModalOpen(true);
  };

  const openDetailsModal = (room: Room) => {
    setSelectedRoom(room);
    setDetailsOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingRoom(null);
  };

  const closeDetailsModal = () => {
    setDetailsOpen(false);
    setSelectedRoom(null);
  };

  const saveRoom = async (values: RoomFormValues) => {
    setSubmitting(true);
    try {
      const payload = { ...values, branch_id: branchId };
      if (editingRoom) {
        await updateRoom(editingRoom.id, payload);
        setMessage("Room updated successfully.");
      } else {
        await createRoom(payload);
        setMessage("Room created successfully.");
      }
      closeModal();
      await loadRooms();
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to save room.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteRoom = async (room: Room) => {
    setDeletingId(room.id);
    try {
      await removeRoom(room.id);
      setMessage("Room deleted successfully.");
      await loadRooms();
    } catch (requestError: any) {
      setError(
        requestError?.response?.data?.message || "Unable to delete room.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6">
      <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Rooms</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Manage room inventory, rates, cleaning status and operational notes.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center rounded-lg bg-red-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-900"
        >
          + Add Room
        </button>
      </div>

      {message && (
        <div
          role="status"
          className="mb-4 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          <span>{message}</span>
          <button
            type="button"
            onClick={() => setMessage("")}
            className="font-bold"
          >
            ×
          </button>
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-slate-900">Room register</h2>
            <p className="mt-1 text-sm text-slate-500">
              Filter rooms by type, availability, and cleaning status.
            </p>
          </div>
          <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-2 xl:grid-cols-5">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search rooms"
              className="h-10 rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100"
            />
            <select
              value={roomTypeFilter}
              onChange={(event) => setRoomTypeFilter(event.target.value)}
              className="h-10 rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100"
            >
              <option value="All">All room types</option>
              {roomTypeOptions.map((roomType) => (
                <option key={roomType.id} value={roomType.id}>
                  {roomType.name}
                </option>
              ))}
            </select>
            <select
              value={availabilityFilter}
              onChange={(event) => setAvailabilityFilter(event.target.value)}
              className="h-10 rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100"
            >
              <option value="All">All availability</option>
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Maintenance">Maintenance</option>
            </select>
            <select
              value={cleaningFilter}
              onChange={(event) => setCleaningFilter(event.target.value)}
              className="h-10 rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100"
            >
              <option value="All">All cleaning</option>
              <option value="Clean">Clean</option>
              <option value="Dirty">Dirty</option>
              <option value="In progress">In progress</option>
            </select>
            <button
              type="button"
              onClick={resetFilters}
              className="h-10 rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Reset filters
            </button>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mx-4 mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}
        <div className="p-3 sm:p-4">
          <RoomsList
            rooms={visibleRooms}
            loading={loading}
            deletingId={deletingId}
            onView={openDetailsModal}
            onEdit={openEditModal}
            onDelete={deleteRoom}
          />
        </div>
      </section>

      <Modal
        zIndex={appZIndex.modal}
        open={modalOpen}
        title={editingRoom ? "Edit Room" : "Add Room"}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
        centered
        width={720}
      >
        <div style={{ maxHeight: "80vh", overflowY: "scroll" }}>
          <div className="space-y-5">
            <p className="text-sm text-slate-500">
              Use the form below to save room details.
            </p>

            <AddEditRoomForm
              key={editingRoom?.id || "new"}
              formId={formId}
              initialValues={editingRoom}
              roomTypeOptions={roomTypeOptions}
              branchId={branchId}
              onSubmit={saveRoom}
            />

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={closeModal}
                disabled={submitting}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                form={formId}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-lg bg-red-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-900 disabled:opacity-60"
              >
                {submitting && <LoadingOutlined />}
                {editingRoom ? "Save Changes" : "Create Room"}
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        zIndex={appZIndex.modal}
        open={detailsOpen}
        title={
          selectedRoom
            ? `Room ${selectedRoom.room_number} details`
            : "Room details"
        }
        onCancel={closeDetailsModal}
        footer={null}
        centered
        width={900}
        destroyOnClose
      >
        <div style={{ maxHeight: "80vh", overflowY: "scroll" }}>
          {selectedRoom && (
            <div className="space-y-6">
              <div className="grid gap-4 lg:grid-cols-2">
                <div
                  className={`overflow-hidden rounded-2xl border border-slate-200 ${selectedRoom.room_type?.feature_video_url ? "" : "lg:col-span-2"}`}
                >
                  {selectedRoom.room_type?.feature_image ? (
                    <img
                      src={selectedRoom.room_type.feature_image}
                      alt={selectedRoom.room_type.name}
                      className="h-72 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-72 items-center justify-center bg-slate-100 text-slate-500">
                      No feature image
                    </div>
                  )}
                </div>

                {selectedRoom.room_type?.feature_video_url && (
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                    {selectedRoom.room_type.feature_video_url.includes(
                      "youtube.com",
                    ) ||
                    selectedRoom.room_type.feature_video_url.includes(
                      "youtu.be",
                    ) ? (
                      <iframe
                        className="h-72 w-full"
                        src={selectedRoom.room_type.feature_video_url
                          .replace("watch?v=", "embed/")
                          .replace("youtu.be/", "www.youtube.com/embed/")}
                        title="Feature video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    ) : selectedRoom.room_type.feature_video_url.includes(
                        "vimeo.com",
                      ) ? (
                      <iframe
                        className="h-72 w-full"
                        src={selectedRoom.room_type.feature_video_url.replace(
                          "vimeo.com/",
                          "player.vimeo.com/video/",
                        )}
                        title="Feature video"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <a
                        href={selectedRoom.room_type.feature_video_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-72 items-center justify-center px-4 py-3 text-sm font-medium text-red-800 underline"
                      >
                        Open feature video
                      </a>
                    )}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="mb-3 text-sm font-semibold text-slate-900">
                  Room details
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  <div className="rounded-lg bg-white p-3 text-sm">
                    <dt className="text-xs text-slate-500">Room number</dt>
                    <dd className="mt-1 font-medium text-slate-900">
                      {selectedRoom.room_number}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-white p-3 text-sm">
                    <dt className="text-xs text-slate-500">Room type</dt>
                    <dd className="mt-1 font-medium text-slate-900">
                      {selectedRoom.room_type?.name || "-"}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-white p-3 text-sm">
                    <dt className="text-xs text-slate-500">Floor</dt>
                    <dd className="mt-1 font-medium text-slate-900">
                      {selectedRoom.floor}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-white p-3 text-sm">
                    <dt className="text-xs text-slate-500">Availability</dt>
                    <dd className="mt-1 font-medium text-slate-900">
                      {selectedRoom.status}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-white p-3 text-sm">
                    <dt className="text-xs text-slate-500">Cleaning</dt>
                    <dd className="mt-1 font-medium text-slate-900">
                      {selectedRoom.cleaning_status || "-"}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-white p-3 text-sm">
                    <dt className="text-xs text-slate-500">Base rate</dt>
                    <dd className="mt-1 font-medium text-slate-900">
                      {formatCurrency(selectedRoom.room_type?.base_price)}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-white p-3 text-sm">
                    <dt className="text-xs text-slate-500">Discounted rate</dt>
                    <dd className="mt-1 font-medium text-slate-900">
                      {formatCurrency(selectedRoom.room_type?.discounted_price)}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-white p-3 text-sm">
                    <dt className="text-xs text-slate-500">Website rate</dt>
                    <dd className="mt-1 font-medium text-slate-900">
                      {formatCurrency(selectedRoom.room_type?.website_price)}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-white p-3 text-sm">
                    <dt className="text-xs text-slate-500">Corporate rate</dt>
                    <dd className="mt-1 font-medium text-slate-900">
                      {formatCurrency(selectedRoom.room_type?.cooperate_price)}
                    </dd>
                  </div>
                </div>
              </div>

              {selectedRoom.maintenance_note && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">
                    Notes
                  </h3>
                  <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                    {selectedRoom.maintenance_note}
                  </p>
                </div>
              )}

              {(!!selectedRoom.images.length ||
                !!selectedRoom.room_type?.images.length) && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-slate-900">
                    Other images
                  </h3>
                  <Image.PreviewGroup preview={{ zIndex: appZIndex.tooltips }}>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {(selectedRoom.images.length
                        ? selectedRoom.images
                        : selectedRoom.room_type?.images || []
                      ).map((image) => (
                        <Image
                          key={image.image_url}
                          src={image.image_url}
                          alt="Room gallery"
                          className="h-36 w-full rounded-xl border border-slate-200 object-cover"
                          wrapperClassName="h-36 w-full cursor-pointer"
                        />
                      ))}
                    </div>
                  </Image.PreviewGroup>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
