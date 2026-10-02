import { ArrowLeftOutlined, CheckCircleFilled, LoadingOutlined } from "@ant-design/icons";
import { FormEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { applyForJob, getOpenJob } from "../../apiservice/recruitment-service";
import {
  apiErrorMessage,
  Banner,
  EmptyState,
  formatDate,
  inputClass,
  textareaClass,
} from "../../components/admincomponents/Approvals/ApprovalShared";
import {
  EMPLOYMENT_TYPE_LABELS,
  JobApplicationFormValues,
  PublicJobOpening,
} from "../../components/admincomponents/Recruitment/recruitment.types";
import CareersLayout, { useCareersContext } from "./CareersLayout";

const emptyForm: JobApplicationFormValues = {
  full_name: "",
  email: "",
  phone: "",
  cv_url: "",
  cover_letter: "",
};

export default function CareerJobPage() {
  const { businessId = "", jobId = "" } = useParams<{ businessId: string; jobId: string }>();
  const { context } = useCareersContext(businessId);
  const [job, setJob] = useState<PublicJobOpening | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setLoading(true);
    getOpenJob(businessId, jobId)
      .then(setJob)
      .catch((requestError) => setLoadError(apiErrorMessage(requestError, "This job could not be found.")))
      .finally(() => setLoading(false));
  }, [businessId, jobId]);

  const update = (key: keyof JobApplicationFormValues, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await applyForJob(businessId, jobId, form);
      setSubmitted(true);
    } catch (requestError) {
      setError(apiErrorMessage(requestError, "Unable to submit your application. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CareersLayout businessId={businessId} businessName={context?.business.business_name}>
      <Link to={`/careers/${businessId}`} className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
        <ArrowLeftOutlined /> All positions
      </Link>

      {loading ? (
        <div className="py-12 text-center text-slate-500">Loading...</div>
      ) : !job ? (
        <EmptyState>{loadError || "This job could not be found."}</EmptyState>
      ) : (
        <>
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-slate-900">{job.title}</h1>
            <p className="mt-2 text-sm text-slate-600">
              {[
                (context?.branches.length || 0) > 1
                  ? job.branch_id
                    ? context?.branches.find((branch) => branch.id === job.branch_id)?.branch_name
                    : "All branches"
                  : null,
                job.department,
                job.location,
                EMPLOYMENT_TYPE_LABELS[job.employment_type],
                job.salary_range,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
            {job.closing_date && (
              <p className="mt-1 text-sm text-slate-500">Apply by {formatDate(job.closing_date)}</p>
            )}

            <h2 className="mt-6 font-semibold text-slate-900">About the role</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{job.description}</p>

            {job.requirements && (
              <>
                <h2 className="mt-6 font-semibold text-slate-900">Requirements</h2>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{job.requirements}</p>
              </>
            )}
          </article>

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {submitted ? (
              <div className="py-6 text-center">
                <CheckCircleFilled className="text-4xl text-emerald-600" />
                <h2 className="mt-3 text-xl font-semibold text-slate-900">Application received</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Thank you for applying for {job.title}
                  {context ? ` at ${context.business.business_name}` : ""}. Our HR team will contact you at {form.email} if you're shortlisted.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-slate-900">Apply for this position</h2>
                <form onSubmit={submit} className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Full name <span className="text-red-600">*</span>
                      <input
                        required
                        minLength={2}
                        autoComplete="name"
                        value={form.full_name}
                        onChange={(event) => update("full_name", event.target.value)}
                        className={inputClass}
                      />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                      Email <span className="text-red-600">*</span>
                      <input
                        required
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={(event) => update("email", event.target.value)}
                        className={inputClass}
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Phone
                      <input
                        type="tel"
                        autoComplete="tel"
                        value={form.phone}
                        onChange={(event) => update("phone", event.target.value)}
                        className={inputClass}
                      />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                      Link to your CV <span className="text-red-600">*</span>
                      <input
                        required
                        type="url"
                        placeholder="https://"
                        value={form.cv_url}
                        onChange={(event) => update("cv_url", event.target.value)}
                        className={inputClass}
                      />
                      <span className="mt-1 block text-xs font-normal text-slate-500">
                        e.g. a Google Drive or Dropbox link set to "anyone with the link can view", or your LinkedIn profile.
                      </span>
                    </label>
                  </div>

                  <label className="block text-sm font-medium text-slate-700">
                    Cover letter
                    <textarea
                      rows={6}
                      maxLength={5000}
                      value={form.cover_letter}
                      onChange={(event) => update("cover_letter", event.target.value)}
                      className={textareaClass}
                    />
                  </label>

                  {error && <Banner tone="error">{error}</Banner>}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-lg bg-red-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-900 disabled:opacity-60"
                  >
                    {submitting && <LoadingOutlined />}
                    Submit Application
                  </button>
                </form>
              </>
            )}
          </section>
        </>
      )}
    </CareersLayout>
  );
}
