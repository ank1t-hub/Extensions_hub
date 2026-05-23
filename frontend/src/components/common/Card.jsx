export default function Card({
  children,
  className = "",
  hoverable = false,
  ...props
}) {
  const baseClasses = "rounded-xl border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-sm";
  const hoverClasses = hoverable
    ? "hover:border-neutral-400 dark:hover:border-zinc-700 hover:shadow-md hover:shadow-neutral-100 dark:hover:shadow-none transition-all duration-300 cursor-pointer"
    : "";

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
