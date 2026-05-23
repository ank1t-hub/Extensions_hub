import { Link } from "react-router-dom";
import Card from "../common/Card.jsx";
import Badge from "../common/Badge.jsx";

export default function ExtensionCard({ extension }) {
  const {
    id,
    title,
    description,
    download_count,
    latest_version,
    logo_path,
  } = extension;

  // Generate a beautiful, stable colored fallback avatar based on title length or character
  const getFallbackColor = (str) => {
    const colors = [
      "bg-neutral-900 text-neutral-100",
      "bg-zinc-800 text-zinc-100",
      "bg-zinc-950 text-white",
      "bg-[#16161a] text-zinc-100",
    ];
    const index = str ? str.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  return (
    <Card hoverable className="flex flex-col h-full justify-between gap-4 group">
      <div>
        {/* Card Header: Logo, Title & Version */}
        <div className="flex items-start gap-4 mb-3">
          {logo_path ? (
            <img
              src={logo_path}
              alt={`${title} logo`}
              className="w-11 h-11 rounded-lg object-cover border border-neutral-100 dark:border-zinc-800"
            />
          ) : (
            <div className={`w-11 h-11 rounded-lg flex items-center justify-center font-bold tracking-wider text-sm select-none border border-neutral-200 dark:border-zinc-800 ${getFallbackColor(title)}`}>
              {title ? title.substring(0, 2).toUpperCase() : "EX"}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-neutral-900 dark:text-zinc-100 leading-snug group-hover:text-black dark:group-hover:text-white transition-colors truncate">
              {title}
            </h3>
            {latest_version && (
              <Badge variant="neutral" className="mt-1 font-mono text-[10px]">
                v{latest_version}
              </Badge>
            )}
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs text-muted line-clamp-3 leading-relaxed mb-1">
          {description}
        </p>
      </div>

      {/* Card Footer: Downloads & View Details */}
      <div className="flex items-center justify-between border-t border-neutral-100 dark:border-zinc-900 pt-3 mt-1 text-xs">
        {/* Downloads */}
        <div className="flex items-center gap-1.5 text-muted">
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
          <span className="font-medium">{download_count.toLocaleString()} downloads</span>
        </div>

        {/* Link Button */}
        <Link
          to={`/extensions/${id}`}
          className="font-medium text-black dark:text-white hover:opacity-80 transition-all flex items-center gap-1 group/btn"
        >
          <span>View Details</span>
          <svg
            className="w-3 h-3 transform group-hover/btn:translate-x-0.5 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </Card>
  );
}
