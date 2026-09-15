import { LoadingOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddEditVendorForm from "./AddEditVendorForm";
import VendorList from "./VendorList";
import { Vendor, VendorFormValues } from "./vendor.types";
import { appZIndex } from "../../../utils/appconst";
import {
  createVendor,
  deleteVendor as removeVendor,
  getVendors,
  updateVendor,
} from "../../../apiservice/vendors-service";
import { useAppSelector } from "../../../Redux/reduxCustomHook";
import type { RootState } from "../../../Redux/store";

export default function VendorWrapper() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [search, setSearch] = useState("");
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const formId = "vendor-form";
  const authData = useAppSelector((state: RootState) => state.AdminAuthData);
  const branchId = authData.staff?.branch_id || authData.data?.id || 1;

  const loadVendors = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getVendors({
        branch_id: branchId,
        page: 1,
        perPage: 20,
        sort_order: "desc",
        ...(search.trim() ? { search: search.trim() } : {}),
      });
      setVendors(response.data || []);
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to load vendors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId, search]);

  const openAddModal = () => {
    setEditingVendor(null);
    setModalOpen(true);
  };

  const openVendorDetails = (vendor: Vendor) => {
    navigate(`/admin/vendors/${vendor.id}`);
  };

  const openEditModal = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingVendor(null);
  };

  const saveVendor = async (values: VendorFormValues) => {
    setSubmitting(true);
    try {
      const payload = { ...values, branch_id: branchId };
      if (editingVendor) {
        await updateVendor(editingVendor.id, payload);
        setMessage("Vendor updated successfully.");
      } else {
        await createVendor(payload);
        setMessage("Vendor created successfully.");
      }
      closeModal();
      await loadVendors();
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to save vendor.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteVendor = async (vendor: Vendor) => {
    setDeletingId(vendor.id);
    try {
      await removeVendor(vendor.id);
      setMessage("Vendor deleted successfully.");
      await loadVendors();
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to delete vendor.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6">
      <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Vendors</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Manage the vendors associated with this branch.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center rounded-lg bg-red-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-900"
        >
          + Add Vendor
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
            <h2 className="font-semibold text-slate-900">Vendor register</h2>
            <p className="mt-1 text-sm text-slate-500">
              Search vendors by name, company or email.
            </p>
          </div>
          <div className="grid w-full gap-3 sm:w-auto">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search vendors"
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
          <VendorList
            vendors={vendors}
            loading={loading}
            deletingId={deletingId}
            onView={openVendorDetails}
            onEdit={openEditModal}
            onDelete={deleteVendor}
          />
        </div>
      </section>

      <Modal
        zIndex={appZIndex.modal}
        open={modalOpen}
        title={editingVendor ? "Edit Vendor" : "Add Vendor"}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
        centered
        width={720}
      >
        <div style={{ maxHeight: "80vh", overflowY: "scroll" }}>
          <div className="space-y-5">
            <p className="text-sm text-slate-500">
              Use the form below to save vendor details.
            </p>

            <AddEditVendorForm
              key={editingVendor?.id || "new"}
              formId={formId}
              branchId={branchId}
              initialValues={editingVendor}
              onSubmit={saveVendor}
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
                {editingVendor ? "Save Changes" : "Create Vendor"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
