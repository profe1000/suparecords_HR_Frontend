import {
  ArrowLeftOutlined,
  ClockCircleOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";

const featureTitles: Record<string, string> = {
  "leave-applications": "Leave Applications",
  "leave-approval": "Leave Approval",
  "request-approval": "Request Approval",
  "request-submission": "Request Submission",
  "payroll-management": "Payroll Management",
};

const ComingSoon = () => {
  const { feature = "" } = useParams<{ feature: string }>();
  const featureTitle = featureTitles[feature] || "This Feature";

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <section className="w-full max-w-2xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="h-2 bg-red-800" />
        <div className="px-6 py-12 text-center sm:px-12 sm:py-16">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl text-red-800">
            <RocketOutlined />
          </div>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-800">
            <ClockCircleOutlined />
            In development
          </div>

          <h1 className="mt-5 text-2xl font-semibold text-slate-900 sm:text-3xl">
            {featureTitle} is coming soon
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600 sm:text-base">
            We are preparing this workspace for your team. It will be available in a future update.
          </p>

          <Link
            to="/admin"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-red-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-900"
          >
            <ArrowLeftOutlined />
            Back to Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
};

export default ComingSoon;