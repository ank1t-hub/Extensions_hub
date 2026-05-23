import { useMemo } from "react";
import { parseMarkdown } from "../../utils/markdown.js";
import CodeBlock from "./CodeBlock.jsx";
import TableOfContents from "./TableOfContents.jsx";

// Helper to render inline elements (bold, italic, code, links)
function renderInline(parts) {
  return parts.map((part, index) => {
    switch (part.type) {
      case "bold":
        return <strong key={index} className="font-semibold text-black dark:text-white">{part.content}</strong>;
      case "italic":
        return <em key={index} className="italic">{part.content}</em>;
      case "code":
        return (
          <code
            key={index}
            className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-red-600 dark:text-red-400 font-mono text-xs"
          >
            {part.content}
          </code>
        );
      case "link":
        return (
          <a
            key={index}
            href={part.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black dark:text-white underline hover:opacity-80 transition-all font-medium"
          >
            {part.text}
          </a>
        );
      case "image":
        return (
          <img
            key={index}
            src={part.url}
            alt={part.alt}
            className="rounded border border-border my-4 max-w-full h-auto"
          />
        );
      default:
        return part.content;
    }
  });
}

export default function DocumentationViewer({ markdown }) {
  const blocks = useMemo(() => parseMarkdown(markdown), [markdown]);

  // Extract H2 and H3 headings for the Table of Contents
  const headings = useMemo(() => {
    return blocks
      .filter((b) => b.type === "heading" && (b.level === 2 || b.level === 3))
      .map((b) => ({ id: b.id, text: b.text, level: b.level }));
  }, [blocks]);

  if (!markdown || markdown.trim() === "") {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-border rounded-lg bg-zinc-50/50 dark:bg-zinc-950/20 text-center">
        <svg
          className="w-10 h-10 text-muted mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-sm font-medium">No documentation provided yet</p>
        <p className="text-xs text-muted mt-1">The author has not uploaded a setup guide or documentation for this extension.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start relative w-full">
      {/* Markdown Content Column */}
      <div className="flex-1 w-full max-w-4xl prose dark:prose-invert prose-zinc text-zinc-800 dark:text-zinc-200">
        {blocks.map((block, idx) => {
          switch (block.type) {
            case "heading": {
              const Tag = `h${block.level}`;
              // Level 1: large title, Level 2: major subtitle with thin border, Level 3: section
              let headingClasses = "font-bold tracking-tight text-black dark:text-white ";
              if (block.level === 1) headingClasses += "text-3xl mb-6 mt-2";
              else if (block.level === 2) headingClasses += "text-2xl pb-2 border-b border-border mb-4 mt-8";
              else if (block.level === 3) headingClasses += "text-xl mb-3 mt-6";
              else headingClasses += "text-lg mb-2 mt-4";

              return (
                <Tag key={idx} id={block.id} className={headingClasses}>
                  {block.text}
                </Tag>
              );
            }
            case "paragraph":
              return (
                <p key={idx} className="leading-relaxed mb-4 text-sm md:text-base">
                  {renderInline(block.content)}
                </p>
              );
            case "blockquote":
              return (
                <blockquote
                  key={idx}
                  className="pl-4 border-l-2 border-border italic text-muted my-6"
                >
                  {renderInline(block.content)}
                </blockquote>
              );
            case "list": {
              const ListTag = block.ordered ? "ol" : "ul";
              const listClasses = block.ordered
                ? "list-decimal list-inside space-y-2 mb-4 pl-4"
                : "list-disc list-inside space-y-2 mb-4 pl-4";
              return (
                <ListTag key={idx} className={listClasses}>
                  {block.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="text-sm md:text-base">
                      {renderInline(item)}
                    </li>
                  ))}
                </ListTag>
              );
            }
            case "code":
              return <CodeBlock key={idx} code={block.code} lang={block.lang} />;
            case "hr":
              return <hr key={idx} className="my-8 border-border" />;
            default:
              return null;
          }
        })}
      </div>

      {/* Side Rail - Table of Contents (Sticky on desktop) */}
      {headings.length > 0 && (
        <div className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24 border-t lg:border-t-0 lg:border-l border-border pt-6 lg:pt-0 lg:pl-6 max-h-[calc(100vh-8rem)] overflow-y-auto hidden md:block">
          <TableOfContents headings={headings} />
        </div>
      )}
    </div>
  );
}
