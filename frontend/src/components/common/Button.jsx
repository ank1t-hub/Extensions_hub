export default function Button({
  children,
  variant = "primary",
  className = "",
  disabled,
  ...props
}) {
  const variants = {
    primary:
      "bg-neutral-950 text-white hover:bg-neutral-800 disabled:bg-neutral-400",
    secondary:
      "border border-border bg-white text-neutral-950 hover:bg-surface disabled:opacity-50",
  };

  return (
    <button
      type="button"
      disabled={disabled}
      className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
