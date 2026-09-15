import "../../App.css";
import { Routes, Route } from "react-router-dom";
import Nopage from "../Nopage/Nopage";
import AdminLayout from "./AdminLayout/AdminLayout";
import AdminHome from "./AdminHome/AdminHome";
import AdminLogout from "./AdminLogout/AdminLogout";
import AdminUsers from "./AdminUsers/AdminUsers";
import AdminsPage from "./AdminsPage/AdminsPage";
import AdminSettingsPage from "./AdminSettingsPage/AdminSettingsPage";
import { AdminUserDetailsPage } from "./AdminUsers/AdminUserDetails";
import RoomMaintenance from "./RoomMaintenance/RoomMaintenance";
import StaffLogin from "./StaffLogin/StaffLogin";
import ScrollToTop from "../../utils/scrollToTop";

const AdminPagesRoutes = () => {
  const scrollToTop = ScrollToTop();
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminHome />} />
        <Route path="/users" element={<AdminUsers />} />
        <Route path="/users/:id" element={<AdminUserDetailsPage />} />
       
        <Route path="/admins" element={<AdminsPage />} />
        <Route path="/settings" element={<AdminSettingsPage />} />
        <Route path="/room-maintenance" element={<RoomMaintenance />} />
        <Route path="/staff-login" element={<StaffLogin />} />
        <Route path="/logout" element={<AdminLogout />} />
        <Route path="*" element={<Nopage />} />
      </Route>
    </Routes>
  );
};

export default AdminPagesRoutes;
