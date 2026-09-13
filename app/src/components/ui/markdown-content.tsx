import type { FC } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

/**
 * Renders Reddit's raw markdown (post selftext / comment bodies) as proper rich text.
 * Only used in unclamped detail views — see `stripMarkdownToText` for clamped card previews.
 */
export const MarkdownContent: FC<MarkdownContentProps> = ({ content, className }) => {
  return (
    <div
      className={cn(
        "space-y-2 text-sm leading-relaxed text-foreground [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ ...props }) => (
            <a {...props} target="_blank" rel="noreferrer" className="font-medium text-primary underline underline-offset-2" />
          ),
          p: ({ ...props }) => <p {...props} className="leading-relaxed" />,
          ul: ({ ...props }) => <ul {...props} className="list-disc space-y-1 pl-5" />,
          ol: ({ ...props }) => <ol {...props} className="list-decimal space-y-1 pl-5" />,
          li: ({ ...props }) => <li {...props} className="leading-relaxed" />,
          blockquote: ({ ...props }) => (
            <blockquote {...props} className="border-l-2 border-primary/50 pl-3 italic text-foreground/80" />
          ),
          code: ({ ...props }) => (
            <code {...props} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em] text-foreground" />
          ),
          pre: ({ ...props }) => (
            <pre {...props} className="overflow-x-auto rounded-lg bg-muted p-3 font-mono text-[0.85em]" />
          ),
          h1: ({ ...props }) => <h1 {...props} className="text-base font-semibold" />,
          h2: ({ ...props }) => <h2 {...props} className="text-sm font-semibold" />,
          h3: ({ ...props }) => <h3 {...props} className="text-sm font-semibold" />,
          hr: ({ ...props }) => <hr {...props} className="border-border" />,
          table: ({ ...props }) => (
            <div className="overflow-x-auto">
              <table {...props} className="w-full border-collapse text-left text-sm" />
            </div>
          ),
          th: ({ ...props }) => <th {...props} className="border border-border px-2 py-1 font-medium" />,
          td: ({ ...props }) => <td {...props} className="border border-border px-2 py-1" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
