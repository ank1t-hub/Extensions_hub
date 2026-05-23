import Badge from "../common/Badge.jsx";
import { getDownloadUrl } from "../../services/extensionService.js";

export default function ExtensionHeader({ extension, onDownload }) {
  const {
    id,
    title,
    description,
    latest_version,
    download_count,
    logo_path,
  } = extension;

  const downloadUrl = getDownloadUrl(id, latest_version);

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-border pb-6 mb-6 gap-6">
      <div className="flex items-start gap-5">
        {/* Logo */}
        {logo_path ? (
          <img
            src={logo_path}
            alt={`${title} logo`}
            className="w-16 h-16 rounded-xl object-cover border border-neutral-200 dark:border-zinc-800 shadow-sm"
          />
        ) : (
          <div className="w-16 h-16 rounded-xl flex items-center justify-center font-bold tracking-wider text-xl select-none border border-neutral-200 dark:border-zinc-800 bg-neutral-900 text-neutral-100">
            {title ? title.substring(0, 2).toUpperCase() : "EX"}
          </div>
        )}

        {/* Text Metadata */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-zinc-50">
              {title}
            </h1>
            {latest_version && (
              <Badge variant="primary" className="font-mono text-[10px] py-0.5">
                v{latest_version}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted mb-2 max-w-xl">
            {description}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted font-medium">
            <div className="flex items-center gap-1.5">
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span>{download_count.toLocaleString()} downloads</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <span className="text-neutral-400">Security verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Action Call */}
      <a
        href={downloadUrl}
        onClick={onDownload}
        className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black font-semibold text-xs shadow-sm transition-all text-center"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        <span>Download Extension</span>
      </a>
    </div>
  );
}
