import { LoadingOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { FormEvent, useEffect, useState } from "react";
import { cancelRequest, getMyRequests, submitRequest } from "../../../apiservice/request-service";
import { appZIndex } from "../../../utils/appconst";
import {
  apiErrorMessage,
  Banner,
  EmptyState,
  formatAmount,
  formatDateTime,
  inputClass,
  Pager,
  StatusBadge,
  StatusFilter,
  textareaClass,
} from "../Approvals/ApprovalShared";
import {
  FINANCIAL_REQUEST_TYPES,
  REQUEST_TYPE_LABELS,
  RequestType,
  StaffRequest,
  StaffRequestFormValues,
} from "../Approvals/approvals.types";

const PER_PAGE = 10;

const emptyForm = (): StaffRequestFormValues => ({
  request_type: "CASH_ADVANCE",
  title: "",
  description: "",
  amount: "",
});

export default function RequestSubmissionWrapper() {
  const [records, setRecords] = useState<StaffRequest[]>([]);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<StaffRequestFormValues>(emptyForm);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getMyRequests({ status, page, perPage: PER_PAGE, sort_order: "desc" });
      setRecords(response.data || []);
      setTotalPages(response.meta?.totalPages || 0);
    } catch (requestError) {
      setError(apiErrorMessage(requestError, "Unable to load your requests."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page]);

  const needsAmount = FINANCIAL_REQUEST_TYPES.includes(form.request_type);

  const update = <K extends keyof StaffRequestFormValues>(key: K, value: StaffRequestFormValues[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const openModal = () => {
    setForm(emptyForm());
    setFormError("");
    setModalOpen(true);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      await submitRequest(form);
      setModalOpen(false);
      setMessage("Request submitted. You'll see the decision here once it's reviewed.");
      if (page !== 1 || status) {
        setStatus("");
        setPage(1);
      } else {
        await load();
      }
    } catch (requestError) {
      setFormError(apiErrorMessage(requestError, "Unable to submit your request."));
    } finally {
      setSubmitting(false);
    }
  };

  const cancel = async (record: StaffRequest) => {
    if (!window.confirm(`Cancel the request "${record.title}"?`)) return;
    setCancellingId(record.id);
    setError("");
    try {
      await cancelRequest(record.id);
      setMessage("Request cancelled.");
      await load();
    } catch (requestError) {
      setError(apiErrorMessage(requestError, "Unable to cancel this request."));
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6">
      <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Request Submission</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Submit cash advance, loan, reimbursement, equipment or other requests and follow their progress.
          </p>
        </div>
        <button
          type="button"
          onClick={openModal}
          className="inline-flex items-center rounded-lg bg-red-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-900"
        >
          + New Request
        </button>
      </div>

      {message && (
        <Banner tone="success" onClose={() => setMessage("")}>
          {message}
        </Banner>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-4 lg:flex-row lg:items-center">
          <h2 className="font-semibold text-slate-900">Your requests</h2>
          <StatusFilter
            value={status}
            onChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
          />
        </div>

        <div className="p-3 sm:p-4">
          {error && <Banner tone="error">{error}</Banner>}
          {loading ? (
            <div className="py-10 text-center text-slate-500">Loading requests...</div>
          ) : records.length === 0 ? (
            <EmptyState>No requests{status ? ` with status ${status.toLowerCase()}` : " yet"}.</EmptyState>
          ) : (
            <div className="grid gap-3">
              {records.map((record) => (
                <article key={record.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        {REQUEST_TYPE_LABELS[record.request_type] || record.request_type}
                      </p>
                      <h3 className="mt-1 font-semibold text-slate-900">{record.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">Submitted {formatDateTime(record.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {record.amount && (
                        <span className="font-semibold tabular-nums text-slate-900">
                          {formatAmount(record.amount)}
                        </span>
                      )}
                      <StatusBadge status={record.status} />
                      {record.status === "PENDING" && (
                        <button
                          type="button"
                          onClick={() => cancel(record)}
                          disabled={cancellingId === record.id}
                          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                        >
                          {cancellingId === record.id ? "Cancelling..." : "Cancel"}
                        </button>
                      )}
                    </div>
                  </div>
                  {record.description && <p className="mt-3 text-sm text-slate-700">{record.description}</p>}
                  {record.reviewer && (
                    <p className="mt-3 rounded-lg bg-slate-50 p-2 text-sm text-slate-600">
                      {record.status === "APPROVED" ? "Approved" : "Rejected"} by {record.reviewer.first_name}{" "}
                      {record.reviewer.last_name}
                      {record.review_comment ? `: “${record.review_comment}”` : ""}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
          <Pager page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </section>

      <Modal
        zIndex={appZIndex.modal}
        open={modalOpen}
        title="New Request"
        onCancel={() => !submitting && setModalOpen(false)}
        footer={null}
        destroyOnClose
        centered
        width={640}
      >
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Request type <span className="text-red-600">*</span>
              <select
                required
                value={form.request_type}
                onChange={(event) => update("request_type", event.target.value as RequestType)}
                className={`${inputClass} bg-white`}
              >
                {Object.entries(REQUEST_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Amount {needsAmount ? <span className="text-red-600">*</span> : "(optional)"}
              <input
                required={needsAmount}
                type="number"
                min="0.01"
                step="0.01"
                inputMode="decimal"
                value={form.amount}
                onChange={(event) => update("amount", event.target.value)}
                className={inputClass}
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            Title <span className="text-red-600">*</span>
            <input
              required
              maxLength={255}
              value={form.title}
              onChange={(event) => update("title", event.target.value)}
              placeholder="e.g. Salary advance for school fees"
              className={inputClass}
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Details
            <textarea
              rows={4}
              value={form.description}
              onChange={(event) => update("description", event.target.value)}
              className={textareaClass}
            />
          </label>

          {formError && <Banner tone="error">{formError}</Banner>}

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              disabled={submitting}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-red-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-900 disabled:opacity-60"
            >
              {submitting && <LoadingOutlined />}
              Submit Request
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
