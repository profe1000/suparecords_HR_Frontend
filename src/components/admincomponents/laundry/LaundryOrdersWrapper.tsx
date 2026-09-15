import { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { appZIndex } from "../../../utils/appconst";
import { useAppSelector } from "../../../Redux/reduxCustomHook";
import type { RootState } from "../../../Redux/store";
import {
  getLaundryOrders,
  deleteLaundryOrder as removeLaundryOrder,
  createLaundryOrder,
  createLaundryPayment,
} from "../../../apiservice/laundry-orders-service";
import {
  LaundryOrder,
  LaundryOrderListResponse,
  CreateLaundryOrderPayload,
} from "../../../apiservice/laundry-orders-service.type";
import LaundryOrdersList from "./LaundryOrdersList";
import LaundryOrderMetaDashboard from "./LaundryOrderMetaDashboard";
import AddEditLaundryOrderForm from "./AddEditLaundryOrderForm";
import AddLaundryPaymentForm from "./AddLaundryPaymentForm";
import ViewLaundryOrderDetails from "./ViewLaundryOrderDetails";

export default function LaundryOrdersWrapper() {
  const [orders, setOrders] = useState<LaundryOrder[]>([]);
  const [metaData, setMetaData] = useState<LaundryOrderListResponse["meta"] | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<LaundryOrder | null>(null);
  const [paymentTargetOrder, setPaymentTargetOrder] = useState<LaundryOrder | null>(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const orderFormId = "laundry-order-form";
  const paymentFormId = "laundry-order-payment-form";

  const authData = useAppSelector((state: RootState) => state.AdminAuthData);
  const branchId = authData.staff?.branch_id || authData.data?.id || 1;

  const loadLaundryOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getLaundryOrders({
        branch_id: branchId,
        page: 1,
        perPage: 20,
        sort_order: "desc",
        ...(search.trim() ? { search: search.trim() } : {}),
      });
      setOrders(response.data || []);
      setMetaData(response.meta || null);
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to load laundry orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLaundryOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId, search]);

  const openAddModal = () => setFormModalOpen(true);
  const closeFormModal = () => setFormModalOpen(false);

  const openDetailsModal = (order: LaundryOrder) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedOrder(null);
  };

  const openPaymentModal = (order: LaundryOrder) => {
    setPaymentTargetOrder(order);
    setPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    setPaymentModalOpen(false);
    setPaymentTargetOrder(null);
  };

  const saveOrder = async (values: CreateLaundryOrderPayload) => {
    setSubmitting(true);
    try {
      await createLaundryOrder(values);
      setMessage("Laundry order created successfully.");
      closeFormModal();
      await loadLaundryOrders();
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to create laundry order.");
    } finally {
      setSubmitting(false);
    }
  };

  const savePayment = async (values: Parameters<typeof createLaundryPayment>[0]) => {
    setPaymentSubmitting(true);
    try {
      await createLaundryPayment(values);
      setMessage("Payment recorded successfully.");
      closePaymentModal();
      await loadLaundryOrders();
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to record payment.");
    } finally {
      setPaymentSubmitting(false);
    }
  };

  const deleteOrder = async (order: LaundryOrder) => {
    if (!window.confirm("Are you sure you want to delete this laundry order?")) {
      return;
    }
    setDeletingId(order.id);
    try {
      await removeLaundryOrder(order.id);
      setMessage("Laundry order deleted successfully.");
      await loadLaundryOrders();
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to delete laundry order.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6">
      <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Laundry Orders</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Manage and track laundry orders for this branch.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center rounded-lg bg-red-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-900"
        >
          + Add Order
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

      {error && (
        <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {metaData && <LaundryOrderMetaDashboard meta={metaData} />}

      <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-slate-900">Orders register</h2>
            <p className="mt-1 text-sm text-slate-500">Search laundry orders by guest name, room, or reference.</p>
          </div>
          <div className="grid w-full gap-3 sm:w-auto">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search orders"
              className="h-10 rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="p-3 sm:p-4">
          <LaundryOrdersList
            orders={orders}
            loading={loading}
            deletingId={deletingId}
            onView={openDetailsModal}
            onAddPayment={openPaymentModal}
            onDelete={deleteOrder}
          />
        </div>
      </section>

      <Modal
        zIndex={appZIndex.modal}
        open={formModalOpen}
        title="Add Laundry Order"
        onCancel={closeFormModal}
        footer={null}
        destroyOnClose
        centered
        width={860}
      >
        <div style={{ maxHeight: "80vh", overflowY: "scroll" }}>
          <div className="space-y-5">
            <p className="text-sm text-slate-500">
              Select the guest, room, and laundry items to create a new order.
            </p>

            <AddEditLaundryOrderForm formId={orderFormId} branchId={branchId} onSubmit={saveOrder} />

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
                form={orderFormId}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-lg bg-red-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-900 disabled:opacity-60"
              >
                {submitting && <LoadingOutlined />}
                Create Order
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        zIndex={appZIndex.modal}
        open={detailsModalOpen}
        title={selectedOrder ? `Order ${selectedOrder.order_reference}` : "Order details"}
        onCancel={closeDetailsModal}
        footer={null}
        destroyOnClose
        centered
        width={960}
      >
        <div style={{ maxHeight: "80vh", overflowY: "scroll" }}>
          {selectedOrder && <ViewLaundryOrderDetails order={selectedOrder} />}
        </div>
      </Modal>

      <Modal
        zIndex={appZIndex.modal}
        open={paymentModalOpen}
        title={paymentTargetOrder ? `Add Payment - ${paymentTargetOrder.order_reference}` : "Add Payment"}
        onCancel={closePaymentModal}
        footer={null}
        destroyOnClose
        centered
        width={720}
      >
        <div style={{ maxHeight: "80vh", overflowY: "scroll" }}>
          {paymentTargetOrder && (
            <div className="space-y-5">
              <p className="text-sm text-slate-500">Record a payment for this laundry order.</p>

              <AddLaundryPaymentForm
                formId={paymentFormId}
                branchId={branchId}
                order={paymentTargetOrder}
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

