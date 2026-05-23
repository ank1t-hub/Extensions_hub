import { useState } from "react";

export default function CodeBlock({ code, lang }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="relative group my-6 rounded-lg border border-border bg-[#0f0f11] overflow-hidden font-mono text-sm leading-relaxed shadow-sm">
      {/* Codeblock header bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#222] bg-[#16161a]">
        <span className="text-xs font-semibold text-[#888] uppercase tracking-wider">
          {lang || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-muted rounded-md bg-[#222] hover:bg-[#333] hover:text-[#fff] transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#888]"
        >
          {copied ? (
            <>
              <svg
                className="w-3.5 h-3.5 text-green-500 animate-scale"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code body */}
      <pre className="p-4 overflow-x-auto text-[#e4e4e7] scrollbar-thin">
        <code>{code}</code>
      </pre>
    </div>
  );
}
