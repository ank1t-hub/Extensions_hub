import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getExtension, updateExtension, listCategories } from "../../services/extensionService.js";

export default function EditExtensionPage() {
  const { extensionId } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [logoPath, setLogoPath] = useState("");
  const [selectedSlugs, setSelectedSlugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [cats, ext] = await Promise.all([
        listCategories(),
        getExtension(extensionId),
      ]);
      setCategories(cats || []);
      setTitle(ext.title || "");
      setDescription(ext.description || "");
      setLogoPath(ext.logo_path || "");
      setSelectedSlugs(ext.category_slugs || []);
    } catch (err) {
      setError(err.message || "Failed to load extension metadata details.");
    } finally {
      setLoading(false);
    }
  }, [extensionId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCategoryToggle = (slug) => {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSlugs.length === 0) return setError("Please select at least one category tag.");

    try {
      setSaving(true);
      setError("");
      setSuccess(false);

      const updateData = {
        title: title.trim(),
        description: description.trim(),
        category_slugs: selectedSlugs,
        logo_path: logoPath.trim() || null,
      };

      await updateExtension(extensionId, updateData);
      setSuccess(true);
      setTimeout(() => {
        navigate("/developer");
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to update extension details.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-muted">
        <div className="w-8 h-8 rounded-full border-2 border-t-black dark:border-t-white border-zinc-200 dark:border-zinc-800 animate-spin" />
        <span className="text-sm font-medium">Loading details...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Navigation Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs text-muted mb-1">
          <Link to="/developer" className="hover:text-black dark:hover:text-white transition-colors">
            Developer Dashboard
          </Link>
          <span>/</span>
          <span>Edit Package Metadata</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-zinc-50">
          Edit Extension Details
        </h1>
        <p className="text-xs text-muted mt-1">
          Update the titles, branding logo path, description, and categories.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg text-red-600 dark:text-red-400 text-xs">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg text-green-600 dark:text-green-400 text-xs font-semibold">
          Details updated successfully! Redirecting...
        </div>
      )}

      {/* Edit Form */}
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

        {/* Logo Image URL */}
        <div className="space-y-1.5">
          <label className="block font-semibold text-neutral-800 dark:text-zinc-200">
            Logo URL Path (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. https://domain.com/path/to/logo.png"
            value={logoPath}
            onChange={(e) => setLogoPath(e.target.value)}
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
            disabled={saving}
            className="px-5 py-2 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
          >
            {saving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-t-transparent border-current rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
