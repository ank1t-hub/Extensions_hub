import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getExtension } from "../../services/extensionService.js";
import { fetchDocumentation, saveDocumentation } from "../../services/documentationService.js";
import DocumentationViewer from "../../components/documentation/DocumentationViewer.jsx";

export default function ManageDocumentationPage() {
  const { extensionId } = useParams();
  const navigate = useNavigate();
  const [extension, setExtension] = useState(null);
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [viewMode, setViewMode] = useState("split"); // 'split', 'edit', 'preview'
  const [showTips, setShowTips] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [extData, docData] = await Promise.all([
          getExtension(extensionId),
          fetchDocumentation(extensionId),
        ]);
        setExtension(extData);
        setMarkdown(docData.markdown_content || "");
      } catch (err) {
        setError(err.message || "Failed to load documentation data.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [extensionId]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess(false);
      await saveDocumentation(extensionId, markdown);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Failed to save documentation.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-muted">
        <div className="w-8 h-8 rounded-full border-2 border-t-black dark:border-t-white border-zinc-200 dark:border-zinc-800 animate-spin" />
        <span className="text-sm font-medium">Loading editor...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] w-full">
      {/* Editor Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-border pb-4 mb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted mb-1">
            <Link to="/developer" className="hover:text-black dark:hover:text-white transition-colors">
              Developer Dashboard
            </Link>
            <span>/</span>
            <span>Edit Documentation</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-black dark:text-white">
            {extension?.title || "Extension"} Docs
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Mode Toggles */}
          <div className="flex border border-border rounded-lg p-0.5 bg-zinc-50 dark:bg-zinc-950/20 text-xs">
            <button
              onClick={() => setViewMode("edit")}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                viewMode === "edit"
                  ? "bg-white dark:bg-zinc-800 shadow-sm text-black dark:text-white"
                  : "text-muted hover:text-black dark:hover:text-white"
              }`}
            >
              Write
            </button>
            <button
              onClick={() => setViewMode("split")}
              className={`hidden md:block px-3 py-1.5 rounded-md font-medium transition-all ${
                viewMode === "split"
                  ? "bg-white dark:bg-zinc-800 shadow-sm text-black dark:text-white"
                  : "text-muted hover:text-black dark:hover:text-white"
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode("preview")}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                viewMode === "preview"
                  ? "bg-white dark:bg-zinc-800 shadow-sm text-black dark:text-white"
                  : "text-muted hover:text-black dark:hover:text-white"
              }`}
            >
              Preview
            </button>
          </div>

          {/* Tips Toggle */}
          <button
            onClick={() => setShowTips(!showTips)}
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              showTips
                ? "border-black dark:border-white bg-black dark:bg-white text-white dark:text-black"
                : "border-border text-muted hover:text-black dark:hover:text-white"
            }`}
          >
            Markdown Help
          </button>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black text-xs font-semibold shadow-sm transition-all disabled:opacity-50 min-w-[90px]"
          >
            {saving ? (
              <div className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent border-current animate-spin" />
            ) : success ? (
              "Saved!"
            ) : (
              "Save Docs"
            )}
          </button>
        </div>
      </div>

      {/* Message Alerts */}
      {error && (
        <div className="mb-4 p-3 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 text-xs text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded-lg border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/20 text-xs text-green-600 dark:text-green-400">
          Documentation updated successfully!
        </div>
      )}

      {/* Workspace Panel */}
      <div className="flex flex-1 gap-6 overflow-hidden min-h-0">
        {/* Editor and Preview Split */}
        <div className="flex-1 flex gap-6 h-full overflow-hidden">
          {/* Edit Box */}
          {(viewMode === "edit" || viewMode === "split") && (
            <div className="flex-1 flex flex-col h-full border border-border rounded-xl bg-white dark:bg-zinc-950/20 overflow-hidden shadow-sm">
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="# Getting Started&#10;&#10;Add setup steps, dependencies and documentation guide in Markdown..."
                className="flex-1 w-full p-6 bg-transparent resize-none border-none outline-none font-mono text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 scrollbar-thin focus:ring-0"
              />
              <div className="px-4 py-2 border-t border-border bg-zinc-50 dark:bg-zinc-900/50 flex justify-between items-center text-xs text-muted">
                <span>{markdown.length} characters</span>
                <span>Markdown supported</span>
              </div>
            </div>
          )}

          {/* Preview Box */}
          {(viewMode === "preview" || viewMode === "split") && (
            <div className="flex-1 border border-border rounded-xl bg-white dark:bg-zinc-950/10 p-6 md:p-8 overflow-y-auto scrollbar-thin shadow-sm">
              <DocumentationViewer markdown={markdown} />
            </div>
          )}
        </div>

        {/* Sidebar Help Tips */}
        {showTips && (
          <aside className="hidden lg:block w-72 shrink-0 border border-border rounded-xl bg-zinc-50/50 dark:bg-zinc-950/20 p-5 overflow-y-auto scrollbar-thin text-xs">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mb-4 flex items-center justify-between">
              Markdown Cheat Sheet
            </h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-zinc-700 dark:text-zinc-300 mb-1">Headings</p>
                <code className="block p-2 rounded bg-zinc-100 dark:bg-zinc-900 border border-border font-mono whitespace-pre text-[10px]">
                  # Title (H1)&#10;## Subtitle (H2)&#10;### Section (H3)
                </code>
              </div>

              <div>
                <p className="font-medium text-zinc-700 dark:text-zinc-300 mb-1">Emphasis</p>
                <code className="block p-2 rounded bg-zinc-100 dark:bg-zinc-900 border border-border font-mono whitespace-pre text-[10px]">
                  **bold text**&#10;*italic text*
                </code>
              </div>

              <div>
                <p className="font-medium text-zinc-700 dark:text-zinc-300 mb-1">Lists</p>
                <code className="block p-2 rounded bg-zinc-100 dark:bg-zinc-900 border border-border font-mono whitespace-pre text-[10px]">
                  - Bullet 1&#10;- Bullet 2&#10;&#10;1. Step one&#10;2. Step two
                </code>
              </div>

              <div>
                <p className="font-medium text-zinc-700 dark:text-zinc-300 mb-1">Links & Images</p>
                <code className="block p-2 rounded bg-zinc-100 dark:bg-zinc-900 border border-border font-mono whitespace-pre text-[10px]">
                  [Google](https://google.com)&#10;![Logo](path/to/logo.png)
                </code>
              </div>

              <div>
                <p className="font-medium text-zinc-700 dark:text-zinc-300 mb-1">Code Blocks</p>
                <code className="block p-2 rounded bg-zinc-100 dark:bg-zinc-900 border border-border font-mono whitespace-pre text-[10px]">
                  ```javascript&#10;console.log("Hello World");&#10;```
                </code>
              </div>

              <div>
                <p className="font-medium text-zinc-700 dark:text-zinc-300 mb-1">Quotes</p>
                <code className="block p-2 rounded bg-zinc-100 dark:bg-zinc-900 border border-border font-mono whitespace-pre text-[10px]">
                  &gt; Useful warnings or tips&#10;&gt; go here.
                </code>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
