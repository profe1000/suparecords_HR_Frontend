import { useEffect, useMemo, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { getRoomTypes, createRoomType, deleteRoomType as removeRoomType, updateRoomType } from "../../../apiservice/room-types-service";
import AddEditRoomTypeForm from "./AddEditRoomTypeForm";
import RoomTypeDetailsModal from "./RoomTypeDetailsModal";
import RoomTypeList from "./RoomTypeList";
import { RoomType, RoomTypeFormValues } from "./roomType.types";
import { appZIndex } from "../../../utils/appconst";
import { useAppSelector } from "../../../Redux/reduxCustomHook";
import type { RootState } from "../../../Redux/store";

export default function RoomTypeWrapper() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [search, setSearch] = useState("");
  const [editingRoomType, setEditingRoomType] = useState<RoomType | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewingRoomType, setViewingRoomType] = useState<RoomType | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const formId = "room-type-form";
  const authData = useAppSelector((state: RootState) => state.AdminAuthData);
  const branchId = authData.staff?.branch_id || authData.data?.id || 1;

  const loadRoomTypes = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getRoomTypes({ branch_id: branchId, page: 1, perPage: 20, sort_order: "desc", search });
      setRoomTypes(response.data || []);
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to load room types.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoomTypes();
  }, [branchId, search]);

  const visibleRoomTypes = useMemo(() => {
    const query = search.trim().toLowerCase();
    return query
      ? roomTypes.filter((roomType) =>
        [
          roomType.name,
          roomType.description,
          roomType.bed_type,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
      : roomTypes;
  }, [roomTypes, search]);

  const openAddModal = () => {
    setEditingRoomType(null);
    setModalOpen(true);
  };
  const openEditModal = (roomType: RoomType) => {
    setEditingRoomType(roomType);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setEditingRoomType(null);
  };
  const openViewModal = (roomType: RoomType) => setViewingRoomType(roomType);
  const closeViewModal = () => setViewingRoomType(null);

  const saveRoomType = async (values: RoomTypeFormValues) => {
    setSubmitting(true);
    try {
      const payload = { ...values, branch_id: branchId };
      if (editingRoomType) {
        await updateRoomType(editingRoomType.id, payload);
        setMessage("Room type updated successfully.");
      } else {
        await createRoomType(payload);
        setMessage("Room type created successfully.");
      }
      closeModal();
      await loadRoomTypes();
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to save room type.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteRoomType = async (roomType: RoomType) => {
    setDeletingId(roomType.id);
    try {
      await removeRoomType(roomType.id);
      setMessage("Room type deleted successfully.");
      await loadRoomTypes();
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to delete room type.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Room Types</h1>
          <p className="mt-1 text-sm text-slate-500">
            Configure accommodation categories, capacity, bed setup and nightly
            pricing.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="rounded-lg bg-red-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-900"
        >
          + Add Room Type
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
      {error && <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center">
          <h2 className="font-semibold text-slate-900">Room type register</h2>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search room types"
            className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 sm:w-72"
          />
        </div>
        <div className="p-3 sm:p-4">
          <RoomTypeList
            roomTypes={visibleRoomTypes}
            loading={loading}
            deletingId={deletingId}
            onEdit={openEditModal}
            onDelete={deleteRoomType}
            onView={openViewModal}
          />
        </div>
      </section>
      <Modal
        zIndex={appZIndex.modal}
        open={modalOpen}
        title={editingRoomType ? "Edit Room Type" : "Add Room Type"}
        onCancel={closeModal}
        footer={null}
        width={800}
        destroyOnClose
      >
        <div style={{ maxHeight: "70vh", overflowY: "scroll" }}>
          <div className="p-1">
            <div className="w-full overflow-y-auto rounded-xl bg-white shadow-xl">
            
              <div className="p-5">
                <AddEditRoomTypeForm
                  key={editingRoomType?.id || "new"}
                  formId={formId}
                  initialValues={editingRoomType}
                  onSubmit={saveRoomType}
                />
              </div>
              <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form={formId}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-800 px-4 py-2 text-sm font-medium text-white hover:bg-blue-900 disabled:opacity-60"
                >
                  {submitting && <LoadingOutlined />}
                  {editingRoomType ? "Save Changes" : "Create Room Type"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        zIndex={appZIndex.modal}
        open={!!viewingRoomType}
        title={viewingRoomType?.name || "Room Type Details"}
        onCancel={closeViewModal}
        footer={null}
        width={800}
        destroyOnClose
      >
        <div style={{ maxHeight: "70vh", overflowY: "scroll" }}>
          <div className="p-1">
            {viewingRoomType && <RoomTypeDetailsModal roomType={viewingRoomType} />}
          </div>
        </div>
      </Modal>
    </div >
  );
}
