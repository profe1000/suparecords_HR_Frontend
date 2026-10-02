import { ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Branch,
  BranchFormValues,
  createBranch,
  deleteBranch,
  getBranches,
  updateBranch,
} from "../../../apiservice/branch-service";
import { invalidateBusinessContext } from "../../../hooks/useBusinessContext";
import { appZIndex } from "../../../utils/appconst";
import { apiErrorMessage, Banner, EmptyState, inputClass } from "../Approvals/ApprovalShared";

const toForm = (branch?: Branch | null): BranchFormValues => ({
  branch_name: branch?.branch_name || "",
  city: branch?.city || "",
  state: branch?.state || "",
  country: branch?.country || "",
  address: branch?.address || "",
  phone_number: branch?.phone_number || "",
  email: branch?.email || "",
});

/** Why a branch can't be deleted, or null when it can. Mirrors the API's guard. */
const deleteBlocker = (branch: Branch) => {
  if (branch.is_main) return "The main branch can't be deleted.";
  const inUse = [
    [branch.staff_count, "staff member"],
    [branch.task_count, "task"],
    [branch.job_count, "job opening"],
  ]
    .filter(([count]) => count)
    .map(([count, label]) => `${count} ${label}${count === 1 ? "" : "s"}`);
  return inUse.length ? `Still has ${inUse.join(", ")}. Move or remove them first.` : null;
};

export default function BranchesWrapper() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<Branch | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<BranchFormValues>(toForm());
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setBranches(await getBranches());
    } catch (requestError) {
      setError(apiErrorMessage(requestError, "Unable to load branches."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openModal = (branch: Branch | null) => {
    setEditing(branch);
    setForm(toForm(branch));
    setFormError("");
    setModalOpen(true);
  };

  const update = (key: keyof BranchFormValues, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      if (editing) await updateBranch(editing.id, form);
      else await createBranch(form);
      invalidateBusinessContext();
      setModalOpen(false);
      setMessage(`Branch "${form.branch_name.trim()}" ${editing ? "updated" : "created"}.`);
      await load();
    } catch (requestError) {
      setFormError(apiErrorMessage(requestError, "Unable to save this branch."));
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (branch: Branch) => {
    if (!window.confirm(`Delete the branch "${branch.branch_name}"?`)) return;
    setDeletingId(branch.id);
    setError("");
    try {
      await deleteBranch(branch.id);
      invalidateBusinessContext();
      setMessage(`Branch "${branch.branch_name}" deleted.`);
      await load();
    } catch (requestError) {
      setError(apiErrorMessage(requestError, "Unable to delete this branch."));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6">
      <Link to="/admin/settings" className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
        <ArrowLeftOutlined /> Settings
      </Link>

      <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Branches</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Add and manage your business's branches. Every staff member belongs to a branch.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openModal(null)}
          className="inline-flex items-center rounded-lg bg-red-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-900"
        >
          + Add Branch
        </button>
      </div>

      {message && (
        <Banner tone="success" onClose={() => setMessage("")}>
          {message}
        </Banner>
      )}
      {error && (
        <Banner tone="error" onClose={() => setError("")}>
          {error}
        </Banner>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        {loading ? (
          <div className="py-10 text-center text-slate-500">Loading branches...</div>
        ) : branches.length === 0 ? (
          <EmptyState>No branches yet.</EmptyState>
        ) : (
          <div className="grid gap-3">
            {branches.map((branch) => {
              const blocker = deleteBlocker(branch);
              return (
                <article key={branch.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-semibold text-slate-900">{branch.branch_name}</h2>
                        {branch.is_main && (
                          <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-800">Main branch</span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        {[branch.address, branch.city, branch.state, branch.country].filter(Boolean).join(", ") || "No address set"}
                      </p>
                      {(branch.phone_number || branch.email) && (
                        <p className="mt-1 text-xs text-slate-500">
                          {[branch.phone_number, branch.email].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </div>
                    <dl className="flex gap-4 text-center text-sm">
                      {[
                        ["Staff", branch.staff_count],
                        ["Tasks", branch.task_count],
                        ["Jobs", branch.job_count],
                      ].map(([label, count]) => (
                        <div key={label}>
                          <dd className="text-lg font-semibold tabular-nums text-slate-900">{count}</dd>
                          <dt className="text-xs text-slate-500">{label}</dt>
                        </div>
                      ))}
                    </dl>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openModal(branch)}
                      className="rounded-lg border border-blue-700 px-3 py-1.5 text-sm font-medium text-blue-800 hover:bg-blue-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(branch)}
                      disabled={Boolean(blocker) || deletingId === branch.id}
                      title={blocker || "Delete branch"}
                      className="rounded-lg border border-red-500 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                    >
                      {deletingId === branch.id ? "Deleting..." : "Delete"}
                    </button>
                    {blocker && <span className="text-xs text-slate-500">{blocker}</span>}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <Modal
        zIndex={appZIndex.modal}
        open={modalOpen}
        title={editing ? "Edit Branch" : "Add Branch"}
        onCancel={() => !submitting && setModalOpen(false)}
        footer={null}
        destroyOnClose
        centered
        width={640}
      >
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Branch name <span className="text-red-600">*</span>
            <input
              required
              maxLength={255}
              value={form.branch_name}
              onChange={(event) => update("branch_name", event.target.value)}
              placeholder="e.g. Abuja Office"
              className={inputClass}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Address
            <input value={form.address} onChange={(event) => update("address", event.target.value)} className={inputClass} />
          </label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <label className="block text-sm font-medium text-slate-700">
              City
              <input value={form.city} onChange={(event) => update("city", event.target.value)} className={inputClass} />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              State
              <input value={form.state} onChange={(event) => update("state", event.target.value)} className={inputClass} />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Country
              <input value={form.country} onChange={(event) => update("country", event.target.value)} className={inputClass} />
            </label>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Phone
              <input type="tel" value={form.phone_number} onChange={(event) => update("phone_number", event.target.value)} className={inputClass} />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Email
              <input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} className={inputClass} />
            </label>
          </div>

          {formError && <Banner tone="error">{formError}</Banner>}

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              disabled={submitting}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-red-800 px-4 py-2 text-sm font-medium text-white hover:bg-red-900 disabled:opacity-60"
            >
              {submitting && <LoadingOutlined />}
              {editing ? "Save Changes" : "Create Branch"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
