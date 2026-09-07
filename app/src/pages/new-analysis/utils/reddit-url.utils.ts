export interface ParsedRedditUrl {
    community: string | null;
    isThread: boolean;
}

/**
 * Lightweight client-side parse just to render an optimistic preview and a
 * default project name — the API does the real validation (and community
 * lookup) once the project is created. There's no "detect source" preview
 * endpoint yet (see follow-ups), so this never claims to know post/comment
 * counts or public/private status.
 */
export const parseRedditUrl = (rawUrl: string): ParsedRedditUrl => {
    try {
        const url = new URL(rawUrl);
        const parts = url.pathname.split("/").filter(Boolean);
        const rIndex = parts.findIndex((part) => part === "r");
        if (rIndex === -1 || !parts[rIndex + 1]) {
            return { community: null, isThread: false };
        }
        const community = parts[rIndex + 1];
        const isThread = parts[rIndex + 2] === "comments";
        return { community, isThread };
    } catch {
        return { community: null, isThread: false };
    }
};

export const suggestAnalysisName = (rawUrl: string): string => {
    const { community, isThread } = parseRedditUrl(rawUrl);
    if (!community) return "";
    return isThread ? `r/${community} thread research` : `r/${community} research`;
};
