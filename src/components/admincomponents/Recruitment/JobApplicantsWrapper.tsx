import { ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getApplicants, getJob, updateApplicant } from "../../../apiservice/recruitment-service";
import { appZIndex } from "../../../utils/appconst";
import {
  apiErrorMessage,
  Banner,
  EmptyState,
  formatDate,
  formatDateTime,
  Pager,
  textareaClass,
} from "../Approvals/ApprovalShared";
import {
  APPLICANT_STATUS_CLASSES,
  APPLICANT_STATUS_LABELS,
  ApplicantStatus,
  EMPLOYMENT_TYPE_LABELS,
  JOB_STATUS_LABELS,
  JobApplicant,
  JobOpening,
} from "./recruitment.types";

const PER_PAGE = 20;
const STAGES = Object.keys(APPLICANT_STATUS_LABELS) as ApplicantStatus[];

export default function JobApplicantsWrapper() {
  const { id = "" } = useParams<{ id: string }>();
  const [job, setJob] = useState<JobOpening | null>(null);
  const [records, setRecords] = useState<JobApplicant[]>([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [viewing, setViewing] = useState<JobApplicant | null>(null);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    getJob(id)
      .then(setJob)
      .catch((requestError) => setError(apiErrorMessage(requestError, "Unable to load this job opening.")));
  }, [id]);

  const load = async () => {
    setLoading(true);
    try {
      const response = await getApplicants(id, { status, search: search.trim(), page, perPage: PER_PAGE });
      setRecords(response.data || []);
      setTotalPages(response.meta?.totalPages || 0);
    } catch (requestError) {
      setError(apiErrorMessage(requestError, "Unable to load applicants."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, status, search, page]);

  const replace = (updated: JobApplicant) =>
    setRecords((current) => current.map((item) => (item.id === updated.id ? updated : item)));

  const changeStage = async (applicant: JobApplicant, next: ApplicantStatus) => {
    setBusyId(applicant.id);
    setError("");
    try {
      replace(await updateApplicant(applicant.id, { status: next }));
    } catch (requestError) {
      setError(apiErrorMessage(requestError, "Unable to update this applicant."));
    } finally {
      setBusyId(null);
    }
  };

  const openApplicant = (applicant: JobApplicant) => {
    setViewing(applicant);
    setNotes(applicant.notes || "");
  };

  const saveNotes = async () => {
    if (!viewing) return;
    setSavingNotes(true);
    try {
      const updated = await updateApplicant(viewing.id, { notes: notes.trim() || null });
      replace(updated);
      setViewing(null);
    } catch (requestError) {
      setError(apiErrorMessage(requestError, "Unable to save notes."));
    } finally {
      setSavingNotes(false);
    }
  };

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6">
      <Link to="/admin/recruitment" className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
        <ArrowLeftOutlined /> All job openings
      </Link>

      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-slate-900">{job?.title || "Applicants"}</h1>
        {job && (
          <p className="mt-1 text-sm text-slate-500">
            {[job.department, job.location, EMPLOYMENT_TYPE_LABELS[job.employment_type], JOB_STATUS_LABELS[job.status]]
              .filter(Boolean)
              .join(" · ")}
            {job.closing_date ? ` · Closes ${formatDate(job.closing_date)}` : ""}
          </p>
        )}
      </div>

      {error && (
        <Banner tone="error" onClose={() => setError("")}>
          {error}
        </Banner>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center">
          <select
            aria-label="Stage"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            className="h-10 rounded-lg border border-slate-300 bg-white px-2 text-sm"
          >
            <option value="">All stages</option>
            {STAGES.map((stage) => (
              <option key={stage} value={stage}>
                {APPLICANT_STATUS_LABELS[stage]}
              </option>
            ))}
          </select>
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search name, email or phone"
            className="h-10 rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100 sm:w-80"
          />
        </div>

        <div className="p-3 sm:p-4">
          {loading ? (
            <div className="py-10 text-center text-slate-500">Loading applicants...</div>
          ) : records.length === 0 ? (
            <EmptyState>
              {status || search ? "No applicants match these filters." : "No one has applied for this job yet."}
            </EmptyState>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-3 py-3">Applicant</th>
                    <th className="px-3 py-3">Applied</th>
                    <th className="px-3 py-3">CV</th>
                    <th className="px-3 py-3">Stage</th>
                    <th className="px-3 py-3 text-right">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((applicant) => (
                    <tr key={applicant.id} className="border-b border-slate-100 align-top last:border-0">
                      <td className="px-3 py-4">
                        <div className="font-medium text-slate-900">{applicant.full_name}</div>
                        <div className="text-xs text-slate-500">{applicant.email}</div>
                        {applicant.phone && <div className="text-xs text-slate-500">{applicant.phone}</div>}
                      </td>
                      <td className="px-3 py-4 text-slate-700">{formatDateTime(applicant.created_at)}</td>
                      <td className="px-3 py-4">
                        <a
                          href={applicant.cv_url}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="font-medium text-blue-800 hover:underline"
                        >
                          Open CV ↗
                        </a>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-2">
                          <select
                            aria-label={`Stage for ${applicant.full_name}`}
                            value={applicant.status}
                            disabled={busyId === applicant.id}
                            onChange={(event) => changeStage(applicant, event.target.value as ApplicantStatus)}
                            className={`h-9 rounded-full border-0 px-3 text-xs font-medium ${APPLICANT_STATUS_CLASSES[applicant.status]}`}
                          >
                            {STAGES.map((stage) => (
                              <option key={stage} value={stage}>
                                {APPLICANT_STATUS_LABELS[stage]}
                              </option>
                            ))}
                          </select>
                          {busyId === applicant.id && <LoadingOutlined />}
                        </div>
                      </td>
                      <td className="px-3 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => openApplicant(applicant)}
                          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                          {applicant.notes ? "View & notes" : "View"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Pager page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </section>

      <Modal
        zIndex={appZIndex.modal}
        open={Boolean(viewing)}
        title={viewing?.full_name}
        onCancel={() => !savingNotes && setViewing(null)}
        footer={null}
        destroyOnClose
        centered
        width={640}
      >
        {viewing && (
          <div className="space-y-4">
            <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-slate-500">Email</dt>
                <dd>
                  <a href={`mailto:${viewing.email}`} className="text-blue-800 hover:underline">
                    {viewing.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Phone</dt>
                <dd>{viewing.phone || "-"}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Applied</dt>
                <dd>{formatDateTime(viewing.created_at)}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">CV</dt>
                <dd>
                  <a href={viewing.cv_url} target="_blank" rel="noopener noreferrer nofollow" className="break-all text-blue-800 hover:underline">
                    {viewing.cv_url}
                  </a>
                </dd>
              </div>
            </dl>

            <div>
              <h3 className="text-xs text-slate-500">Cover letter</h3>
              <p className="mt-1 whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                {viewing.cover_letter || "No cover letter provided."}
              </p>
            </div>

            <label className="block text-sm font-medium text-slate-700">
              HR notes (only visible to Admin and HR)
              <textarea rows={4} value={notes} onChange={(event) => setNotes(event.target.value)} className={textareaClass} />
            </label>

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={() => setViewing(null)}
                disabled={savingNotes}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                Close
              </button>
              <button
                type="button"
                onClick={saveNotes}
                disabled={savingNotes}
                className="inline-flex items-center gap-2 rounded-lg bg-red-800 px-4 py-2 text-sm font-medium text-white hover:bg-red-900 disabled:opacity-60"
              >
                {savingNotes && <LoadingOutlined />}
                Save notes
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
