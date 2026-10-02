import { LoadingOutlined } from "@ant-design/icons";
import StaffDashboardWrapper from "../../../components/admincomponents/staffDashboard/StaffDashboardWrapper";
import useStaffPermissions from "../../../hooks/useStaffPermissions";
import AdminHome from "./AdminHome";

/** Admin/HR get the organisation dashboard; everyone else gets their personal summary. */
export default function DashboardHome() {
  const { permissions, loading } = useStaffPermissions();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-2xl text-slate-400">
        <LoadingOutlined />
      </div>
    );
  }
  return permissions?.is_manager ? <AdminHome /> : <StaffDashboardWrapper />;
}
