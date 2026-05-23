import { Route, Routes } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout.jsx";
import HomePage from "../pages/HomePage.jsx";
import ExtensionsPage from "../pages/ExtensionsPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import SignupPage from "../pages/SignupPage.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="extensions" element={<ExtensionsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
      </Route>
    </Routes>
  );
}
