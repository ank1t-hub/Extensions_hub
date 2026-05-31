import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { uploadExtension, listCategories } from "../../services/extensionService.js";

export default function UploadExtensionPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [version, setVersion] = useState("1.0.0");
  const [changelog, setChangelog] = useState("Initial upload.");
  const [selectedSlugs, setSelectedSlugs] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadCats() {
      try {
        const cats = await listCategories();
        setCategories(cats || []);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }
    loadCats();
  }, []);

  const handleCategoryToggle = (slug) => {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError("Extension package file is required.");
    if (selectedSlugs.length === 0) return setError("Please select at least one category tag.");

    try {
      setLoading(true);
      setError("");
      setSuccess(false);

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("version", version.trim());
      if (changelog.trim()) formData.append("changelog", changelog.trim());
      formData.append("category_slugs", selectedSlugs.join(","));
      formData.append("file", file);

      await uploadExtension(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate("/developer");
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to upload extension package.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Navigation Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs text-muted mb-1">
          <Link to="/developer" className="hover:text-black dark:hover:text-white transition-colors">
            Developer Dashboard
          </Link>
          <span>/</span>
          <span>Upload Extension</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-zinc-50">
          Upload New Package
        </h1>
        <p className="text-xs text-muted mt-1">
          Publish a new extension, theme or tool package onto the global directory.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg text-red-600 dark:text-red-400 text-xs">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg text-green-600 dark:text-green-400 text-xs font-semibold">
          Package uploaded successfully! Redirecting...
        </div>
      )}

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="space-y-6 border border-neutral-200 dark:border-zinc-800 rounded-xl p-6 bg-white dark:bg-zinc-950 shadow-sm text-xs">
        
        {/* Title */}
        <div className="space-y-1.5">
          <label className="block font-semibold text-neutral-800 dark:text-zinc-200">
            Package Title
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Code Autocomplete Helper"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 outline-none transition-all focus:border-neutral-400 dark:focus:border-zinc-700"
          />
        </div>

        {/* Short Description */}
        <div className="space-y-1.5">
          <label className="block font-semibold text-neutral-800 dark:text-zinc-200">
            Short Description
          </label>
          <textarea
            required
            placeholder="Provide a clear, brief summary of what this extension does..."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 outline-none transition-all focus:border-neutral-400 dark:focus:border-zinc-700"
          />
        </div>

        {/* Category tags */}
        <div className="space-y-2">
          <label className="block font-semibold text-neutral-800 dark:text-zinc-200">
            Category Tags (Select at least one)
          </label>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => {
              const isSelected = selectedSlugs.includes(cat.slug);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryToggle(cat.slug)}
                  className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                    isSelected
                      ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                      : "bg-white dark:bg-zinc-950 text-muted border-neutral-200 dark:border-zinc-800 hover:text-black dark:hover:text-white"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Initial Version */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-neutral-800 dark:text-zinc-200">
              Initial Release Version
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 1.0.0"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 outline-none transition-all focus:border-neutral-400 dark:focus:border-zinc-700"
            />
          </div>

          {/* Package File Upload */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-neutral-800 dark:text-zinc-200">
              Extension Package File (.zip, .vsix, .crx)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                required
                accept=".zip,.vsix,.crx"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
                id="developer-upload-file-picker"
              />
              <label
                htmlFor="developer-upload-file-picker"
                className="px-4 py-2.5 rounded-lg border border-dashed border-neutral-300 dark:border-zinc-700 hover:border-black dark:hover:border-white bg-neutral-50/50 dark:bg-zinc-900/10 cursor-pointer flex items-center gap-2 font-medium"
              >
                <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>{file ? file.name : "Choose File"}</span>
              </label>
              {file && <span className="text-[10px] text-muted font-mono">{(file.size / 1024 / 1024).toFixed(2)} MB</span>}
            </div>
          </div>
        </div>

        {/* Initial Changelog */}
        <div className="space-y-1.5">
          <label className="block font-semibold text-neutral-800 dark:text-zinc-200">
            Initial Changelog Notes
          </label>
          <textarea
            placeholder="Release notes for your initial upload version..."
            rows={3}
            value={changelog}
            onChange={(e) => setChangelog(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 outline-none transition-all focus:border-neutral-400 dark:focus:border-zinc-700"
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-2 border-t border-neutral-100 dark:border-zinc-900 pt-4 mt-6">
          <Link
            to="/developer"
            className="px-4 py-2 border border-neutral-200 dark:border-zinc-800 hover:bg-neutral-50 dark:hover:bg-zinc-900 rounded-lg font-medium"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-t-transparent border-current rounded-full animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <span>Publish Package</span>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
