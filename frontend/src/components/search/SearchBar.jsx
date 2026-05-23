export default function SearchBar({
  value,
  onChange,
  placeholder = "Search extensions by name or description…",
  className = "",
  loading = false,
}) {
  return (
    <div className={`relative max-w-xl w-full ${className}`}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-neutral-400">
        {loading ? (
          <div className="w-4 h-4 rounded-full border-2 border-neutral-300 border-t-black dark:border-t-white animate-spin" />
        ) : (
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        )}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 pl-10 pr-4 py-2.5 text-sm shadow-sm outline-none transition-all focus:border-neutral-400 dark:focus:border-zinc-700"
        aria-label="Search extensions"
      />
    </div>
  );
}
