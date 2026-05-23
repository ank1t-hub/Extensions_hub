import useAuth from "../../hooks/useAuth.js";

export default function DeveloperDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold tracking-tight">Developer dashboard</h1>
      <p className="text-muted">
        Welcome, {user?.username}. Extension upload and management — Phase 6.
      </p>
    </div>
  );
}
