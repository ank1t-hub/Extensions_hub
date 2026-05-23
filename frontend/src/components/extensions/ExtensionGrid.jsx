import ExtensionCard from "./ExtensionCard.jsx";
import EmptyState from "../common/EmptyState.jsx";

export default function ExtensionGrid({ extensions = [], loading = false }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 space-y-4 animate-pulse"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-neutral-100 dark:bg-zinc-900 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-neutral-100 dark:bg-zinc-900 rounded w-3/4" />
                <div className="h-3 bg-neutral-100 dark:bg-zinc-900 rounded w-1/3" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-neutral-100 dark:bg-zinc-900 rounded w-full" />
              <div className="h-3 bg-neutral-100 dark:bg-zinc-900 rounded w-5/6" />
            </div>
            <div className="border-t border-neutral-100 dark:border-zinc-900 pt-3 flex justify-between items-center">
              <div className="h-3 bg-neutral-100 dark:bg-zinc-900 rounded w-1/3" />
              <div className="h-3 bg-neutral-100 dark:bg-zinc-900 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (extensions.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {extensions.map((extension) => (
        <ExtensionCard key={extension.id} extension={extension} />
      ))}
    </div>
  );
}
