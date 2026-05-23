import { useEffect, useState } from "react";

export default function TableOfContents({ headings }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          // Set the first visible element's id as active
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "0px 0px -80% 0px" } // trigger active state when element enters top 20% of viewport
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="space-y-2 text-sm">
      <h4 className="text-xs font-semibold tracking-wider uppercase text-muted mb-4">
        On This Page
      </h4>
      <ul className="space-y-2 border-l border-border pl-0 list-none">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}
            className="list-none"
          >
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
                setActiveId(heading.id);
              }}
              className={`block py-1 pr-4 border-l -ml-px pl-4 transition-all duration-200 ${
                activeId === heading.id
                  ? "border-[#000] dark:border-[#fff] text-[#000] dark:text-[#fff] font-medium"
                  : "border-transparent text-muted hover:text-[#000] dark:hover:text-[#fff]"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
