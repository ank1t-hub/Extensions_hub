import useAuth from "../../hooks/useAuth.js";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold tracking-tight">Admin dashboard</h1>
      <p className="text-muted">
        Welcome, {user?.username}. User management and moderation — Phase 7.
      </p>
    </div>
  );
}
