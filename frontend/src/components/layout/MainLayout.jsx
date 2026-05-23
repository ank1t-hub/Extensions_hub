export default function MainLayout({ children }) {
  return (
    <div className="w-full min-h-screen bg-white dark:bg-zinc-950 text-neutral-900 dark:text-zinc-50">
      {children}
    </div>
  );
}
