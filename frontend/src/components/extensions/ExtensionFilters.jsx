import { useEffect, useState } from "react";
import { listCategories } from "../../services/extensionService.js";

export default function ExtensionFilters({
  activeCategory,
  onSelectCategory,
  className = "",
}) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCats() {
      try {
        setLoading(true);
        const data = await listCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCats();
  }, []);

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {/* "All" button */}
      <button
        onClick={() => onSelectCategory(null)}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all border ${
          activeCategory === null
            ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
            : "bg-white dark:bg-zinc-950 text-muted border-neutral-200 dark:border-zinc-800 hover:text-black dark:hover:text-white hover:border-neutral-300 dark:hover:border-zinc-700"
        }`}
      >
        All Extensions
      </button>

      {/* Loading Skeletal Categories */}
      {loading
        ? [...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-16 h-7 rounded-lg border border-neutral-200 dark:border-zinc-800 bg-neutral-50 dark:bg-zinc-950 animate-pulse"
            />
          ))
        : categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all border ${
                activeCategory === cat.slug
                  ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                  : "bg-white dark:bg-zinc-950 text-muted border-neutral-200 dark:border-zinc-800 hover:text-black dark:hover:text-white hover:border-neutral-300 dark:hover:border-zinc-700"
              }`}
            >
              {cat.name}
            </button>
          ))}
    </div>
  );
}
