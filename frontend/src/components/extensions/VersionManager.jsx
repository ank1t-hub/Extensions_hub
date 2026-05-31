import { useState } from "react";
import { uploadVersion } from "../../services/extensionService.js";
import Badge from "../common/Badge.jsx";

export default function VersionManager({ extension, onClose, onSuccess }) {
  const [version, setVersion] = useState("");
  const [changelog, setChangelog] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!version.trim()) return setError("Version string is required.");
    if (!file) return setError("Please choose an extension package file (.zip, .vsix, .crx).");

    try {
      setUploading(true);
      setError("");
      setSuccess(false);

      const formData = new FormData();
      formData.append("version", version.trim());
      if (changelog.trim()) formData.append("changelog", changelog.trim());
      formData.append("file", file);

      const updated = await uploadVersion(extension.id, formData);
      setSuccess(true);
      setTimeout(() => {
        onSuccess(updated);
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to upload version.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-scale">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-100 dark:border-zinc-900 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-zinc-50">
              Manage Versions — {extension.title}
            </h2>
            <p className="text-xs text-muted">
              Add releases, review history, and update changelogs.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-black dark:hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin text-xs">
          
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg text-green-600 dark:text-green-400">
              New version uploaded successfully!
            </div>
          )}

          {/* List Versions or Add New Toggle */}
          {!isAddingNew ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-zinc-50">Release History</h3>
                <button
                  onClick={() => setIsAddingNew(true)}
                  className="px-3 py-1.5 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black font-semibold rounded-lg shadow-sm"
                >
                  Upload New Release
                </button>
              </div>

              {/* Version History Timeline */}
              <div className="border border-neutral-200 dark:border-zinc-800 rounded-xl divide-y divide-neutral-100 dark:divide-zinc-900 bg-neutral-50/50 dark:bg-zinc-950/5 overflow-hidden">
                {extension.versions && extension.versions.length > 0 ? (
                  extension.versions.map((ver) => (
                    <div key={ver.id} className="p-4 flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-1 max-w-md">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-neutral-900 dark:text-zinc-100">v{ver.version}</span>
                          {ver.is_latest && (
                            <Badge variant="success" className="text-[9px] py-0">Latest</Badge>
                          )}
                        </div>
                        <p className="text-[10px] text-muted font-mono truncate">{ver.file_path}</p>
                        {ver.changelog ? (
                          <p className="text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap leading-relaxed mt-2 p-3 bg-white dark:bg-zinc-900 rounded-lg border border-neutral-100 dark:border-zinc-900">
                            {ver.changelog}
                          </p>
                        ) : (
                          <p className="text-neutral-400 italic">No changelog notes provided.</p>
                        )}
                      </div>
                      <span className="text-[10px] text-muted shrink-0">
                        {new Date(ver.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted">No releases uploaded yet.</div>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-zinc-50">Upload New Release</h3>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-3 py-1.5 border border-neutral-200 dark:border-zinc-800 hover:bg-neutral-50 dark:hover:bg-zinc-900 rounded-lg"
                >
                  View Release History
                </button>
              </div>

              {/* Version String */}
              <div className="space-y-1.5">
                <label className="block font-medium text-neutral-700 dark:text-zinc-300">
                  Version Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1.0.1 or v2.0.0"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 outline-none transition-all focus:border-neutral-400 dark:focus:border-zinc-700"
                />
              </div>

              {/* Package File */}
              <div className="space-y-1.5">
                <label className="block font-medium text-neutral-700 dark:text-zinc-300">
                  Extension Package (.zip, .vsix, .crx)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    required
                    accept=".zip,.vsix,.crx"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                    id="modal-version-file"
                  />
                  <label
                    htmlFor="modal-version-file"
                    className="px-4 py-2.5 rounded-lg border border-dashed border-neutral-300 dark:border-zinc-700 hover:border-black dark:hover:border-white bg-neutral-50/50 dark:bg-zinc-900/10 cursor-pointer flex items-center gap-2 font-medium"
                  >
                    <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>{file ? file.name : "Choose File"}</span>
                  </label>
                  {file && <span className="text-[10px] text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</span>}
                </div>
              </div>

              {/* Changelog */}
              <div className="space-y-1.5">
                <label className="block font-medium text-neutral-700 dark:text-zinc-300">
                  Changelog Notes
                </label>
                <textarea
                  placeholder="What's new in this release? e.g. Fixed performance bottlenecks, updated dependencies."
                  rows={4}
                  value={changelog}
                  onChange={(e) => setChangelog(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 outline-none transition-all focus:border-neutral-400 dark:focus:border-zinc-700"
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-2 border-t border-neutral-100 dark:border-zinc-900 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2 border border-neutral-200 dark:border-zinc-800 hover:bg-neutral-50 dark:hover:bg-zinc-900 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-t-transparent border-current rounded-full animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <span>Publish Release</span>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
