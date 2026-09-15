import { LoadingOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import { appZIndex } from "../../../utils/appconst";
import AddEditRoomMaintainanceForm from "./AddEditRoomMaintainanceForm";
import RoomsMaintainanceList from "./RoomsMaintainanceList";
import { Task, TaskFormValues } from "./roomMaintainance.types";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../../../apiservice/maintenance-service";
import { getStaffs } from "../../../apiservice/staff-service";
import { StaffRecord } from "../StaffLogin/staffLogin.types";
import { useAppSelector } from "../../../Redux/reduxCustomHook";
import type { RootState } from "../../../Redux/store";

export default function RoomsMaintainanceWrapper() {
  const [records, setRecords] = useState<Task[]>([]);
  const [staffOptions, setStaffOptions] = useState<StaffRecord[]>([]);
  const [search, setSearch] = useState("");
  const [staffFilter, setStaffFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [editingRecord, setEditingRecord] = useState<Task | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const formId = "task-form";
  const authData = useAppSelector((state: RootState) => state.AdminAuthData);
  const branchId = authData.staff?.branch_id || authData.data?.id || 1;

  const loadRecords = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getTasks({
        page: 1,
        perPage: 20,
        sort_order: "desc",
        ...(staffFilter === "All" ? {} : { assigned_staff_id: Number(staffFilter) }),
        ...(typeFilter === "All" ? {} : { task_type: typeFilter }),
        ...(statusFilter === "All" ? {} : { status: statusFilter }),
        ...(priorityFilter === "All" ? {} : { priority: priorityFilter }),
        ...(search.trim() ? { search: search.trim() } : {}),
      });
      setRecords(response.data || []);
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStaffs({ branch_id: branchId, page: 1, perPage: 100, sort_order: "desc" })
      .then((response) => setStaffOptions(response.data || []))
      .catch(() => setStaffOptions([]));
  }, [branchId]);

  useEffect(() => {
    loadRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staffFilter, statusFilter, typeFilter, priorityFilter, search]);

  const openAddModal = () => {
    setEditingRecord(null);
    setModalOpen(true);
  };

  const openEditModal = (record: Task) => {
    setEditingRecord(record);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingRecord(null);
  };

  const saveRecord = async (values: TaskFormValues) => {
    setSubmitting(true);
    try {
      if (editingRecord) {
        await updateTask(editingRecord.id, values);
        setMessage("Task updated successfully.");
      } else {
        await createTask(values);
        setMessage("Task created successfully.");
      }
      closeModal();
      await loadRecords();
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to save task.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteRecord = async (record: Task) => {
    setDeletingId(record.id);
    try {
      await deleteTask(record.id);
      setMessage("Task deleted successfully.");
      await loadRecords();
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to delete task.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6">
      <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Tasks</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Assign, track, and update staff tasks.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center rounded-lg bg-red-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-900"
        >
          + Add Task
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
            <h2 className="font-semibold text-slate-900">Task register</h2>
            <p className="mt-1 text-sm text-slate-500">
              Search and filter tasks by assignee, type, priority, and status.
            </p>
          </div>
          <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-2 xl:grid-cols-6">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tasks"
              className="h-10 rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100"
            />
            <select
              value={staffFilter}
              onChange={(event) => setStaffFilter(event.target.value)}
              className="h-10 rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100"
            >
              <option value="All">All staff</option>
              {staffOptions.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.first_name} {staff.last_name}
                </option>
              ))}
            </select>
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="h-10 rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100"
            >
              <option value="All">All types</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Repairs">Repairs</option>
              <option value="Replace">Replace</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(event) => setPriorityFilter(event.target.value)}
              className="h-10 rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100"
            >
              <option value="All">All priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
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
                setStaffFilter("All");
                setStatusFilter("All");
                setTypeFilter("All");
                setPriorityFilter("All");
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
        title={editingRecord ? "Edit Task" : "Add Task"}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
        centered
        width={760}
      >
        <div style={{ maxHeight: "80vh", overflowY: "scroll" }}>
          <div className="space-y-5">
            <p className="text-sm text-slate-500">
              Enter the task details and optionally assign a staff member.
            </p>

            <AddEditRoomMaintainanceForm
              key={editingRecord?.id || "new"}
              formId={formId}
              initialValues={editingRecord}
              staffOptions={staffOptions}
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
                {editingRecord ? "Save Changes" : "Create Task"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
