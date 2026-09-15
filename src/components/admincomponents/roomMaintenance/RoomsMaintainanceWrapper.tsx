import { LoadingOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import { appZIndex } from "../../../utils/appconst";
import AddEditRoomMaintainanceForm from "./AddEditRoomMaintainanceForm";
import RoomsMaintainanceList from "./RoomsMaintainanceList";
import { MaintenanceLog, MaintenanceLogFormValues } from "./roomMaintainance.types";
import {
  createMaintenanceLog,
  deleteMaintenanceLog as removeMaintenanceLog,
  getMaintenanceLogs,
  updateMaintenanceLog,
} from "../../../apiservice/maintenance-service";
import { getRooms } from "../../../apiservice/rooms-service";
import { getStaffs } from "../../../apiservice/staff-service";
import { Room } from "../rooms/room.types";
import { StaffRecord } from "../StaffLogin/staffLogin.types";
import { useAppSelector } from "../../../Redux/reduxCustomHook";
import type { RootState } from "../../../Redux/store";

export default function RoomsMaintainanceWrapper() {
  const [records, setRecords] = useState<MaintenanceLog[]>([]);
  const [roomOptions, setRoomOptions] = useState<Room[]>([]);
  const [staffOptions, setStaffOptions] = useState<StaffRecord[]>([]);
  const [search, setSearch] = useState("");
  const [roomFilter, setRoomFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [editingRecord, setEditingRecord] = useState<MaintenanceLog | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const formId = "room-maintainance-form";
  const authData = useAppSelector((state: RootState) => state.AdminAuthData);
  const branchId = authData.staff?.branch_id || authData.data?.id || 1;

  const loadRecords = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getMaintenanceLogs({
        page: 1,
        perPage: 20,
        sort_order: "desc",
        ...(roomFilter === "All" ? {} : { room_id: Number(roomFilter) }),
        ...(typeFilter === "All" ? {} : { maintenance_type: typeFilter }),
        ...(statusFilter === "All" ? {} : { status: statusFilter }),
        ...(search.trim() ? { search: search.trim() } : {}),
      });
      setRecords(response.data || []);
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to load maintenance records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRooms({ branch_id: branchId, page: 1, perPage: 100, sort_order: "desc" })
      .then((response) => setRoomOptions(response.data || []))
      .catch(() => setRoomOptions([]));
    getStaffs({ branch_id: branchId, page: 1, perPage: 100, sort_order: "desc" })
      .then((response) => setStaffOptions(response.data || []))
      .catch(() => setStaffOptions([]));
  }, [branchId]);

  useEffect(() => {
    loadRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomFilter, statusFilter, typeFilter, search]);

  const openAddModal = () => {
    setEditingRecord(null);
    setModalOpen(true);
  };

  const openEditModal = (record: MaintenanceLog) => {
    setEditingRecord(record);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingRecord(null);
  };

  const saveRecord = async (values: MaintenanceLogFormValues) => {
    setSubmitting(true);
    try {
      if (editingRecord) {
        await updateMaintenanceLog(editingRecord.id, values);
        setMessage("Maintenance record updated successfully.");
      } else {
        await createMaintenanceLog(values);
        setMessage("Maintenance record created successfully.");
      }
      closeModal();
      await loadRecords();
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to save maintenance record.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteRecord = async (record: MaintenanceLog) => {
    setDeletingId(record.id);
    try {
      await removeMaintenanceLog(record.id);
      setMessage("Maintenance record deleted successfully.");
      await loadRecords();
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to delete maintenance record.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6">
      <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Rooms Maintenance</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Track and update maintenance tasks across room inventory.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center rounded-lg bg-red-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-900"
        >
          + Add Maintenance
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

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-slate-900">Maintenance register</h2>
            <p className="mt-1 text-sm text-slate-500">
              Search and filter maintenance records by room, type and status.
            </p>
          </div>
          <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-2 xl:grid-cols-5">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search records"
              className="h-10 rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100"
            />
            <select
              value={roomFilter}
              onChange={(event) => setRoomFilter(event.target.value)}
              className="h-10 rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100"
            >
              <option value="All">All rooms</option>
              {roomOptions.map((room) => (
                <option key={room.id} value={room.id}>
                  Room {room.room_number}
                </option>
              ))}
            </select>
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="h-10 rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100"
            >
              <option value="All">All types</option>
              <option value="CLEANING">Cleaning</option>
              <option value="REPAIRS">Repairs</option>
              <option value="REPLACE">Replace</option>
            </select>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-10 rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100"
            >
              <option value="All">All statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
              <option value="PENDING">Pending</option>
            </select>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setRoomFilter("All");
                setStatusFilter("All");
                setTypeFilter("All");
              }}
              className="h-10 rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Reset filters
            </button>
          </div>
        </div>

        {error && (
          <div role="alert" className="mx-4 mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="p-3 sm:p-4">
          <RoomsMaintainanceList
            records={records}
            roomOptions={roomOptions}
            staffOptions={staffOptions}
            loading={loading}
            deletingId={deletingId}
            onEdit={openEditModal}
            onDelete={deleteRecord}
          />
        </div>
      </section>

      <Modal
        zIndex={appZIndex.modal}
        open={modalOpen}
        title={editingRecord ? "Edit Maintenance" : "Add Maintenance"}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
        centered
        width={760}
      >
        <div style={{ maxHeight: "80vh", overflowY: "scroll" }}>
          <div className="space-y-5">
            <p className="text-sm text-slate-500">
              Use the form below to save room maintenance details.
            </p>

            <AddEditRoomMaintainanceForm
              key={editingRecord?.id || "new"}
              formId={formId}
              initialValues={editingRecord}
              roomOptions={roomOptions}
              staffOptions={staffOptions}
              defaultRoomId={roomFilter !== "All" ? Number(roomFilter) : undefined}
              onSubmit={saveRecord}
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
                {editingRecord ? "Save Changes" : "Create Record"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
