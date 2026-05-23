/**
 * Extremely robust and lightweight Markdown parser designed for a developer-focused
 * extension hub. Returns a structured abstract block list for native React rendering.
 * Avoids dangerouslySetInnerHTML and allows styling and copy-button integration.
 */

// Helper to convert inline markdown syntax (bold, italic, code, links) to React-renderable segments
export function parseInline(text) {
  const parts = [];
  let index = 0;

  // Regexes for inline styles
  const inlineRegex = /(\*\*|__)(.*?)\1|(\*|_)(.*?)\3|(`)(.*?)\5|(!\[)(.*?)\]\((.*?)\)|(\[)(.*?)\]\((.*?)\)/g;

  let match;
  while ((match = inlineRegex.exec(text)) !== null) {
    // Add text before match
    if (match.index > index) {
      parts.push({ type: "text", content: text.substring(index, match.index) });
    }

    if (match[2]) {
      // Bold
      parts.push({ type: "bold", content: match[2] });
    } else if (match[4]) {
      // Italic
      parts.push({ type: "italic", content: match[4] });
    } else if (match[6]) {
      // Inline Code
      parts.push({ type: "code", content: match[6] });
    } else if (match[10]) {
      // Link
      parts.push({ type: "link", text: match[11], url: match[12] });
    } else if (match[7]) {
      // Image
      parts.push({ type: "image", alt: match[8], url: match[9] });
    }

    index = inlineRegex.lastIndex;
  }

  if (index < text.length) {
    parts.push({ type: "text", content: text.substring(index) });
  }

  return parts.length > 0 ? parts : [{ type: "text", content: text }];
}

export function parseMarkdown(mdText) {
  if (!mdText) return [];

  const lines = mdText.split(/\r?\n/);
  const blocks = [];
  let currentCodeBlock = null;
  let currentList = null;

  const flushList = () => {
    if (currentList) {
      blocks.push(currentList);
      currentList = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 1. Code Blocks
    if (line.trim().startsWith("```")) {
      if (currentCodeBlock) {
        // End of code block
        blocks.push(currentCodeBlock);
        currentCodeBlock = null;
      } else {
        flushList();
        const lang = line.trim().substring(3).trim().toLowerCase();
        currentCodeBlock = {
          type: "code",
          lang: lang || "txt",
          code: [],
        };
      }
      continue;
    }

    if (currentCodeBlock) {
      currentCodeBlock.code.push(line);
      continue;
    }

    // 2. Horizontal Rules
    if (line.trim() === "---" || line.trim() === "***" || line.trim() === "___") {
      flushList();
      blocks.push({ type: "hr" });
      continue;
    }

    // 3. Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushList();
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      blocks.push({
        type: "heading",
        level,
        text,
        id,
      });
      continue;
    }

    // 4. Blockquotes
    if (line.trim().startsWith(">")) {
      flushList();
      const content = line.substring(line.indexOf(">") + 1).trim();
      blocks.push({
        type: "blockquote",
        content: parseInline(content),
      });
      continue;
    }

    // 5. Lists (Unordered & Ordered)
    const uListMatch = line.match(/^(\s*)[-*+]\s+(.*)$/);
    const oListMatch = line.match(/^(\s*)\d+\.\s+(.*)$/);

    if (uListMatch) {
      const content = uListMatch[2].trim();
      if (!currentList || currentList.ordered) {
        flushList();
        currentList = { type: "list", ordered: false, items: [] };
      }
      currentList.items.push(parseInline(content));
      continue;
    }

    if (oListMatch) {
      const content = oListMatch[2].trim();
      if (!currentList || !currentList.ordered) {
        flushList();
        currentList = { type: "list", ordered: true, items: [] };
      }
      currentList.items.push(parseInline(content));
      continue;
    }

    // Empty Lines
    if (line.trim() === "") {
      flushList();
      continue;
    }

    // 6. Normal Paragraph
    flushList();
    blocks.push({
      type: "paragraph",
      content: parseInline(line.trim()),
    });
  }

  flushList();

  // Map code arrays back to string
  return blocks.map((block) => {
    if (block.type === "code") {
      return {
        ...block,
        code: block.code.join("\n"),
      };
    }
    return block;
  });
}
