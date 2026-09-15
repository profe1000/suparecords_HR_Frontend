import { LoadingOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import AddEditExpenseCategoryForm from "./AddEditExpenseCategoryForm";
import ExpenseCategoriesList from "./ExpenseCategoriesList";
import {
  ExpenseCategory,
  CreateExpenseCategoryPayload,
} from "../../../apiservice/expenses-service.type";
import { appZIndex } from "../../../utils/appconst";
import {
  createExpenseCategory,
  deleteExpenseCategory as removeExpenseCategory,
  getExpenseCategories,
  updateExpenseCategory,
} from "../../../apiservice/expenses-service";
import { useAppSelector } from "../../../Redux/reduxCustomHook";
import type { RootState } from "../../../Redux/store";

export default function ExpenseCategoriesWrapper() {
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [search, setSearch] = useState("");
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const formId = "expense-category-form";
  const authData = useAppSelector((state: RootState) => state.AdminAuthData);
  const branchId = authData.staff?.branch_id || authData.data?.id || 1;

  const loadExpenseCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getExpenseCategories({
        branch_id: branchId,
        page: 1,
        perPage: 20,
        sort_order: "desc",
        ...(search.trim() ? { search: search.trim() } : {}),
      });
      setCategories(response.data || []);
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to load expense categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenseCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId, search]);

  const openAddModal = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const openEditModal = (category: ExpenseCategory) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
  };

  const saveExpenseCategory = async (values: any) => {
    setSubmitting(true);
    try {
      const payload: CreateExpenseCategoryPayload = {
        branch_id: branchId,
        name: values.name,
        description: values.description,
      };
      if (editingCategory) {
        await updateExpenseCategory(editingCategory.id, {
          name: values.name,
          description: values.description,
        });
        setMessage("Expense category updated successfully.");
      } else {
        await createExpenseCategory(payload);
        setMessage("Expense category created successfully.");
      }
      closeModal();
      await loadExpenseCategories();
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to save expense category.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteExpenseCategory = async (category: ExpenseCategory) => {
    setDeletingId(category.id);
    try {
      await removeExpenseCategory(category.id);
      setMessage("Expense category deleted successfully.");
      await loadExpenseCategories();
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to delete expense category.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6">
      <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Expense Categories</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Manage expense categories for tracking different types of expenses.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center rounded-lg bg-red-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-900"
        >
          + Add Category
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
            <h2 className="font-semibold text-slate-900">Expense category register</h2>
            <p className="mt-1 text-sm text-slate-500">
              Search categories by name or description.
            </p>
          </div>
          <div className="grid w-full gap-3 sm:w-auto">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search categories"
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
          <ExpenseCategoriesList
            categories={categories}
            loading={loading}
            deletingId={deletingId}
            onEdit={openEditModal}
            onDelete={deleteExpenseCategory}
          />
        </div>
      </section>

      <Modal
        zIndex={appZIndex.modal}
        open={modalOpen}
        title={editingCategory ? "Edit Expense Category" : "Add Expense Category"}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
        centered
        width={720}
      >
        <div style={{ maxHeight: "80vh", overflowY: "scroll" }}>
          <div className="space-y-5">
            <p className="text-sm text-slate-500">
              Use the form below to create or update expense category details.
            </p>

            <AddEditExpenseCategoryForm
              key={editingCategory?.id || "new"}
              formId={formId}
              branchId={branchId}
              initialValues={editingCategory}
              onSubmit={saveExpenseCategory}
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
                {editingCategory ? "Save Changes" : "Create Category"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
