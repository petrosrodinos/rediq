export const ExportFormats = {
    JSON: "json",
    MARKDOWN: "markdown",
} as const;

export type ExportFormat = (typeof ExportFormats)[keyof typeof ExportFormats];

export interface ExportQueryType {
    format?: ExportFormat;
}

export interface ExportCitation {
    excerpt: string | null;
    reddit_url: string | null;
}

export interface ExportInsight {
    id: string;
    type: string;
    title: string;
    content: string;
    confidence_score: number | null;
    supporting_count: number;
    citations: ExportCitation[];
}

export interface ExportTopic {
    id: string;
    name: string;
    summary: string | null;
    insights: ExportInsight[];
}

export interface ExportReport {
    project: {
        id: string;
        name: string;
        status: string;
        posts_analyzed: number;
        comments_analyzed: number;
        created_at: string;
        source: unknown;
    };
    topics: ExportTopic[];
    other_insights: ExportInsight[];
}
