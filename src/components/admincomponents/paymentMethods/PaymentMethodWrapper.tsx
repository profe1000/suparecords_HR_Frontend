import { LoadingOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import AddEditPaymentMethodForm from "./AddEditPaymentMethodForm";
import PaymentMethodList from "./PaymentMethodList";
import { PaymentMethod, PaymentMethodFormValues } from "./paymentMethod.types";
import { appZIndex } from "../../../utils/appconst";
import {
  createPaymentMethod,
  deletePaymentMethod as removePaymentMethod,
  getPaymentMethods,
  updatePaymentMethod,
} from "../../../apiservice/payment-methods-service";
import { useAppSelector } from "../../../Redux/reduxCustomHook";
import type { RootState } from "../../../Redux/store";

export default function PaymentMethodWrapper() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [search, setSearch] = useState("");
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<PaymentMethod | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const formId = "payment-method-form";
  const authData = useAppSelector((state: RootState) => state.AdminAuthData);
  const branchId = authData.staff?.branch_id || authData.data?.id || 1;

  const loadPaymentMethods = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getPaymentMethods({
        branch_id: branchId,
        page: 1,
        perPage: 20,
        sort_order: "desc",
        ...(search.trim() ? { search: search.trim() } : {}),
      });
      setPaymentMethods(response.data || []);
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to load payment methods.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPaymentMethods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId, search]);

  const openAddModal = () => {
    setEditingPaymentMethod(null);
    setModalOpen(true);
  };

  const openEditModal = (paymentMethod: PaymentMethod) => {
    setEditingPaymentMethod(paymentMethod);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingPaymentMethod(null);
  };

  const savePaymentMethod = async (values: PaymentMethodFormValues) => {
    setSubmitting(true);
    try {
      const payload = { ...values, branch_id: branchId };
      if (editingPaymentMethod) {
        await updatePaymentMethod(editingPaymentMethod.id, payload);
        setMessage("Payment method updated successfully.");
      } else {
        await createPaymentMethod(payload);
        setMessage("Payment method created successfully.");
      }
      closeModal();
      await loadPaymentMethods();
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to save payment method.");
    } finally {
      setSubmitting(false);
    }
  };

  const deletePaymentMethod = async (paymentMethod: PaymentMethod) => {
    setDeletingId(paymentMethod.id);
    try {
      await removePaymentMethod(paymentMethod.id);
      setMessage("Payment method deleted successfully.");
      await loadPaymentMethods();
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to delete payment method.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6">
      <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Payment Methods</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Manage the payment methods accepted at this branch.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center rounded-lg bg-red-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-900"
        >
          + Add Payment Method
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
            <h2 className="font-semibold text-slate-900">Payment method register</h2>
            <p className="mt-1 text-sm text-slate-500">
              Search payment methods by name, type or description.
            </p>
          </div>
          <div className="grid w-full gap-3 sm:w-auto">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search payment methods"
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
          <PaymentMethodList
            paymentMethods={paymentMethods}
            loading={loading}
            deletingId={deletingId}
            onEdit={openEditModal}
            onDelete={deletePaymentMethod}
          />
        </div>
      </section>

      <Modal
        zIndex={appZIndex.modal}
        open={modalOpen}
        title={editingPaymentMethod ? "Edit Payment Method" : "Add Payment Method"}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
        centered
        width={720}
      >
        <div style={{ maxHeight: "80vh", overflowY: "scroll" }}>
          <div className="space-y-5">
            <p className="text-sm text-slate-500">
              Use the form below to save payment method details.
            </p>

            <AddEditPaymentMethodForm
              key={editingPaymentMethod?.id || "new"}
              formId={formId}
              branchId={branchId}
              initialValues={editingPaymentMethod}
              onSubmit={savePaymentMethod}
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
                {editingPaymentMethod ? "Save Changes" : "Create Payment Method"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
