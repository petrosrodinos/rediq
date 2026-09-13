import { useEffect, useState } from "react";

/**
 * Cycles through `phrases` every `intervalMs`. Keyed on `activeKey` (not the
 * phrases array) so it doesn't reset every render when callers pass a fresh
 * inline array.
 */
export const useCyclingLabel = (phrases: string[], activeKey: string, intervalMs = 2600): string => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        setIndex(0);
        if (phrases.length <= 1) return;
        const id = setInterval(() => setIndex((i) => (i + 1) % phrases.length), intervalMs);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeKey, intervalMs]);

    return phrases[index % phrases.length] ?? "";
};
