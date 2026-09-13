/**
 * Reddit post/comment bodies come from the Reddit API as raw markdown. Card previews are
 * plain-text and line-clamped, so instead of rendering markdown blocks into a clamped area
 * (which `line-clamp` can't reliably measure), we strip the syntax down to readable plain text.
 * Full rendering (headings, links, lists, quotes, etc.) happens via `MarkdownContent` in
 * unclamped detail views.
 */
export const stripMarkdownToText = (markdown: string): string => {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]*)\)/g, "$1")
    .replace(/^[ \t]*\|?[ \t]*:?-+:?[ \t]*(\|[ \t]*:?-+:?[ \t]*)+\|?[ \t]*$/gm, "")
    .replace(/^[ \t]*\|(.+)\|[ \t]*$/gm, (_, row: string) =>
      row
        .split("|")
        .map((cell) => cell.trim())
        .filter(Boolean)
        .join(" · "),
    )
    .replace(/^>\s?/gm, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/~~(.*?)~~/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x200B;/gi, "")
    .replace(/\|/g, " ")
    .replace(/\s*\n\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
};
