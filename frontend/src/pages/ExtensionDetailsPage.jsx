import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { getExtension, getDownloadUrl } from "../services/extensionService.js";
import { fetchDocumentation } from "../services/documentationService.js";
import ExtensionHeader from "../components/extensions/ExtensionHeader.jsx";
import DocumentationViewer from "../components/documentation/DocumentationViewer.jsx";
import Badge from "../components/common/Badge.jsx";
import Card from "../components/common/Card.jsx";

export default function ExtensionDetailsPage() {
  const { id } = useParams();
  const [extension, setExtension] = useState(null);
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // 'overview', 'docs', 'install', 'downloads', 'changelog'

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const extData = await getExtension(id);
      setExtension(extData);

      // Try fetching docs. If it returns 404/fails, fallback to empty string
      try {
        const docData = await fetchDocumentation(id);
        setMarkdown(docData.markdown_content || "");
      } catch {
        setMarkdown("");
      }
    } catch (err) {
      setError(err.message || "Failed to load extension details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle local count increment on the client UI for instantaneous visual feedback
  const handleDownloadTrigger = () => {
    if (extension) {
      setExtension((prev) => ({
        ...prev,
        download_count: prev.download_count + 1,
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-muted">
        <div className="w-8 h-8 rounded-full border-2 border-t-black dark:border-t-white border-zinc-200 dark:border-zinc-800 animate-spin" />
        <span className="text-sm font-medium">Loading extension details...</span>
      </div>
    );
  }

  if (error || !extension) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-zinc-100 mb-2">Error Loading Extension</h2>
        <p className="text-xs text-muted mb-6">{error || "The requested extension was not found."}</p>
        <Link
          to="/extensions"
          className="px-4 py-2 bg-neutral-950 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 dark:bg-zinc-50 dark:text-zinc-950"
        >
          Back to marketplace
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "docs", label: "Documentation" },
    { id: "install", label: "Installation" },
    { id: "downloads", label: "Downloads" },
    { id: "changelog", label: "Changelog" },
  ];

  return (
    <div className="space-y-6">
      {/* Back to Browse */}
      <Link
        to="/extensions"
        className="inline-flex items-center gap-1 text-xs text-muted hover:text-black dark:hover:text-white transition-colors"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span>Back to browse</span>
      </Link>

      {/* Header Info */}
      <ExtensionHeader extension={extension} onDownload={handleDownloadTrigger} />

      {/* Tab Select Bar */}
      <div className="border-b border-border flex items-center gap-1 md:gap-4 overflow-x-auto scrollbar-none pb-px text-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 px-3 border-b-2 -mb-px font-semibold whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.id
                ? "border-black dark:border-white text-black dark:text-white"
                : "border-transparent text-muted hover:text-black dark:hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="pt-4">
        {/* Panel 1: Overview */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Description & Screenshots Column */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-zinc-50 uppercase tracking-wider mb-3">
                  About Extension
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-zinc-700 dark:text-zinc-300 bg-neutral-50/50 dark:bg-zinc-950/20 p-5 border border-border rounded-xl">
                  {extension.description}
                </p>
              </div>

              {/* Dynamic Categories block */}
              {extension.category_slugs && extension.category_slugs.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-zinc-50 uppercase tracking-wider mb-2">
                    Categories
                  </h3>
                  <div className="flex gap-1.5 flex-wrap">
                    {extension.category_slugs.map((slug) => (
                      <Badge key={slug} variant="neutral" className="capitalize">
                        {slug.replace("-", " ")}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Release Info Column */}
            <div className="space-y-6">
              <Card>
                <h3 className="text-xs font-bold text-neutral-900 dark:text-zinc-100 uppercase tracking-wider mb-4">
                  Metadata details
                </h3>
                <div className="space-y-3.5 text-xs text-zinc-600 dark:text-zinc-400">
                  <div className="flex justify-between border-b border-neutral-100 dark:border-zinc-900 pb-2">
                    <span className="text-muted">Author ID</span>
                    <span className="font-mono text-[10px] text-neutral-900 dark:text-zinc-100">{extension.author_id}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-100 dark:border-zinc-900 pb-2">
                    <span className="text-muted">Latest version</span>
                    <span className="font-semibold text-neutral-900 dark:text-zinc-100">v{extension.latest_version || "0.0.1"}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-100 dark:border-zinc-900 pb-2">
                    <span className="text-muted">Created Date</span>
                    <span className="text-neutral-900 dark:text-zinc-100">
                      {new Date(extension.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-muted">Last Updated</span>
                    <span className="text-neutral-900 dark:text-zinc-100">
                      {new Date(extension.updated_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Panel 2: Documentation */}
        {activeTab === "docs" && <DocumentationViewer markdown={markdown} />}

        {/* Panel 3: Installation */}
        {activeTab === "install" && (
          <div className="max-w-2xl space-y-6">
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-zinc-100">Install command</h3>
              <p className="text-xs text-muted">
                Run the following install trigger inside your compatible terminal prompt to secure the package.
              </p>
            </div>

            {/* Interactive installation box */}
            <div className="relative group my-4 rounded-lg border border-border bg-[#0f0f11] overflow-hidden font-mono text-sm leading-relaxed shadow-sm">
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#222] bg-[#16161a]">
                <span className="text-[10px] font-bold text-[#888] uppercase tracking-wider">Shell Console</span>
                <button
                  onClick={() => {
                    const text = `exthub install ${extension.id}`;
                    navigator.clipboard.writeText(text);
                  }}
                  className="px-2.5 py-1 text-xs font-semibold rounded bg-[#222] text-[#888] hover:bg-[#333] hover:text-white transition-all"
                >
                  Copy
                </button>
              </div>
              <pre className="p-4 text-[#e4e4e7] overflow-x-auto">
                <code>$ exthub install {extension.id}</code>
              </pre>
            </div>

            <div className="p-5 border border-neutral-100 dark:border-zinc-900 rounded-xl bg-neutral-50/50 dark:bg-zinc-950/20 text-xs text-muted leading-relaxed space-y-2">
              <p className="font-semibold text-neutral-800 dark:text-zinc-200">Alternative Zip Setup Guide</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Download the latest file package directly via the Downloads tab</li>
                <li>Extract files to your local application extensions folder</li>
                <li>Reload or restart your primary editor shell environment</li>
              </ol>
            </div>
          </div>
        )}

        {/* Panel 4: Downloads */}
        {activeTab === "downloads" && (
          <div className="max-w-3xl space-y-4">
            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-zinc-100">Releases downloads</h3>
              <p className="text-xs text-muted">Download current or historical archive versions of the package files.</p>
            </div>

            <div className="divide-y divide-neutral-100 dark:divide-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 shadow-sm overflow-hidden text-xs">
              {extension.versions && extension.versions.length > 0 ? (
                extension.versions.map((ver) => {
                  const dUrl = getDownloadUrl(extension.id, ver.version);
                  return (
                    <div key={ver.id} className="p-4 flex items-center justify-between hover:bg-neutral-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-neutral-900 dark:text-zinc-100">Version {ver.version}</span>
                          {ver.is_latest && (
                            <Badge variant="success" className="text-[9px] py-0">Latest</Badge>
                          )}
                        </div>
                        <p className="text-[10px] text-muted font-mono truncate max-w-sm md:max-w-md">
                          Path: {ver.file_path}
                        </p>
                      </div>

                      <a
                        href={dUrl}
                        onClick={handleDownloadTrigger}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-zinc-800 hover:border-black dark:hover:border-white font-semibold text-[11px] text-neutral-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-all shadow-sm"
                      >
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
                        <span>Download</span>
                      </a>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-muted">No historical files found.</div>
              )}
            </div>
          </div>
        )}

        {/* Panel 5: Changelog */}
        {activeTab === "changelog" && (
          <div className="max-w-2xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-zinc-100">Release logs</h3>
              <p className="text-xs text-muted">Timeline of versions updates and changelogs uploaded by the author.</p>
            </div>

            <div className="relative border-l border-neutral-200 dark:border-zinc-800 pl-6 space-y-8 ml-3 py-1 text-xs">
              {extension.versions && extension.versions.length > 0 ? (
                extension.versions.map((ver) => (
                  <div key={ver.id} className="relative space-y-2">
                    {/* Circle Node indicator */}
                    <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white dark:bg-zinc-950 border border-neutral-300 dark:border-zinc-700">
                      <span className={`h-1.5 w-1.5 rounded-full ${ver.is_latest ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-400'}`} />
                    </span>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-zinc-100">
                        Version {ver.version}
                      </h4>
                      <span className="text-[10px] text-muted">
                        Released on {new Date(ver.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl border border-neutral-100 dark:border-zinc-900 bg-neutral-50/50 dark:bg-zinc-950/20 leading-relaxed text-muted text-[11px]">
                      {ver.changelog ? (
                        <p className="whitespace-pre-line text-zinc-700 dark:text-zinc-300">{ver.changelog}</p>
                      ) : (
                        <p className="italic">No changelog notes provided for this version.</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted">No historical updates recorded.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
