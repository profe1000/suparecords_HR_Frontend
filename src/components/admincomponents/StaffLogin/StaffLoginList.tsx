import { StaffRecord, StaffRole } from "./staffLogin.types";
import { Link } from "react-router-dom";

type Props = {
  records: StaffRecord[];
  roles: StaffRole[];
  loading?: boolean;
};

const badgeClass = (value: StaffRecord["status"]) => {
  if (value === "ACTIVE") return "bg-emerald-100 text-emerald-700";
  if (value === "SUSPENDED") return "bg-amber-100 text-amber-700";
  return "bg-rose-100 text-rose-700";
};

export default function StaffLoginList({ records, roles, loading }: Props) {
  const roleTitle = (roleId: string) =>
    roles.find((role) => role.id === roleId)?.title || "-";

  if (loading) {
    return <div className="py-10 text-center text-slate-500">Loading staff...</div>;
  }

  if (records.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-slate-500">
        No staff records yet.
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-3">Staff</th>
              <th className="px-3 py-3">Role</th>
              <th className="px-3 py-3">Contact</th>
              <th className="px-3 py-3">Department</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70">
                <td className="px-3 py-4 text-slate-700">
                  <div className="font-medium text-slate-900">
                    {record.first_name} {record.last_name}
                  </div>
                </td>
                <td className="px-3 py-4 text-slate-700">{roleTitle(record.staff_role_id)}</td>
                <td className="px-3 py-4 text-slate-700">
                  <div>{record.email}</div>
                  <div className="mt-1 text-xs text-slate-500">{record.phone || "-"}</div>
                </td>
                <td className="px-3 py-4 text-slate-700">{record.department || "-"}</td>
                <td className="px-3 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${badgeClass(record.status)}`}>
                    {record.status}
                  </span>
                </td>
                <td className="px-3 py-4 text-right">
                  <Link
                    to={`/admin/staff-login/${record.id}`}
                    className="inline-flex rounded-lg border border-red-700 px-3 py-2 text-sm font-medium text-red-800 transition hover:bg-red-50"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {records.map((record) => (
          <article key={record.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  {record.first_name} {record.last_name}
                </h3>
                <p className="mt-1 text-sm text-slate-500">{record.email}</p>
              </div>
              <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${badgeClass(record.status)}`}>
                {record.status}
              </span>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-slate-50 p-2">
                <dt className="text-xs text-slate-500">Role</dt>
                <dd className="mt-1 text-sm font-medium text-slate-800">{roleTitle(record.staff_role_id)}</dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <dt className="text-xs text-slate-500">Department</dt>
                <dd className="mt-1 text-sm font-medium text-slate-800">{record.department || "-"}</dd>
              </div>
            </dl>
            <Link
              to={`/admin/staff-login/${record.id}`}
              className="mt-4 inline-flex w-full justify-center rounded-lg border border-red-700 px-3 py-2 text-sm font-medium text-red-800 transition hover:bg-red-50"
            >
              View Details
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}

