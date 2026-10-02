import {
  CalendarOutlined,
  FormOutlined,
  ReloadOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyDashboard, StaffDashboardData } from "../../../apiservice/leave-service";
import { useAppSelector } from "../../../Redux/reduxCustomHook";
import type { RootState } from "../../../Redux/store";
import { apiErrorMessage, Banner, formatDate } from "../Approvals/ApprovalShared";
import { LEAVE_TYPE_LABELS } from "../Approvals/approvals.types";

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const Card = ({
  title,
  icon,
  link,
  linkLabel,
  children,
}: {
  title: string;
  icon: ReactNode;
  link: string;
  linkLabel: string;
  children: ReactNode;
}) => (
  <section className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-4 flex items-center gap-2 text-slate-900">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-800">{icon}</span>
      <h2 className="font-semibold">{title}</h2>
    </div>
    <div className="flex-1">{children}</div>
    <Link to={link} className="mt-4 text-sm font-medium text-red-800 hover:text-red-900">
      {linkLabel} →
    </Link>
  </section>
);

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-xl bg-slate-50 p-3">
    <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
    <dd className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">{value}</dd>
  </div>
);

export default function StaffDashboardWrapper() {
  const staff = useAppSelector((state: RootState) => state.AdminAuthData?.staff);
  const [data, setData] = useState<StaffDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setData(await getMyDashboard());
    } catch (requestError) {
      setError(apiErrorMessage(requestError, "Unable to load your dashboard."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const balance = data?.leaveBalance;

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6">
      <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {greeting()}
            {staff?.first_name ? `, ${staff.first_name}` : ""}
          </h1>
          <p className="mt-1 text-sm text-slate-500">Here's a summary of your leave, requests and tasks.</p>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          <ReloadOutlined spin={loading} /> Refresh
        </button>
      </div>

      {error && <Banner tone="error">{error}</Banner>}

      {loading && !data ? (
        <div className="py-16 text-center text-slate-500">Loading your dashboard...</div>
      ) : data && balance ? (
        <div className="grid gap-5 lg:grid-cols-3">
          <Card title={`Leave in ${balance.year}`} icon={<CalendarOutlined />} link="/admin/leave-applications" linkLabel="Apply for leave">
            <p className="text-4xl font-semibold tabular-nums text-slate-900">
              {balance.remaining_days}
              <span className="ml-2 text-base font-normal text-slate-500">of {balance.total_days} days left</span>
            </p>
            <div
              className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
              aria-label="Leave used"
              aria-valuemin={0}
              aria-valuemax={balance.total_days}
              aria-valuenow={balance.used_days}
            >
              <div
                className="h-full rounded-full bg-red-800"
                style={{ width: `${balance.total_days ? Math.min(100, (balance.used_days / balance.total_days) * 100) : 0}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-slate-600">
              {balance.used_days} used · {data.pendingLeaveCount} application{data.pendingLeaveCount === 1 ? "" : "s"} awaiting approval
            </p>
            {balance.total_days === 0 && (
              <p className="mt-2 text-sm text-amber-700">No allowance set for this year yet. Ask HR.</p>
            )}
            <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
              {data.nextLeave ? (
                <>
                  <span className="font-medium">Next leave:</span>{" "}
                  {LEAVE_TYPE_LABELS[data.nextLeave.leave_type] || data.nextLeave.leave_type},{" "}
                  {formatDate(data.nextLeave.start_date)} – {formatDate(data.nextLeave.end_date)}
                </>
              ) : (
                "No upcoming approved leave."
              )}
            </div>
          </Card>

          <Card title="Requests" icon={<FormOutlined />} link="/admin/request-submission" linkLabel="Make a request">
            <dl className="grid grid-cols-3 gap-2">
              <Stat label="Pending" value={data.requests.pending} />
              <Stat label="Approved" value={data.requests.approved} />
              <Stat label="Rejected" value={data.requests.rejected} />
            </dl>
          </Card>

          <Card title="Your open tasks" icon={<ToolOutlined />} link="/admin/tasks" linkLabel="View tasks">
            {data.openTasks.length === 0 ? (
              <p className="text-sm text-slate-500">You have no open tasks.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {data.openTasks.map((task) => (
                  <li key={task.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                    <span className="truncate font-medium text-slate-800">{task.title}</span>
                    <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                      {task.status.replace(/_/g, " ").toLowerCase()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {data.openTasksCount > data.openTasks.length && (
              <p className="mt-2 text-xs text-slate-500">
                Showing {data.openTasks.length} of {data.openTasksCount} open tasks.
              </p>
            )}
          </Card>
        </div>
      ) : null}
    </div>
  );
}
