import { LoadingOutlined } from "@ant-design/icons";
import { Navigate } from "react-router-dom";
import useStaffPermissions from "../../hooks/useStaffPermissions";

/**
 * Pages only Super Admin, General Admin and HR Manager can open; other staff go to Tasks.
 * With `adminOnly`, HR Manager is excluded too (business-wide settings such as branches).
 */
export const STAFF_HOME = "/admin/tasks";

export default function ManagerRoute({ children, adminOnly = false }: { children: JSX.Element; adminOnly?: boolean }) {
  const { permissions, loading } = useStaffPermissions();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-2xl text-slate-400">
        <LoadingOutlined />
      </div>
    );
  }
  if (!permissions?.is_manager) {
    return <Navigate to={STAFF_HOME} replace />;
  }
  if (adminOnly && !permissions.can_filter_branches) {
    return <Navigate to="/admin" replace />;
  }
  return children;
}
