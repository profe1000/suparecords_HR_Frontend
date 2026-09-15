import { ArrowLeftOutlined, MailOutlined, PhoneOutlined, TeamOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getStaff, getStaffRole } from "../../../apiservice/staff-service";
import {
  StaffRecord,
  StaffRole,
} from "../../../components/admincomponents/StaffLogin/staffLogin.types";

const statusClass = (status: StaffRecord["status"]) => {
  if (status === "ACTIVE") return "bg-emerald-100 text-emerald-700";
  if (status === "SUSPENDED") return "bg-amber-100 text-amber-700";
  return "bg-rose-100 text-rose-700";
};

export default function StaffDetails() {
  const { id } = useParams<{ id: string }>();
  const [staff, setStaff] = useState<StaffRecord | null>(null);
  const [role, setRole] = useState<StaffRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStaff = async () => {
      if (!id) {
        setError("Staff ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const staffRecord = await getStaff(id);
        setStaff(staffRecord);
        if (staffRecord.staff_role_id) {
          getStaffRole(staffRecord.staff_role_id)
            .then(setRole)
            .catch(() => setRole(null));
        }
      } catch (requestError: any) {
        setError(requestError?.response?.data?.message || "Unable to load staff details.");
      } finally {
        setLoading(false);
      }
    };

    loadStaff();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center bg-slate-50">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !staff) {
    return (
      <div className="min-h-full bg-slate-50 p-4 sm:p-6">
        <Link to="/admin/staff-login" className="inline-flex items-center gap-2 text-sm font-medium text-red-800">
          <ArrowLeftOutlined /> Back to staff
        </Link>
        <div role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error || "Staff record not found."}
        </div>
      </div>
    );
  }

  const initials = `${staff.first_name.charAt(0)}${staff.last_name.charAt(0)}`.toUpperCase();

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6">
      <Link to="/admin/staff-login" className="inline-flex items-center gap-2 text-sm font-medium text-red-800 hover:text-red-950">
        <ArrowLeftOutlined /> Back to staff
      </Link>

      <section className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-red-800 text-xl font-semibold text-white">
                {initials}
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">
                  {staff.first_name} {staff.last_name}
                </h1>
                <p className="mt-1 text-sm text-slate-500">{role?.title || "Staff member"}</p>
              </div>
            </div>
            <span className={`inline-flex self-start rounded-full px-3 py-1.5 text-xs font-semibold ${statusClass(staff.status)}`}>
              {staff.status}
            </span>
          </div>
        </div>

        <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-7">
          <div>
            <p className="text-xs font-medium uppercase text-slate-500">Email</p>
            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-900">
              <MailOutlined className="text-slate-400" /> {staff.email}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-slate-500">Phone</p>
            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-900">
              <PhoneOutlined className="text-slate-400" /> {staff.phone || "Not provided"}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-slate-500">Department</p>
            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-900">
              <TeamOutlined className="text-slate-400" /> {staff.department || "Not assigned"}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-slate-500">Role</p>
            <p className="mt-2 text-sm font-medium text-slate-900">{role?.title || staff.staff_role_id}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-slate-500">Branch ID</p>
            <p className="mt-2 text-sm font-medium text-slate-900">{staff.branch_id}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-slate-500">Joined</p>
            <p className="mt-2 text-sm font-medium text-slate-900">
              {new Date(staff.created_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}