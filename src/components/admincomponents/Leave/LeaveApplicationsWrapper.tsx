import { LoadingOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { FormEvent, useEffect, useState } from "react";
import {
  applyForLeave,
  cancelLeaveApplication,
  getMyLeaveApplications,
  getMyLeaveBalance,
} from "../../../apiservice/leave-service";
import { appZIndex } from "../../../utils/appconst";
import {
  apiErrorMessage,
  Banner,
  EmptyState,
  formatDate,
  inputClass,
  Pager,
  StatusBadge,
  StatusFilter,
  textareaClass,
} from "../Approvals/ApprovalShared";
import {
  LEAVE_TYPE_LABELS,
  LeaveApplication,
  LeaveApplicationFormValues,
  LeaveBalance,
  LeaveType,
} from "../Approvals/approvals.types";

const PER_PAGE = 10;

const countDays = (start: string, end: string) => {
  if (!start || !end) return 0;
  const diff = (Date.parse(end) - Date.parse(start)) / 86_400_000;
  return diff >= 0 ? Math.round(diff) + 1 : 0;
};

const emptyForm = (): LeaveApplicationFormValues => ({
  leave_type: "ANNUAL",
  start_date: "",
  end_date: "",
  reason: "",
});

export default function LeaveApplicationsWrapper() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [balance, setBalance] = useState<LeaveBalance | null>(null);
  const [records, setRecords] = useState<LeaveApplication[]>([]);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<LeaveApplicationFormValues>(emptyForm);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [balanceResponse, listResponse] = await Promise.all([
        getMyLeaveBalance(year),
        getMyLeaveApplications({ year, status, page, perPage: PER_PAGE, sort_order: "desc" }),
      ]);
      setBalance(balanceResponse);
      setRecords(listResponse.data || []);
      setTotalPages(listResponse.meta?.totalPages || 0);
    } catch (requestError) {
      setError(apiErrorMessage(requestError, "Unable to load your leave applications."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, status, page]);

  const requestedDays = countDays(form.start_date, form.end_date);
  const available = balance ? balance.remaining_days - balance.pending_days : 0;

  const openModal = () => {
    setForm(emptyForm());
    setFormError("");
    setModalOpen(true);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (requestedDays === 0) {
      setFormError("The end date must be on or after the start date.");
      return;
    }
    setSubmitting(true);
    setFormError("");
    try {
      await applyForLeave(form);
      setModalOpen(false);
      setMessage("Leave application submitted. You'll see the decision here once it's reviewed.");
      const appliedYear = Number(form.start_date.slice(0, 4));
      if (appliedYear !== year) setYear(appliedYear);
      else await load();
    } catch (requestError) {
      setFormError(apiErrorMessage(requestError, "Unable to submit your leave application."));
    } finally {
      setSubmitting(false);
    }
  };

  const cancel = async (record: LeaveApplication) => {
    if (!window.confirm("Cancel this leave application?")) return;
    setCancellingId(record.id);
    setError("");
    try {
      await cancelLeaveApplication(record.id);
      setMessage("Leave application cancelled.");
      await load();
    } catch (requestError) {
      setError(apiErrorMessage(requestError, "Unable to cancel this application."));
    } finally {
      setCancellingId(null);
    }
  };

  const update = <K extends keyof LeaveApplicationFormValues>(
    key: K,
    value: LeaveApplicationFormValues[K],
  ) => setForm((current) => ({ ...current, [key]: value }));

  const currentYear = new Date().getFullYear();
  const years = [currentYear + 1, currentYear, currentYear - 1, currentYear - 2];

  const stats = [
    { label: "Allowance", value: balance?.total_days },
    { label: "Used", value: balance?.used_days },
    { label: "Awaiting approval", value: balance?.pending_days },
    { label: "Remaining", value: balance?.remaining_days, highlight: true },
  ];

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6">
      <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Leave Applications</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Apply for leave and track your applications. Days are counted as calendar days.
          </p>
        </div>
        <button
          type="button"
          onClick={openModal}
          className="inline-flex items-center rounded-lg bg-red-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-900"
        >
          + Apply for Leave
        </button>
      </div>

      {message && (
        <Banner tone="success" onClose={() => setMessage("")}>
          {message}
        </Banner>
      )}

      <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-semibold text-slate-900">Your leave balance</h2>
          <select
            aria-label="Year"
            value={year}
            onChange={(event) => {
              setYear(Number(event.target.value));
              setPage(1);
            }}
            className="h-9 rounded-lg border border-slate-300 bg-white px-2 text-sm"
          >
            {years.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={
                "rounded-xl p-4 " + (stat.highlight ? "bg-red-50 text-red-900" : "bg-slate-50")
              }
            >
              <dt className="text-xs uppercase tracking-wide text-slate-500">{stat.label}</dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums">
                {stat.value ?? "-"}
                <span className="ml-1 text-sm font-normal text-slate-500">days</span>
              </dd>
            </div>
          ))}
        </dl>
        {balance && balance.total_days === 0 && (
          <p className="mt-3 text-sm text-amber-700">
            No leave allowance has been set for you in {year}. Ask HR to set it on your staff record.
          </p>
        )}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-4 lg:flex-row lg:items-center">
          <h2 className="font-semibold text-slate-900">Your applications in {year}</h2>
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
            <div className="py-10 text-center text-slate-500">Loading applications...</div>
          ) : records.length === 0 ? (
            <EmptyState>No leave applications{status ? ` with status ${status.toLowerCase()}` : ""}.</EmptyState>
          ) : (
            <div className="grid gap-3">
              {records.map((record) => (
                <article key={record.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {LEAVE_TYPE_LABELS[record.leave_type] || record.leave_type} leave ·{" "}
                        {record.days} day{record.days === 1 ? "" : "s"}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {formatDate(record.start_date)} – {formatDate(record.end_date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
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
                  {record.reason && <p className="mt-3 text-sm text-slate-700">{record.reason}</p>}
                  {record.reviewer && (
                    <p className="mt-3 rounded-lg bg-slate-50 p-2 text-sm text-slate-600">
                      {record.status === "APPROVED" ? "Approved" : "Rejected"} by{" "}
                      {record.reviewer.first_name} {record.reviewer.last_name}
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
        title="Apply for Leave"
        onCancel={() => !submitting && setModalOpen(false)}
        footer={null}
        destroyOnClose
        centered
        width={640}
      >
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Leave type <span className="text-red-600">*</span>
            <select
              required
              value={form.leave_type}
              onChange={(event) => update("leave_type", event.target.value as LeaveType)}
              className={`${inputClass} bg-white`}
            >
              {Object.entries(LEAVE_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Start date <span className="text-red-600">*</span>
              <input
                required
                type="date"
                value={form.start_date}
                onChange={(event) => update("start_date", event.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              End date <span className="text-red-600">*</span>
              <input
                required
                type="date"
                min={form.start_date || undefined}
                value={form.end_date}
                onChange={(event) => update("end_date", event.target.value)}
                className={inputClass}
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            Reason
            <textarea
              rows={3}
              value={form.reason}
              onChange={(event) => update("reason", event.target.value)}
              className={textareaClass}
            />
          </label>

          <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
            {requestedDays > 0 ? (
              <>
                Requesting <strong>{requestedDays}</strong> calendar day{requestedDays === 1 ? "" : "s"}.
                {form.start_date.slice(0, 4) === String(year) && (
                  <> You have {Math.max(available, 0)} day{available === 1 ? "" : "s"} available in {year}.</>
                )}
              </>
            ) : (
              "Pick a start and end date to see how many days this uses."
            )}
          </p>

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
              Submit Application
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
