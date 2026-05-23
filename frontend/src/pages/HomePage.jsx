import { Link } from "react-router-dom";
import SearchBar from "../components/search/SearchBar.jsx";

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="space-y-6 pt-8">
        <p className="text-sm font-medium uppercase tracking-widest text-muted">
          Developer extensions
        </p>
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
          Discover, document, and download extensions in one clean place.
        </h1>
        <p className="max-w-xl text-lg text-muted">
          ExtensionHub is a minimalist marketplace focused on readability and fast navigation.
        </p>
        <SearchBar />
        <div className="flex gap-4 pt-2">
          <Link
            to="/extensions"
            className="rounded-lg bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white no-underline hover:bg-neutral-800"
          >
            Browse extensions
          </Link>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-8">
          <h2 className="text-lg font-semibold">Featured</h2>
          <p className="mt-2 text-sm text-muted">Coming in Phase 5 — extension listings.</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-8">
          <h2 className="text-lg font-semibold">Latest uploads</h2>
          <p className="mt-2 text-sm text-muted">Coming in Phase 5 — extension listings.</p>
        </div>
      </section>
    </div>
  );
}
