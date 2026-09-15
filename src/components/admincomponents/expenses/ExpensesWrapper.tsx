import { LoadingOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import { appZIndex } from "../../../utils/appconst";
import { useAppSelector } from "../../../Redux/reduxCustomHook";
import type { RootState } from "../../../Redux/store";
import {
  getExpenses,
  createExpense,
  approveExpense,
  deleteExpense as removeExpense,
  createExpensePayment,
} from "../../../apiservice/expenses-records-service";
import {
  Expense,
  ExpenseListResponse,
  CreateExpensePayload,
  CreateExpensePaymentPayload,
} from "../../../apiservice/expenses-records-service.type";
import ExpensesList from "./ExpensesList";
import ExpenseMetaDashboard from "./ExpenseMetaDashboard";
import AddEditExpenseForm from "./AddEditExpenseForm";
import AddExpensePaymentForm from "./AddExpensePaymentForm";
import ViewExpenseDetails from "./ViewExpenseDetails";

export default function ExpensesWrapper() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [metaData, setMetaData] = useState<ExpenseListResponse["meta"] | null>(null);
  const [search, setSearch] = useState("");
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [paymentTargetExpense, setPaymentTargetExpense] = useState<Expense | null>(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const expenseFormId = "expense-form";
  const paymentFormId = "expense-payment-form";

  const authData = useAppSelector((state: RootState) => state.AdminAuthData);
  const branchId = authData.staff?.branch_id || authData.data?.id || 1;
  const staffId = authData.staff?.id || 0;

  const loadExpenses = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getExpenses({
        branch_id: branchId,
        page: 1,
        perPage: 20,
        sort_order: "desc",
        ...(search.trim() ? { search: search.trim() } : {}),
      });
      setExpenses(response.data || []);
      setMetaData(response.meta || null);
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to load expenses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId, search]);

  const openAddModal = () => setFormModalOpen(true);
  const closeFormModal = () => setFormModalOpen(false);

  const openDetailsModal = (expense: Expense) => {
    setSelectedExpense(expense);
    setDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedExpense(null);
  };

  const openPaymentModal = (expense: Expense) => {
    setPaymentTargetExpense(expense);
    setPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    setPaymentModalOpen(false);
    setPaymentTargetExpense(null);
  };

  const saveExpense = async (values: CreateExpensePayload) => {
    setSubmitting(true);
    try {
      await createExpense(values);
      setMessage("Expense created successfully.");
      closeFormModal();
      await loadExpenses();
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to create expense.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (expense: Expense, approved: boolean) => {
    const confirmMessage = approved
      ? `Approve expense ${expense.reference}?`
      : `Revoke approval for expense ${expense.reference}?`;
    if (!window.confirm(confirmMessage)) return;
    try {
      await approveExpense(expense.id, { approved_by: staffId, approved });
      setMessage(approved ? "Expense approved successfully." : "Expense approval revoked.");
      await loadExpenses();
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to update expense approval.");
    }
  };

  const deleteExpense = async (expense: Expense) => {
    setDeletingId(expense.id);
    try {
      await removeExpense(expense.id);
      setMessage("Expense deleted successfully.");
      await loadExpenses();
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to delete expense.");
    } finally {
      setDeletingId(null);
    }
  };

  const savePayment = async (values: CreateExpensePaymentPayload) => {
    setPaymentSubmitting(true);
    try {
      await createExpensePayment(values);
      setMessage("Payment recorded successfully.");
      closePaymentModal();
      await loadExpenses();
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
          <h1 className="text-2xl font-semibold text-slate-900">Expenses</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Manage expense requests, approvals, and vendor payments.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center rounded-lg bg-red-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-900"
        >
          + Add Expense
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

      {metaData && <ExpenseMetaDashboard meta={metaData} />}

      <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-slate-900">Expenses register</h2>
            <p className="mt-1 text-sm text-slate-500">
              Search expenses by reference, vendor or category.
            </p>
          </div>

          <div className="grid w-full gap-3 sm:w-auto">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search expenses"
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
          <ExpensesList
            expenses={expenses}
            loading={loading}
            deletingId={deletingId}
            onView={openDetailsModal}
            onAddPayment={openPaymentModal}
            onApprove={handleApprove}
            onDelete={deleteExpense}
          />
        </div>
      </section>

      <Modal
        zIndex={appZIndex.modal}
        open={formModalOpen}
        title="Add Expense"
        onCancel={closeFormModal}
        footer={null}
        destroyOnClose
        centered
        width={860}
      >
        <div style={{ maxHeight: "80vh", overflowY: "scroll" }}>
          <div className="space-y-5">
            <p className="text-sm text-slate-500">
              Select the category, vendor and items to raise a new expense.
            </p>

            <AddEditExpenseForm
              formId={expenseFormId}
              branchId={branchId}
              staffId={staffId}
              onSubmit={saveExpense}
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
                form={expenseFormId}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-lg bg-red-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-900 disabled:opacity-60"
              >
                {submitting && <LoadingOutlined />}
                Create Expense
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        zIndex={appZIndex.modal}
        open={detailsModalOpen}
        title={selectedExpense ? `Expense ${selectedExpense.reference}` : "Expense details"}
        onCancel={closeDetailsModal}
        footer={null}
        destroyOnClose
        centered
        width={960}
      >
        <div style={{ maxHeight: "80vh", overflowY: "scroll" }}>
          {selectedExpense && <ViewExpenseDetails expense={selectedExpense} />}
        </div>
      </Modal>

      <Modal
        zIndex={appZIndex.modal}
        open={paymentModalOpen}
        title={paymentTargetExpense ? `Add Payment - ${paymentTargetExpense.reference}` : "Add Payment"}
        onCancel={closePaymentModal}
        footer={null}
        destroyOnClose
        centered
        width={720}
      >
        <div style={{ maxHeight: "80vh", overflowY: "scroll" }}>
          {paymentTargetExpense && (
            <div className="space-y-5">
              <p className="text-sm text-slate-500">Record a payment for this expense.</p>

              <AddExpensePaymentForm
                formId={paymentFormId}
                branchId={branchId}
                expense={paymentTargetExpense}
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
