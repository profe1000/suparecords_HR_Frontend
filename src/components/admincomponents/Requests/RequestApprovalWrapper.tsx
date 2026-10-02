import { useEffect, useState } from "react";
import { approveRequest, getRequests, rejectRequest } from "../../../apiservice/request-service";
import useBusinessContext from "../../../hooks/useBusinessContext";
import BranchFilter from "../../Sharedcomponents/BranchFilter/BranchFilter";
import {
  apiErrorMessage,
  Banner,
  EmptyState,
  formatAmount,
  formatDateTime,
  NoAccess,
  Pager,
  ReviewAction,
  ReviewModal,
  staffName,
  StatusBadge,
  StatusFilter,
} from "../Approvals/ApprovalShared";
import { REQUEST_TYPE_LABELS, StaffRequest } from "../Approvals/approvals.types";

const PER_PAGE = 20;

export default function RequestApprovalWrapper() {
  const business = useBusinessContext();
  const [branchFilter, setBranchFilter] = useState<number | "">("");
  const [records, setRecords] = useState<StaffRequest[]>([]);
  const [status, setStatus] = useState("PENDING");
  const [requestType, setRequestType] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [reviewing, setReviewing] = useState<StaffRequest | null>(null);
  const [action, setAction] = useState<ReviewAction | null>(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getRequests({
        status,
        request_type: requestType,
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
      else setError(apiErrorMessage(requestError, "Unable to load requests."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, requestType, search, page, branchFilter]);

  const closeReview = () => {
    setReviewing(null);
    setAction(null);
  };

  const confirmReview = async (comment: string) => {
    if (!reviewing || !action) return;
    if (action === "approve") await approveRequest(reviewing.id, comment);
    else await rejectRequest(reviewing.id, comment);
    setMessage(`"${reviewing.title}" was ${action === "approve" ? "approved" : "rejected"}.`);
    closeReview();
    await load();
  };

  if (forbidden) {
    return (
      <div className="min-h-full bg-slate-50 p-4 sm:p-6">
        <h1 className="mb-5 text-2xl font-semibold text-slate-900">Request Approval</h1>
        <NoAccess what="requests" />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-slate-900">Request Approval</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">
          Review requests submitted by staff.
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
          <div className="flex flex-col gap-2 sm:flex-row">
            <select
              aria-label="Request type"
              value={requestType}
              onChange={(event) => {
                setRequestType(event.target.value);
                setPage(1);
              }}
              className="h-10 rounded-lg border border-slate-300 bg-white px-2 text-sm"
            >
              <option value="">All types</option>
              {Object.entries(REQUEST_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
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
              placeholder="Search staff or title"
              className="h-10 rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100"
            />
          </div>
        </div>

        <div className="p-3 sm:p-4">
          {error && <Banner tone="error">{error}</Banner>}
          {loading ? (
            <div className="py-10 text-center text-slate-500">Loading requests...</div>
          ) : records.length === 0 ? (
            <EmptyState>
              {status === "PENDING" ? "No requests are waiting for review." : "No requests found."}
            </EmptyState>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-3 py-3">Staff</th>
                    <th className="px-3 py-3">Request</th>
                    <th className="px-3 py-3 text-right">Amount</th>
                    <th className="px-3 py-3">Submitted</th>
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
                        <div className="text-xs uppercase tracking-wide text-slate-500">
                          {REQUEST_TYPE_LABELS[record.request_type] || record.request_type}
                        </div>
                        <div className="font-medium text-slate-900">{record.title}</div>
                        {record.description && (
                          <div className="mt-1 max-w-sm text-xs text-slate-500">{record.description}</div>
                        )}
                      </td>
                      <td className="px-3 py-4 text-right tabular-nums text-slate-900">
                        {formatAmount(record.amount)}
                      </td>
                      <td className="px-3 py-4 text-slate-700">{formatDateTime(record.created_at)}</td>
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
                              onClick={() => {
                                setReviewing(record);
                                setAction("approve");
                              }}
                              className="rounded-lg border border-emerald-700 px-3 py-1.5 text-sm font-medium text-emerald-800 transition hover:bg-emerald-50"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setReviewing(record);
                                setAction("reject");
                              }}
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
        title={action === "reject" ? "Reject request" : "Approve request"}
        onCancel={closeReview}
        onConfirm={confirmReview}
        summary={
          reviewing && (
            <>
              <p>
                <strong>{staffName(reviewing.staff)}</strong> ·{" "}
                {REQUEST_TYPE_LABELS[reviewing.request_type] || reviewing.request_type}
              </p>
              <p className="mt-1 font-medium">{reviewing.title}</p>
              {reviewing.amount && <p className="mt-1">Amount: {formatAmount(reviewing.amount)}</p>}
            </>
          )
        }
      />
    </div>
  );
}
