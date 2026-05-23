export default function SearchBar({ placeholder = "Search extensions…" }) {
  return (
    <div className="max-w-xl">
      <input
        type="search"
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm shadow-soft outline-none ring-accent focus:ring-2"
        disabled
        aria-label="Search extensions"
      />
      <p className="mt-2 text-xs text-muted">Search wiring arrives in Phase 5.</p>
    </div>
  );
}
