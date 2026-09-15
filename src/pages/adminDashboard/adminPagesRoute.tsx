import "../../App.css";
import { Routes, Route } from "react-router-dom";
import Nopage from "../Nopage/Nopage";
import AdminLayout from "./AdminLayout/AdminLayout";
import AdminHome from "./AdminHome/AdminHome";
import AdminLogout from "./AdminLogout/AdminLogout";
import AdminSettingsPage from "./AdminSettingsPage/AdminSettingsPage";
import Tasks from "./RoomMaintenance/RoomMaintenance";
import StaffLogin from "./StaffLogin/StaffLogin";
import StaffDetails from "./StaffLogin/StaffDetails";
import StaffOnboarding from "./StaffLogin/StaffOnboarding";
import ScrollToTop from "../../utils/scrollToTop";

const AdminPagesRoutes = () => {
  const scrollToTop = ScrollToTop();
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminHome />} />
        <Route path="/settings" element={<AdminSettingsPage />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/staff-login" element={<StaffLogin />} />
        <Route path="/staff-login/:id" element={<StaffDetails />} />
        <Route path="/staff-login/:id/onboarding" element={<StaffOnboarding />} />
        <Route path="/logout" element={<AdminLogout />} />
        <Route path="*" element={<Nopage />} />
      </Route>
    </Routes>
  );
};

export default AdminPagesRoutes;
