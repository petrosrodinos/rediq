import type { Post } from "@/features/posts/interfaces/posts.interfaces";

export interface FlairCount {
    flair: string;
    count: number;
}

export const getTopFlairs = (posts: Post[], limit = 5): FlairCount[] => {
    const counts = new Map<string, number>();
    posts.forEach((post) => {
        if (!post.flair) return;
        counts.set(post.flair, (counts.get(post.flair) ?? 0) + 1);
    });
    return Array.from(counts.entries())
        .map(([flair, count]) => ({ flair, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
};

export const getUniqueAuthorCount = (posts: Post[]): number => new Set(posts.map((post) => post.author).filter(Boolean)).size;

export const getMedianScore = (posts: Post[]): number | null => {
    if (!posts.length) return null;
    const scores = [...posts.map((post) => post.score)].sort((a, b) => a - b);
    const mid = Math.floor(scores.length / 2);
    return scores.length % 2 === 0 ? Math.round((scores[mid - 1] + scores[mid]) / 2) : scores[mid];
};

export const getDateRange = (posts: Post[]): { from: Date; to: Date } | null => {
    if (!posts.length) return null;
    const timestamps = posts.map((post) => new Date(post.posted_at).getTime());
    return { from: new Date(Math.min(...timestamps)), to: new Date(Math.max(...timestamps)) };
};

export interface ScoreBucket {
    label: string;
    count: number;
}

export const getScoreDistribution = (posts: Post[]): ScoreBucket[] => {
    const buckets: ScoreBucket[] = [
        { label: "0–9", count: 0 },
        { label: "10–49", count: 0 },
        { label: "50–199", count: 0 },
        { label: "200+", count: 0 },
    ];
    posts.forEach((post) => {
        if (post.score < 10) buckets[0].count += 1;
        else if (post.score < 50) buckets[1].count += 1;
        else if (post.score < 200) buckets[2].count += 1;
        else buckets[3].count += 1;
    });
    return buckets;
};

export interface ContributorCount {
    author: string;
    count: number;
}

export const getTopContributors = (posts: Post[], limit = 5): ContributorCount[] => {
    const counts = new Map<string, number>();
    posts.forEach((post) => {
        if (!post.author) return;
        counts.set(post.author, (counts.get(post.author) ?? 0) + 1);
    });
    return Array.from(counts.entries())
        .map(([author, count]) => ({ author, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
};

export interface MonthlyVolume {
    label: string;
    value: number;
}

export const getMonthlyPostVolume = (posts: Post[], months = 12): MonthlyVolume[] => {
    const now = new Date();
    const buckets: MonthlyVolume[] = Array.from({ length: months }, (_, index) => {
        const date = new Date(now.getFullYear(), now.getMonth() - (months - 1 - index), 1);
        return { label: date.toLocaleDateString("en-US", { month: "short" }), value: 0 };
    });

    posts.forEach((post) => {
        const postedAt = new Date(post.posted_at);
        const monthsAgo = (now.getFullYear() - postedAt.getFullYear()) * 12 + (now.getMonth() - postedAt.getMonth());
        const index = months - 1 - monthsAgo;
        if (index >= 0 && index < months) buckets[index].value += 1;
    });

    return buckets;
};
