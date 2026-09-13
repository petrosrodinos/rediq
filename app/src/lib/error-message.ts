const DEFAULT_FALLBACK = "Something went wrong. Please try again.";

// Internal error text (Prisma query dumps, stack traces, file paths) has leaked into
// user-facing fields before — this is the last line of defense so it can never render,
// no matter what the backend stores.
const INTERNAL_ERROR_PATTERNS = [
    /\bat\s+[\w.$]+\s*\(/, // stack trace frames, e.g. "at Object.<anonymous> ("
    /\bPrismaClient\w*/i,
    /Invalid\s+`[\w.$]+\(\)`/, // "Invalid `this.prisma.x.create()` invocation"
    /[A-Za-z]:\\[\w\\.-]+/, // Windows file paths
    /\/(?:src|node_modules)\//, // Unix-style source paths
    /\.(?:ts|js|tsx|jsx):\d+:\d+/, // file:line:column references
];

export const toSafeErrorMessage = (message?: string | null, fallback: string = DEFAULT_FALLBACK): string => {
    if (!message) return fallback;
    const trimmed = message.trim();
    if (!trimmed) return fallback;
    if (trimmed.length > 240) return fallback;
    if (trimmed.includes("\n")) return fallback;
    if (INTERNAL_ERROR_PATTERNS.some((pattern) => pattern.test(trimmed))) return fallback;
    return trimmed;
};
