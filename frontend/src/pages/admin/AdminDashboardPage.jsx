import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchUsers } from "../../services/adminService.js";
import { listExtensions } from "../../services/extensionService.js";
import Card from "../../components/common/Card.jsx";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDevs: 0,
    totalExtensions: 0,
    totalDownloads: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const [users, extData] = await Promise.all([
          fetchUsers(),
          listExtensions({ limit: 100 }), // Query extensions list
        ]);

        const developers = users.filter((u) => u.role === "developer" || u.role === "admin");
        const totalDls = (extData.items || []).reduce((sum, ext) => sum + (ext.download_count || 0), 0);

        setStats({
          totalUsers: users.length,
          totalDevs: developers.length,
          totalExtensions: extData.total || 0,
          totalDownloads: totalDls,
        });
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-muted">
        <div className="w-8 h-8 rounded-full border-2 border-t-black dark:border-t-white border-zinc-200 dark:border-zinc-800 animate-spin" />
        <span className="text-sm font-medium">Loading admin panel...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-zinc-50">
          Admin Dashboard
        </h1>
        <p className="text-xs text-muted mt-1">
          System overview, users directory profiles, and developer uploads moderation.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
        <Card className="flex flex-col gap-1.5">
          <span className="text-muted font-medium">Total Registered Users</span>
          <span className="text-2xl font-black text-neutral-900 dark:text-zinc-50">{stats.totalUsers}</span>
        </Card>
        <Card className="flex flex-col gap-1.5">
          <span className="text-muted font-medium">Authorized Developers</span>
          <span className="text-2xl font-black text-neutral-900 dark:text-zinc-50">{stats.totalDevs}</span>
        </Card>
        <Card className="flex flex-col gap-1.5">
          <span className="text-muted font-medium">Listed Extensions</span>
          <span className="text-2xl font-black text-neutral-900 dark:text-zinc-50">{stats.totalExtensions}</span>
        </Card>
        <Card className="flex flex-col gap-1.5">
          <span className="text-muted font-medium">Marketplace Downloads</span>
          <span className="text-2xl font-black text-neutral-900 dark:text-zinc-50">{stats.totalDownloads.toLocaleString()}</span>
        </Card>
      </div>

      {/* Navigation Quick Links Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-zinc-50">Administrative Control Centers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Link 1: Manage Users */}
          <Link to="/admin/users" className="no-underline group">
            <Card hoverable className="h-full flex flex-col justify-between gap-4">
              <div>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-white transition-colors">
                  Users Directory Manager
                </h3>
                <p className="text-xs text-muted leading-relaxed mt-1">
                  List all registered users, adjust developer authorization levels, and suspend or restore developer account access instantly.
                </p>
              </div>
              <div className="text-xs font-semibold text-black dark:text-white flex items-center gap-1">
                <span>Manage Users</span>
                <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Card>
          </Link>

          {/* Link 2: Moderation */}
          <Link to="/admin/moderation" className="no-underline group">
            <Card hoverable className="h-full flex flex-col justify-between gap-4">
              <div>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-white transition-colors">
                  Moderation Hub
                </h3>
                <p className="text-xs text-muted leading-relaxed mt-1">
                  Audit all published extension packages, verify latest downloads, and immediately take down malicious or policy-violating items.
                </p>
              </div>
              <div className="text-xs font-semibold text-black dark:text-white flex items-center gap-1">
                <span>Moderate Content</span>
                <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Card>
          </Link>

        </div>
      </div>

    </div>
  );
}
