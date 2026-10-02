import { LinkOutlined, LoadingOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { careersPageUrl, createJob, deleteJob, getJobs, updateJob } from "../../../apiservice/recruitment-service";
import useBusinessContext, { branchLabel } from "../../../hooks/useBusinessContext";
import BranchFilter from "../../Sharedcomponents/BranchFilter/BranchFilter";
import { appZIndex } from "../../../utils/appconst";
import {
  apiErrorMessage,
  Banner,
  EmptyState,
  formatDate,
  inputClass,
  Pager,
  textareaClass,
} from "../Approvals/ApprovalShared";
import {
  EMPLOYMENT_TYPE_LABELS,
  EmploymentType,
  JOB_STATUS_LABELS,
  JobOpening,
  JobOpeningFormValues,
  JobStatus,
} from "./recruitment.types";

const PER_PAGE = 20;

const jobStatusClass: Record<JobStatus, string> = {
  DRAFT: "bg-slate-100 text-slate-600",
  OPEN: "bg-emerald-100 text-emerald-700",
  CLOSED: "bg-rose-100 text-rose-700",
};

const toForm = (job?: JobOpening | null): JobOpeningFormValues => ({
  title: job?.title || "",
  department: job?.department || "",
  location: job?.location || "",
  employment_type: job?.employment_type || "FULL_TIME",
  description: job?.description || "",
  requirements: job?.requirements || "",
  salary_range: job?.salary_range || "",
  closing_date: job?.closing_date || "",
  status: job?.status || "DRAFT",
  branch_id: job?.branch_id || "",
});

export default function JobOpeningsWrapper() {
  const business = useBusinessContext();
  const hasBranches = (business?.branches.length || 0) > 1;
  const [branchFilter, setBranchFilter] = useState<number | "">("");
  const [records, setRecords] = useState<JobOpening[]>([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<JobOpening | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<JobOpeningFormValues>(toForm());
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getJobs({
        status,
        branch_id: branchFilter || undefined,
        search: search.trim(),
        page,
        perPage: PER_PAGE,
      });
      setRecords(response.data || []);
      setTotalPages(response.meta?.totalPages || 0);
    } catch (requestError) {
      setError(apiErrorMessage(requestError, "Unable to load job openings."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, branchFilter, search, page]);

  const openModal = (job: JobOpening | null) => {
    setEditing(job);
    setForm(toForm(job));
    setFormError("");
    setModalOpen(true);
  };

  const update = <K extends keyof JobOpeningFormValues>(key: K, value: JobOpeningFormValues[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      if (editing) await updateJob(editing.id, form);
      else await createJob(form);
      setModalOpen(false);
      setMessage(
        form.status === "OPEN"
          ? `"${form.title}" is live on the careers page.`
          : `"${form.title}" saved as ${JOB_STATUS_LABELS[form.status].toLowerCase()}.`,
      );
      await load();
    } catch (requestError) {
      setFormError(apiErrorMessage(requestError, "Unable to save this job opening."));
    } finally {
      setSubmitting(false);
    }
  };

  const changeStatus = async (job: JobOpening, next: JobStatus) => {
    setBusyId(job.id);
    setError("");
    try {
      await updateJob(job.id, { status: next });
      setMessage(`"${job.title}" is now ${JOB_STATUS_LABELS[next].toLowerCase()}.`);
      await load();
    } catch (requestError) {
      setError(apiErrorMessage(requestError, "Unable to update this job opening."));
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (job: JobOpening) => {
    if (!window.confirm(`Delete "${job.title}"? Its applicants will no longer be visible.`)) return;
    setBusyId(job.id);
    setError("");
    try {
      await deleteJob(job.id);
      setMessage(`"${job.title}" was deleted.`);
      await load();
    } catch (requestError) {
      setError(apiErrorMessage(requestError, "Unable to delete this job opening."));
    } finally {
      setBusyId(null);
    }
  };

  const copyCareersLink = async () => {
    if (!business) return;
    const url = careersPageUrl(business.business.id);
    try {
      await navigator.clipboard.writeText(url);
      setMessage(`Careers page link copied: ${url}`);
    } catch {
      setMessage(`Careers page link: ${url}`);
    }
  };

  const isExpired = (job: JobOpening) =>
    // en-CA formats as YYYY-MM-DD in local time, matching the API's date strings.
    Boolean(job.closing_date) && job.closing_date! < new Date().toLocaleDateString("en-CA");

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6">
      <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Recruitment</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Post job openings and review applicants. Open jobs appear on the public careers page.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copyCareersLink}
            disabled={!business}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <LinkOutlined /> Copy careers link
          </button>
          <button
            type="button"
            onClick={() => openModal(null)}
            className="inline-flex items-center rounded-lg bg-red-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-900"
          >
            + New Job Opening
          </button>
        </div>
      </div>

      {message && (
        <Banner tone="success" onClose={() => setMessage("")}>
          {message}
        </Banner>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-2 sm:flex-row">
          <BranchFilter
            business={business}
            value={branchFilter}
            onChange={(value) => {
              setBranchFilter(value);
              setPage(1);
            }}
          />
          <select
            aria-label="Status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            className="h-10 rounded-lg border border-slate-300 bg-white px-2 text-sm"
          >
            <option value="">All statuses</option>
            {Object.entries(JOB_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          </div>
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search title, department or location"
            className="h-10 rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100 sm:w-80"
          />
        </div>

        <div className="p-3 sm:p-4">
          {error && <Banner tone="error">{error}</Banner>}
          {loading ? (
            <div className="py-10 text-center text-slate-500">Loading job openings...</div>
          ) : records.length === 0 ? (
            <EmptyState>No job openings yet. Create one to start receiving applications.</EmptyState>
          ) : (
            <div className="grid gap-3">
              {records.map((job) => (
                <article key={job.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{job.title}</h3>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${jobStatusClass[job.status]}`}>
                          {JOB_STATUS_LABELS[job.status]}
                        </span>
                        {job.status === "OPEN" && isExpired(job) && (
                          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                            Past closing date, hidden from careers page
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        {[
                          hasBranches ? branchLabel(business, job.branch_id) : null,
                          job.department,
                          job.location,
                          EMPLOYMENT_TYPE_LABELS[job.employment_type],
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Posted {formatDate(job.created_at)}
                        {job.closing_date ? ` · Closes ${formatDate(job.closing_date)}` : ""}
                      </p>
                    </div>
                    <Link
                      to={`/admin/recruitment/${job.id}`}
                      className="rounded-lg bg-slate-50 px-3 py-2 text-right hover:bg-slate-100"
                    >
                      <span className="block text-xl font-semibold tabular-nums text-slate-900">{job.applicant_count}</span>
                      <span className="text-xs text-slate-500">
                        applicant{job.applicant_count === 1 ? "" : "s"}
                        {job.new_applicant_count > 0 && (
                          <span className="ml-1 font-medium text-sky-700">({job.new_applicant_count} new)</span>
                        )}
                      </span>
                    </Link>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      to={`/admin/recruitment/${job.id}`}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      View applicants
                    </Link>
                    <button
                      type="button"
                      onClick={() => openModal(job)}
                      disabled={busyId === job.id}
                      className="rounded-lg border border-blue-700 px-3 py-1.5 text-sm font-medium text-blue-800 hover:bg-blue-50 disabled:opacity-60"
                    >
                      Edit
                    </button>
                    {job.status !== "OPEN" ? (
                      <button
                        type="button"
                        onClick={() => changeStatus(job, "OPEN")}
                        disabled={busyId === job.id}
                        className="rounded-lg border border-emerald-700 px-3 py-1.5 text-sm font-medium text-emerald-800 hover:bg-emerald-50 disabled:opacity-60"
                      >
                        Publish
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => changeStatus(job, "CLOSED")}
                        disabled={busyId === job.id}
                        className="rounded-lg border border-amber-600 px-3 py-1.5 text-sm font-medium text-amber-800 hover:bg-amber-50 disabled:opacity-60"
                      >
                        Close
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => remove(job)}
                      disabled={busyId === job.id}
                      className="rounded-lg border border-red-500 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
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
        title={editing ? "Edit Job Opening" : "New Job Opening"}
        onCancel={() => !submitting && setModalOpen(false)}
        footer={null}
        destroyOnClose
        centered
        width={760}
      >
        <form onSubmit={submit} className="space-y-4" style={{ maxHeight: "75vh", overflowY: "auto" }}>
          <label className="block text-sm font-medium text-slate-700">
            Job title <span className="text-red-600">*</span>
            <input
              required
              maxLength={255}
              value={form.title}
              onChange={(event) => update("title", event.target.value)}
              className={inputClass}
            />
          </label>

          {hasBranches && (
            <label className="block text-sm font-medium text-slate-700">
              Branch
              <select
                value={form.branch_id}
                onChange={(event) =>
                  update("branch_id", event.target.value === "" ? "" : Number(event.target.value))
                }
                className={`${inputClass} bg-white`}
              >
                <option value="">All branches (whole business)</option>
                {business?.branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.branch_name}
                    {branch.city ? ` (${branch.city})` : ""}
                  </option>
                ))}
              </select>
            </label>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <label className="block text-sm font-medium text-slate-700">
              Department
              <input value={form.department} onChange={(event) => update("department", event.target.value)} className={inputClass} />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Location
              <input value={form.location} onChange={(event) => update("location", event.target.value)} className={inputClass} />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Employment type
              <select
                value={form.employment_type}
                onChange={(event) => update("employment_type", event.target.value as EmploymentType)}
                className={`${inputClass} bg-white`}
              >
                {Object.entries(EMPLOYMENT_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            Description <span className="text-red-600">*</span>
            <textarea
              required
              rows={5}
              value={form.description}
              onChange={(event) => update("description", event.target.value)}
              className={textareaClass}
              placeholder="What the role involves"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Requirements
            <textarea
              rows={4}
              value={form.requirements}
              onChange={(event) => update("requirements", event.target.value)}
              className={textareaClass}
              placeholder="Qualifications, experience, skills"
            />
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <label className="block text-sm font-medium text-slate-700">
              Salary range
              <input
                value={form.salary_range}
                onChange={(event) => update("salary_range", event.target.value)}
                placeholder="e.g. ₦250k – ₦350k / month"
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Closing date
              <input
                type="date"
                value={form.closing_date}
                onChange={(event) => update("closing_date", event.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Status
              <select
                value={form.status}
                onChange={(event) => update("status", event.target.value as JobStatus)}
                className={`${inputClass} bg-white`}
              >
                <option value="DRAFT">Draft (hidden)</option>
                <option value="OPEN">Open (on careers page)</option>
                <option value="CLOSED">Closed</option>
              </select>
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
              {editing ? "Save Changes" : "Create Job"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
