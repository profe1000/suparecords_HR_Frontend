import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOpenJobs } from "../../apiservice/recruitment-service";
import {
  apiErrorMessage,
  Banner,
  EmptyState,
  formatDate,
  Pager,
} from "../../components/admincomponents/Approvals/ApprovalShared";
import {
  EMPLOYMENT_TYPE_LABELS,
  PublicJobOpening,
} from "../../components/admincomponents/Recruitment/recruitment.types";
import BranchFilter from "../../components/Sharedcomponents/BranchFilter/BranchFilter";
import CareersLayout, { useCareersContext } from "./CareersLayout";

export default function CareersPage() {
  const { businessId = "" } = useParams<{ businessId: string }>();
  const { context, notFound } = useCareersContext(businessId);
  const [jobs, setJobs] = useState<PublicJobOpening[]>([]);
  const [branchId, setBranchId] = useState<number | "">("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    getOpenJobs(businessId, { branch_id: branchId || undefined, search: search.trim(), page, perPage: 20 })
      .then((response) => {
        setJobs(response.data || []);
        setTotalPages(response.meta?.totalPages || 0);
      })
      .catch((requestError) => setError(apiErrorMessage(requestError, "Unable to load job openings.")))
      .finally(() => setLoading(false));
  }, [businessId, branchId, search, page]);

  const hasBranches = (context?.branches.length || 0) > 1;
  const branchName = (id: number | null) =>
    id ? context?.branches.find((branch) => branch.id === id)?.branch_name : "All branches";

  if (notFound) {
    return (
      <CareersLayout businessId={businessId}>
        <EmptyState>This careers page doesn't exist. Please check the link you were given.</EmptyState>
      </CareersLayout>
    );
  }

  return (
    <CareersLayout businessId={businessId} businessName={context?.business.business_name}>
      <h1 className="text-3xl font-semibold text-slate-900">
        Join {context?.business.business_name || "our team"}
      </h1>
      <p className="mt-2 text-slate-600">Browse our open positions and apply online.</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <BranchFilter
          branches={context?.branches}
          value={branchId}
          onChange={(value) => {
            setBranchId(value);
            setPage(1);
          }}
          className="h-11"
        />
        <input
          type="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search by title, department or location"
          aria-label="Search jobs"
          className="h-11 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-red-700 focus:ring-2 focus:ring-red-100"
        />
      </div>

      <div className="mt-6">
        {error && <Banner tone="error">{error}</Banner>}
        {loading ? (
          <div className="py-12 text-center text-slate-500">Loading positions...</div>
        ) : jobs.length === 0 ? (
          <EmptyState>
            {search || branchId
              ? "No positions match your filters."
              : "There are no open positions right now. Please check back later."}
          </EmptyState>
        ) : (
          <ul className="grid gap-3">
            {jobs.map((job) => (
              <li key={job.id}>
                <Link
                  to={`/careers/${businessId}/jobs/${job.id}`}
                  className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-red-300 hover:shadow"
                >
                  <h2 className="text-lg font-semibold text-slate-900">{job.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {[
                      hasBranches ? branchName(job.branch_id) : null,
                      job.department,
                      job.location,
                      EMPLOYMENT_TYPE_LABELS[job.employment_type],
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Posted {formatDate(job.created_at)}
                    {job.closing_date ? ` · Apply by ${formatDate(job.closing_date)}` : ""}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Pager page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </CareersLayout>
  );
}
