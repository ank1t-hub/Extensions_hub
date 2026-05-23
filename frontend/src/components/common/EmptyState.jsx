export default function EmptyState({
  title = "No results found",
  description = "Try adjusting your search filters or browse other categories.",
  icon,
  actionButton,
  className = "",
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 text-center border border-dashed border-neutral-200 dark:border-zinc-800 rounded-xl bg-neutral-50/50 dark:bg-zinc-950/10 ${className}`}>
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-100 dark:bg-zinc-900 text-neutral-400 mb-4 animate-pulse">
        {icon || (
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        )}
      </div>
      <h3 className="text-sm font-semibold text-neutral-900 dark:text-zinc-100 mb-1">
        {title}
      </h3>
      <p className="text-xs text-muted max-w-xs mb-5">
        {description}
      </p>
      {actionButton}
    </div>
  );
}
