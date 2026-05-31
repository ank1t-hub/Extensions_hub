import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listMyExtensions, deleteExtension } from "../../services/extensionService.js";
import useAuth from "../../hooks/useAuth.js";
import Badge from "../../components/common/Badge.jsx";
import Card from "../../components/common/Card.jsx";
import VersionManager from "../../components/extensions/VersionManager.jsx";

export default function DeveloperDashboardPage() {
  const { user } = useAuth();
  const [extensions, setExtensions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeVersionExtension, setActiveVersionExtension] = useState(null);

  const fetchExtensions = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await listMyExtensions();
      setExtensions(data || []);
    } catch (err) {
      setError(err.message || "Failed to load uploaded extensions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExtensions();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you absolutely sure you want to delete "${title}"? This will permanently erase all release versions and documents.`)) {
      return;
    }
    try {
      await deleteExtension(id);
      setExtensions((prev) => prev.filter((ext) => ext.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete extension.");
    }
  };

  const totalDownloads = extensions.reduce((sum, ext) => sum + (ext.download_count || 0), 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-muted">
        <div className="w-8 h-8 rounded-full border-2 border-t-black dark:border-t-white border-zinc-200 dark:border-zinc-800 animate-spin" />
        <span className="text-sm font-medium">Loading developer workspace...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-neutral-100 dark:border-zinc-900 pb-5 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-zinc-50">
            Developer Workspace
          </h1>
          <p className="text-xs text-muted mt-1">
            Welcome back, {user?.username}. Manage packages, release updates, and document guides.
          </p>
        </div>
        <Link
          to="/developer/upload"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black font-semibold text-xs shadow-sm transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Upload Extension</span>
        </Link>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg text-red-600 dark:text-red-400 text-xs">
          {error}
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        <Card className="flex flex-col gap-1.5">
          <span className="text-muted font-medium">Active Extensions</span>
          <span className="text-2xl font-black text-neutral-900 dark:text-zinc-50">{extensions.length}</span>
        </Card>
        <Card className="flex flex-col gap-1.5">
          <span className="text-muted font-medium">Total Downloads</span>
          <span className="text-2xl font-black text-neutral-900 dark:text-zinc-50">{totalDownloads.toLocaleString()}</span>
        </Card>
        <Card className="flex flex-col gap-1.5">
          <span className="text-muted font-medium">Developer Status</span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 capitalize">{user?.role}</span>
        </Card>
      </div>

      {/* Extensions List Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-zinc-50">My Published Packages</h2>
        
        {extensions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center border border-dashed border-neutral-200 dark:border-zinc-800 rounded-xl bg-neutral-50/50 dark:bg-zinc-950/10">
            <svg className="w-10 h-10 text-muted mb-3 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-zinc-100 mb-1">No uploads found</h3>
            <p className="text-xs text-muted max-w-xs mb-4">
              You haven't uploaded any extensions to the marketplace yet. Get started now.
            </p>
            <Link
              to="/developer/upload"
              className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-lg text-xs hover:opacity-90 shadow-sm"
            >
              Upload Your First Package
            </Link>
          </div>
        ) : (
          <div className="border border-neutral-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-zinc-950 text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50 dark:bg-zinc-900/50 border-b border-neutral-100 dark:border-zinc-900 text-muted font-bold">
                    <th className="p-4">Extension</th>
                    <th className="p-4">Latest Version</th>
                    <th className="p-4">Downloads</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-zinc-900">
                  {extensions.map((ext) => (
                    <tr key={ext.id} className="hover:bg-neutral-50/30 dark:hover:bg-zinc-900/20 transition-colors">
                      {/* Name / Description */}
                      <td className="p-4 max-w-xs md:max-w-md">
                        <div className="flex items-center gap-3">
                          {ext.logo_path ? (
                            <img src={ext.logo_path} alt="Logo" className="w-8 h-8 rounded-lg object-cover border border-neutral-200 dark:border-zinc-800" />
                          ) : (
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-extrabold bg-neutral-900 text-neutral-100 border border-neutral-200 dark:border-zinc-800">
                              {ext.title ? ext.title.substring(0, 2).toUpperCase() : "EX"}
                            </div>
                          )}
                          <div className="min-w-0">
                            <Link to={`/extensions/${ext.id}`} className="font-bold text-neutral-900 dark:text-zinc-100 hover:underline">
                              {ext.title}
                            </Link>
                            <p className="text-[10px] text-muted truncate mt-0.5">{ext.description}</p>
                          </div>
                        </div>
                      </td>

                      {/* Version */}
                      <td className="p-4">
                        {ext.latest_version ? (
                          <Badge variant="neutral" className="font-mono text-[9px]">v{ext.latest_version}</Badge>
                        ) : (
                          <span className="text-neutral-400 italic">None</span>
                        )}
                      </td>

                      {/* Download count */}
                      <td className="p-4 font-semibold text-neutral-700 dark:text-zinc-300">
                        {ext.download_count.toLocaleString()}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="inline-flex flex-wrap items-center justify-end gap-1.5 font-bold">
                          <Link
                            to={`/developer/docs/${ext.id}`}
                            className="px-2.5 py-1.5 border border-neutral-200 dark:border-zinc-800 hover:bg-neutral-50 dark:hover:bg-zinc-900 rounded-lg text-neutral-700 dark:text-zinc-300 transition-colors"
                          >
                            Edit Docs
                          </Link>
                          <Link
                            to={`/developer/edit/${ext.id}`}
                            className="px-2.5 py-1.5 border border-neutral-200 dark:border-zinc-800 hover:bg-neutral-50 dark:hover:bg-zinc-900 rounded-lg text-neutral-700 dark:text-zinc-300 transition-colors"
                          >
                            Edit Metadata
                          </Link>
                          <button
                            onClick={() => setActiveVersionExtension(ext)}
                            className="px-2.5 py-1.5 bg-neutral-950 text-white dark:bg-zinc-50 dark:text-neutral-950 rounded-lg hover:opacity-90 shadow-sm"
                          >
                            Releases
                          </button>
                          <button
                            onClick={() => handleDelete(ext.id, ext.title)}
                            className="px-2.5 py-1.5 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 rounded-lg transition-colors dark:bg-red-950/20 dark:border-red-900 dark:text-red-400"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Version Manager Modal Portal */}
      {activeVersionExtension && (
        <VersionManager
          extension={activeVersionExtension}
          onClose={() => setActiveVersionExtension(null)}
          onSuccess={(updated) => {
            setExtensions((prev) =>
              prev.map((e) => (e.id === updated.id ? { ...e, latest_version: updated.latest_version, versions: updated.versions } : e))
            );
          }}
        />
      )}
    </div>
  );
}
