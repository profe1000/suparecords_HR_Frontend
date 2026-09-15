import { LoadingOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import AddEditLaundryItemTypeForm from "./AddEditLaundryItemTypeForm";
import LaundryItemTypeList from "./LaundryItemTypeList";
import { LaundryItemType, LaundryItemTypeFormValues } from "./laundryItemType.types";
import { appZIndex } from "../../../utils/appconst";
import {
  createLaundryItemType,
  deleteLaundryItemType as removeLaundryItemType,
  getLaundryItemTypes,
  updateLaundryItemType,
} from "../../../apiservice/laundry-service";
import { useAppSelector } from "../../../Redux/reduxCustomHook";
import type { RootState } from "../../../Redux/store";

export default function LaundryItemTypeWrapper() {
  const [itemTypes, setItemTypes] = useState<LaundryItemType[]>([]);
  const [search, setSearch] = useState("");
  const [editingItemType, setEditingItemType] = useState<LaundryItemType | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const formId = "laundry-item-type-form";
  const authData = useAppSelector((state: RootState) => state.AdminAuthData);
  const branchId = authData.staff?.branch_id || authData.data?.id || 1;

  const loadItemTypes = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getLaundryItemTypes({
        branch_id: branchId,
        page: 1,
        perPage: 20,
        sort_order: "desc",
        ...(search.trim() ? { search: search.trim() } : {}),
      });
      setItemTypes(response.data || []);
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to load laundry item types.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItemTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId, search]);

  const openAddModal = () => {
    setEditingItemType(null);
    setModalOpen(true);
  };

  const openEditModal = (itemType: LaundryItemType) => {
    setEditingItemType(itemType);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItemType(null);
  };

  const saveItemType = async (values: LaundryItemTypeFormValues) => {
    setSubmitting(true);
    try {
      const payload = { ...values, branch_id: branchId };
      if (editingItemType) {
        await updateLaundryItemType(editingItemType.id, payload);
        setMessage("Laundry item type updated successfully.");
      } else {
        await createLaundryItemType(payload);
        setMessage("Laundry item type created successfully.");
      }
      closeModal();
      await loadItemTypes();
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to save laundry item type.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteItemType = async (itemType: LaundryItemType) => {
    setDeletingId(itemType.id);
    try {
      await removeLaundryItemType(itemType.id);
      setMessage("Laundry item type deleted successfully.");
      await loadItemTypes();
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to delete laundry item type.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6">
      <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Laundry Item Types</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Manage the laundry item types and pricing for this branch.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center rounded-lg bg-red-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-900"
        >
          + Add Item Type
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
            <h2 className="font-semibold text-slate-900">Item type register</h2>
            <p className="mt-1 text-sm text-slate-500">Search laundry item types by name.</p>
          </div>
          <div className="grid w-full gap-3 sm:w-auto">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search item types"
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
          <LaundryItemTypeList
            itemTypes={itemTypes}
            loading={loading}
            deletingId={deletingId}
            onEdit={openEditModal}
            onDelete={deleteItemType}
          />
        </div>
      </section>

      <Modal
        zIndex={appZIndex.modal}
        open={modalOpen}
        title={editingItemType ? "Edit Item Type" : "Add Item Type"}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
        centered
        width={560}
      >
        <div style={{ maxHeight: "80vh", overflowY: "scroll" }}>
          <div className="space-y-5">
            <p className="text-sm text-slate-500">
              Use the form below to save laundry item type details.
            </p>

            <AddEditLaundryItemTypeForm
              key={editingItemType?.id || "new"}
              formId={formId}
              branchId={branchId}
              initialValues={editingItemType}
              onSubmit={saveItemType}
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
                {editingItemType ? "Save Changes" : "Create Item Type"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
