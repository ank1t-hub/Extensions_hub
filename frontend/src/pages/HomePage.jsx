import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../components/search/SearchBar.jsx";
import ExtensionGrid from "../components/extensions/ExtensionGrid.jsx";
import { listExtensions } from "../services/extensionService.js";

export default function HomePage() {
  const navigate = useNavigate();
  const [latestExtensions, setLatestExtensions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => {
    async function loadLatest() {
      try {
        setLoading(true);
        const data = await listExtensions({ limit: 3 });
        setLatestExtensions(data.items || []);
      } catch (err) {
        console.error("Failed to load latest extensions:", err);
      } finally {
        setLoading(false);
      }
    }
    loadLatest();
  }, []);

  const handleSearchSubmit = (val) => {
    if (val.trim()) {
      navigate(`/extensions?q=${encodeURIComponent(val.trim())}`);
    }
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="space-y-6 pt-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-zinc-500">
          Developer marketplace
        </p>
        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl text-neutral-900 dark:text-zinc-50">
          Discover, document, and download extensions in one clean place.
        </h1>
        <p className="max-w-2xl text-base md:text-lg text-muted font-medium leading-relaxed">
          ExtensionHub is a minimalist marketplace focused on top-tier code readability, developer documentation, and blazing fast navigation.
        </p>

        {/* Search Bar and Trigger */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearchSubmit(searchVal);
          }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full"
        >
          <SearchBar
            value={searchVal}
            onChange={setSearchVal}
            placeholder="Search extensions by name or keyword..."
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black font-semibold text-sm shadow-sm transition-all whitespace-nowrap"
          >
            Search
          </button>
        </form>
      </section>

      {/* Featured / Latest Uploads Grid */}
      <section className="space-y-6 border-t border-neutral-100 dark:border-zinc-900 pt-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-zinc-50">
              Latest Uploads
            </h2>
            <p className="text-xs text-muted mt-1">
              Explore the newest plugins, packages, and custom tools uploaded by developers.
            </p>
          </div>
          <Link
            to="/extensions"
            className="inline-flex items-center gap-1 text-xs font-semibold text-black dark:text-white hover:opacity-80 transition-all"
          >
            <span>View all extensions</span>
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Real Dynamic Grid */}
        <div className="w-full">
          <ExtensionGrid extensions={latestExtensions} loading={loading} />
        </div>
      </section>

      {/* Value Proposition Callouts */}
      <section className="grid gap-6 md:grid-cols-3 border-t border-neutral-100 dark:border-zinc-900 pt-12 text-sm">
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-zinc-800 bg-neutral-50/50 dark:bg-zinc-950/10">
          <h3 className="font-semibold text-neutral-900 dark:text-zinc-100 mb-2">Developer-First</h3>
          <p className="text-xs text-muted leading-relaxed">
            Easily upload, release updates, and manage comprehensive markdown-rendered guides directly from the dashboard.
          </p>
        </div>
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-zinc-800 bg-neutral-50/50 dark:bg-zinc-950/10">
          <h3 className="font-semibold text-neutral-900 dark:text-zinc-100 mb-2">Immersive Documentation</h3>
          <p className="text-xs text-muted leading-relaxed">
            Read syntax-highlighted code blocks, copy snippets with one click, and browse structured scroll-spy directories.
          </p>
        </div>
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-zinc-800 bg-neutral-50/50 dark:bg-zinc-950/10">
          <h3 className="font-semibold text-neutral-900 dark:text-zinc-100 mb-2">Secure & Reliable</h3>
          <p className="text-xs text-muted leading-relaxed">
            Every extension version is packaged safely, checksum verified, and hosted locally for instantaneous downloads.
          </p>
        </div>
      </section>
    </div>
  );
}
