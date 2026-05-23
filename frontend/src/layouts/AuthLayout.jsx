import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import Loader from "../components/common/Loader.jsx";

export default function AuthLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loader />;
  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="mx-auto w-full max-w-md space-y-8 py-8">
      <Outlet />
    </div>
  );
}
