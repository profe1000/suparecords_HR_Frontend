import { useEffect, useState } from "react";
import {
  approveLeaveApplication,
  getLeaveApplications,
  getStaffLeaveBalance,
  rejectLeaveApplication,
} from "../../../apiservice/leave-service";
import useBusinessContext from "../../../hooks/useBusinessContext";
import BranchFilter from "../../Sharedcomponents/BranchFilter/BranchFilter";
import {
  apiErrorMessage,
  Banner,
  EmptyState,
  formatDate,
  formatDateTime,
  NoAccess,
  Pager,
  ReviewAction,
  ReviewModal,
  staffName,
  StatusBadge,
  StatusFilter,
} from "../Approvals/ApprovalShared";
import { LEAVE_TYPE_LABELS, LeaveApplication, LeaveBalance } from "../Approvals/approvals.types";

const PER_PAGE = 20;

export default function LeaveApprovalWrapper() {
  const business = useBusinessContext();
  const [branchFilter, setBranchFilter] = useState<number | "">("");
  const [records, setRecords] = useState<LeaveApplication[]>([]);
  const [status, setStatus] = useState("PENDING");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [reviewing, setReviewing] = useState<LeaveApplication | null>(null);
  const [action, setAction] = useState<ReviewAction | null>(null);
  const [balance, setBalance] = useState<LeaveBalance | null>(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getLeaveApplications({
        status,
        branch_id: branchFilter || undefined,
        search: search.trim(),
        page,
        perPage: PER_PAGE,
        sort_order: status === "PENDING" ? "asc" : "desc",
      });
      setRecords(response.data || []);
      setTotalPages(response.meta?.totalPages || 0);
      setForbidden(false);
    } catch (requestError: any) {
      if (requestError?.response?.status === 403) setForbidden(true);
      else setError(apiErrorMessage(requestError, "Unable to load leave applications."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, search, page, branchFilter]);

  const openReview = (record: LeaveApplication, nextAction: ReviewAction) => {
    setReviewing(record);
    setAction(nextAction);
    setBalance(null);
    getStaffLeaveBalance(record.staff_id, Number(record.start_date.slice(0, 4)))
      .then(setBalance)
      .catch(() => setBalance(null));
  };

  const closeReview = () => {
    setReviewing(null);
    setAction(null);
  };

  const confirmReview = async (comment: string) => {
    if (!reviewing || !action) return;
    if (action === "approve") await approveLeaveApplication(reviewing.id, comment);
    else await rejectLeaveApplication(reviewing.id, comment);
    setMessage(
      `${staffName(reviewing.staff)}'s leave was ${action === "approve" ? "approved" : "rejected"}.`,
    );
    closeReview();
    await load();
  };

  if (forbidden) {
    return (
      <div className="min-h-full bg-slate-50 p-4 sm:p-6">
        <h1 className="mb-5 text-2xl font-semibold text-slate-900">Leave Approval</h1>
        <NoAccess what="leave" />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-slate-900">Leave Approval</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">
          Review staff leave applications. Approved days are deducted from the staff member's yearly allowance.
        </p>
      </div>

      {message && (
        <Banner tone="success" onClose={() => setMessage("")}>
          {message}
        </Banner>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-4 lg:flex-row lg:items-center">
          <StatusFilter
            value={status}
            onChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
          />
<BranchFilter
            business={business}
            value={branchFilter}
            onChange={(value) => {
              setBranchFilter(value);
              setPage(1);
            }}
          />
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search staff"
            className="h-10 rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100"
          />
        </div>

        <div className="p-3 sm:p-4">
          {error && <Banner tone="error">{error}</Banner>}
          {loading ? (
            <div className="py-10 text-center text-slate-500">Loading applications...</div>
          ) : records.length === 0 ? (
            <EmptyState>
              {status === "PENDING" ? "No leave applications are waiting for review." : "No leave applications found."}
            </EmptyState>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-3 py-3">Staff</th>
                    <th className="px-3 py-3">Leave</th>
                    <th className="px-3 py-3">Dates</th>
                    <th className="px-3 py-3 text-right">Days</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id} className="border-b border-slate-100 align-top last:border-0">
                      <td className="px-3 py-4">
                        <div className="font-medium text-slate-900">{staffName(record.staff)}</div>
                        <div className="text-xs text-slate-500">{record.staff.department || record.staff.email}</div>
                      </td>
                      <td className="px-3 py-4 text-slate-700">
                        <div>{LEAVE_TYPE_LABELS[record.leave_type] || record.leave_type}</div>
                        {record.reason && (
                          <div className="mt-1 max-w-xs text-xs text-slate-500">{record.reason}</div>
                        )}
                      </td>
                      <td className="px-3 py-4 text-slate-700">
                        {formatDate(record.start_date)} – {formatDate(record.end_date)}
                        <div className="text-xs text-slate-500">Applied {formatDateTime(record.created_at)}</div>
                      </td>
                      <td className="px-3 py-4 text-right tabular-nums text-slate-900">{record.days}</td>
                      <td className="px-3 py-4">
                        <StatusBadge status={record.status} />
                        {record.reviewer && (
                          <div className="mt-1 text-xs text-slate-500">
                            by {staffName(record.reviewer)}
                            {record.review_comment ? ` · “${record.review_comment}”` : ""}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-4 text-right">
                        {record.status === "PENDING" && (
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openReview(record, "approve")}
                              className="rounded-lg border border-emerald-700 px-3 py-1.5 text-sm font-medium text-emerald-800 transition hover:bg-emerald-50"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => openReview(record, "reject")}
                              className="rounded-lg border border-rose-500 px-3 py-1.5 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
                            >
                              Reject
                            </button>
                          </div>
                        )}
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

      <ReviewModal
        open={Boolean(reviewing)}
        action={action}
        title={action === "reject" ? "Reject leave application" : "Approve leave application"}
        onCancel={closeReview}
        onConfirm={confirmReview}
        summary={
          reviewing && (
            <>
              <p>
                <strong>{staffName(reviewing.staff)}</strong> ·{" "}
                {LEAVE_TYPE_LABELS[reviewing.leave_type] || reviewing.leave_type} leave
              </p>
              <p className="mt-1">
                {formatDate(reviewing.start_date)} – {formatDate(reviewing.end_date)} ({reviewing.days} day
                {reviewing.days === 1 ? "" : "s"})
              </p>
              <p className="mt-1 text-slate-500">
                {balance
                  ? `${balance.year} balance: ${balance.remaining_days} of ${balance.total_days} days remaining` +
                    (action === "approve"
                      ? ` → ${balance.remaining_days - reviewing.days} after approval`
                      : "")
                  : "Loading balance..."}
              </p>
            </>
          )
        }
      />
    </div>
  );
}
