import { Route, Routes } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import HomePage from "../pages/HomePage.jsx";
import ExtensionsPage from "../pages/ExtensionsPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import SignupPage from "../pages/SignupPage.jsx";
import DeveloperDashboardPage from "../pages/developer/DeveloperDashboardPage.jsx";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage.jsx";
import { USER_ROLES } from "../utils/constants.js";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="extensions" element={<ExtensionsPage />} />

        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>
      </Route>

      <Route
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.DEVELOPER, USER_ROLES.ADMIN]} />
        }
      >
        <Route element={<DashboardLayout />}>
          <Route path="developer" element={<DeveloperDashboardPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="admin" element={<AdminDashboardPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
