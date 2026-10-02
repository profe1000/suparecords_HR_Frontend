import "../../App.css";
import { Routes, Route } from "react-router-dom";
import Nopage from "../Nopage/Nopage";
import AdminLayout from "./AdminLayout/AdminLayout";
import DashboardHome from "./AdminHome/DashboardHome";
import AdminLogout from "./AdminLogout/AdminLogout";
import AdminSettingsPage from "./AdminSettingsPage/AdminSettingsPage";
import Tasks from "./RoomMaintenance/RoomMaintenance";
import StaffLogin from "./StaffLogin/StaffLogin";
import StaffDetails from "./StaffLogin/StaffDetails";
import StaffOnboarding from "./StaffLogin/StaffOnboarding";
import ComingSoon from "./ComingSoon/ComingSoon";
import LeaveApplications from "./Leave/LeaveApplications";
import LeaveApproval from "./Leave/LeaveApproval";
import RequestSubmission from "./Requests/RequestSubmission";
import RequestApproval from "./Requests/RequestApproval";
import ScrollToTop from "../../utils/scrollToTop";
import ManagerRoute from "../ProtectedRoute/ManagerRoute";
import Recruitment from "./Recruitment/Recruitment";
import Branches from "./Branches/Branches";
import JobApplicants from "./Recruitment/JobApplicants";

const AdminPagesRoutes = () => {
  const scrollToTop = ScrollToTop();
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        {/* Available to every staff member (dashboard and settings adapt to the role) */}
        <Route index element={<DashboardHome />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/leave-applications" element={<LeaveApplications />} />
        <Route path="/request-submission" element={<RequestSubmission />} />
        <Route path="/settings" element={<AdminSettingsPage />} />

        {/* Super Admin, General Admin and HR Manager only */}
        <Route path="/branches" element={<ManagerRoute adminOnly><Branches /></ManagerRoute>} />
        <Route path="/recruitment" element={<ManagerRoute><Recruitment /></ManagerRoute>} />
        <Route path="/recruitment/:id" element={<ManagerRoute><JobApplicants /></ManagerRoute>} />
        <Route path="/staff-login" element={<ManagerRoute><StaffLogin /></ManagerRoute>} />
        <Route path="/staff-login/:id" element={<ManagerRoute><StaffDetails /></ManagerRoute>} />
        <Route path="/staff-login/:id/onboarding" element={<ManagerRoute><StaffOnboarding /></ManagerRoute>} />
        <Route path="/leave-approval" element={<ManagerRoute><LeaveApproval /></ManagerRoute>} />
        <Route path="/request-approval" element={<ManagerRoute><RequestApproval /></ManagerRoute>} />
        <Route path="/coming-soon/:feature" element={<ManagerRoute><ComingSoon /></ManagerRoute>} />
        <Route path="/logout" element={<AdminLogout />} />
        <Route path="*" element={<Nopage />} />
      </Route>
    </Routes>
  );
};

export default AdminPagesRoutes;
