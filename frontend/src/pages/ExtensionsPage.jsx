import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/search/SearchBar.jsx";
import ExtensionFilters from "../components/extensions/ExtensionFilters.jsx";
import ExtensionGrid from "../components/extensions/ExtensionGrid.jsx";
import { listExtensions } from "../services/extensionService.js";
import useDebounce from "../hooks/useDebounce.js";

export default function ExtensionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [extensions, setExtensions] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Read state from URL search params to support deep linking
  const queryParam = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || null;
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const limit = 9; // Show 9 per page in grid

  const [searchText, setSearchText] = useState(queryParam);
  const debouncedSearch = useDebounce(searchText, 300);

  // Sync state with URL search params when debounced search text or category changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("q", debouncedSearch);
    if (categoryParam) params.set("category", categoryParam);
    params.set("page", "1"); // Reset to page 1 on new search or category change
    setSearchParams(params);
  }, [debouncedSearch, categoryParam, setSearchParams]);

  // Sync local search input with URL query param changes (e.g. from homepage redirect)
  useEffect(() => {
    setSearchText(queryParam);
  }, [queryParam]);

  const loadExtensions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listExtensions({
        q: debouncedSearch,
        category: categoryParam,
        page: pageParam,
        limit,
      });
      setExtensions(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Failed to load extensions:", err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, categoryParam, pageParam]);

  useEffect(() => {
    loadExtensions();
  }, [loadExtensions]);

  const handleCategorySelect = (categorySlug) => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("q", debouncedSearch);
    if (categorySlug) params.set("category", categorySlug);
    params.set("page", "1");
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    setSearchParams(params);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-8">
      {/* Search and Category Filter Banner */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-zinc-50">
            Browse Extensions
          </h1>
          <p className="text-xs text-muted mt-1">
            Discover developer tools, snippets, productivity boosters, and color themes.
          </p>
        </div>

        {/* Filters Panel */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 dark:border-zinc-900 pb-5">
          <SearchBar
            value={searchText}
            onChange={setSearchText}
            placeholder="Search extensions by name or keywords..."
            loading={loading}
          />
          <ExtensionFilters
            activeCategory={categoryParam}
            onSelectCategory={handleCategorySelect}
          />
        </div>
      </div>

      {/* Extension Cards Grid */}
      <div className="min-h-[40vh]">
        <ExtensionGrid extensions={extensions} loading={loading} />
      </div>

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-neutral-100 dark:border-zinc-900 pt-6 text-xs font-semibold text-neutral-800 dark:text-zinc-200">
          <span className="text-muted">
            Showing Page {pageParam} of {totalPages} ({total} total results)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(pageParam - 1)}
              disabled={pageParam === 1}
              className="px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-neutral-50 dark:hover:bg-zinc-900 disabled:opacity-40 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pageParam + 1)}
              disabled={pageParam === totalPages}
              className="px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-neutral-50 dark:hover:bg-zinc-900 disabled:opacity-40 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
