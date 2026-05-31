import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listExtensions } from "../../services/extensionService.js";
import { adminDeleteExtension } from "../../services/adminService.js";
import Badge from "../../components/common/Badge.jsx";

export default function ModerationPage() {
  const [extensions, setExtensions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    async function loadExtensions() {
      try {
        setLoading(true);
        setError("");
        const data = await listExtensions({ limit: 100 });
        setExtensions(data.items || []);
      } catch (err) {
        setError(err.message || "Failed to load directory extensions.");
      } finally {
        setLoading(false);
      }
    }
    loadExtensions();
  }, []);

  const handleModerateDelete = async (id, title) => {
    if (!window.confirm(`ADMIN MODERATION WARNING:\nAre you absolutely sure you want to forcibly delete "${title}"? This action is permanent and bypasses author safeguards.`)) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      await adminDeleteExtension(id);
      setExtensions((prev) => prev.filter((ext) => ext.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete extension.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-muted">
        <div className="w-8 h-8 rounded-full border-2 border-t-black dark:border-t-white border-zinc-200 dark:border-zinc-800 animate-spin" />
        <span className="text-sm font-medium">Loading moderation directory...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Navigation Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs text-muted mb-1">
          <Link to="/admin" className="hover:text-black dark:hover:text-white transition-colors">
            Admin Dashboard
          </Link>
          <span>/</span>
          <span>Content Moderation</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-zinc-50">
          Global Extension Moderation
        </h1>
        <p className="text-xs text-muted mt-1">
          Audit uploaded packages, track usage downloads, and perform administrative take-downs.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg text-red-600 dark:text-red-400 text-xs">
          {error}
        </div>
      )}

      {/* Extensions Table */}
      <div className="border border-neutral-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-zinc-950 text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 dark:bg-zinc-900/50 border-b border-neutral-100 dark:border-zinc-900 text-muted font-bold">
                <th className="p-4">Package details</th>
                <th className="p-4">Version</th>
                <th className="p-4">Downloads</th>
                <th className="p-4">Author ID</th>
                <th className="p-4 text-right">Moderation action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-zinc-900">
              {extensions.map((ext) => (
                <tr key={ext.id} className="hover:bg-neutral-50/30 dark:hover:bg-zinc-900/20 transition-colors">
                  
                  {/* Name/Description */}
                  <td className="p-4 max-w-xs md:max-w-md">
                    <div className="flex items-center gap-3">
                      {ext.logo_path ? (
                        <img src={ext.logo_path} alt="Logo" className="w-8 h-8 rounded-lg object-cover border border-neutral-200 dark:border-zinc-800" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold bg-neutral-900 text-neutral-100 border border-neutral-200 dark:border-zinc-800">
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

                  {/* Downloads */}
                  <td className="p-4 font-semibold text-neutral-700 dark:text-zinc-300">
                    {ext.download_count.toLocaleString()}
                  </td>

                  {/* Author ID */}
                  <td className="p-4 font-mono text-[10px] text-muted">
                    {ext.author_id}
                  </td>

                  {/* Administrative delete */}
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        to={`/extensions/${ext.id}`}
                        className="px-2.5 py-1.5 border border-neutral-200 dark:border-zinc-800 hover:bg-neutral-50 dark:hover:bg-zinc-900 rounded-lg text-neutral-700 dark:text-zinc-300 font-bold transition-colors"
                      >
                        View Page
                      </Link>
                      <button
                        onClick={() => handleModerateDelete(ext.id, ext.title)}
                        disabled={deletingId === ext.id}
                        className="px-2.5 py-1.5 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 rounded-lg font-bold transition-colors dark:bg-red-950/20 dark:border-red-900 dark:text-red-400"
                      >
                        {deletingId === ext.id ? (
                          <div className="w-3.5 h-3.5 border-2 border-t-transparent border-current rounded-full animate-spin" />
                        ) : (
                          "Take Down"
                        )}
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
