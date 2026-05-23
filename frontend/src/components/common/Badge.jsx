export default function Badge({ children, variant = "neutral", className = "" }) {
  const baseClasses =
    "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium tracking-tight border";

  const variants = {
    neutral: "border-neutral-200 bg-neutral-50 text-neutral-600 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-950/30 dark:bg-emerald-950/20 dark:text-emerald-400",
    warning: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-950/30 dark:bg-amber-950/20 dark:text-amber-400",
    danger: "border-red-200 bg-red-50 text-red-700 dark:border-red-950/30 dark:bg-red-950/20 dark:text-red-400",
    info: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-950/30 dark:bg-sky-950/20 dark:text-sky-400",
    primary: "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black",
  };

  return (
    <span className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
