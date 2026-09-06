import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import {
  ExportCitation,
  ExportInsight,
  ExportReport,
  ExportTopic,
} from './interfaces/export.interface';

const REDDIT_BASE_URL = 'https://www.reddit.com';

@Injectable()
export class ExportService {
  constructor(private readonly prisma: PrismaService) {}

  private toRedditUrl(permalink: string | null | undefined): string | null {
    if (!permalink) return null;
    return permalink.startsWith('http')
      ? permalink
      : `${REDDIT_BASE_URL}${permalink}`;
  }

  private mapCitations(
    citations: {
      excerpt: string | null;
      post?: { permalink: string } | null;
      comment?: { permalink: string } | null;
    }[],
  ): ExportCitation[] {
    return citations.map((citation) => ({
      excerpt: citation.excerpt,
      reddit_url: this.toRedditUrl(
        citation.post?.permalink ?? citation.comment?.permalink,
      ),
    }));
  }

  private mapInsight(insight: {
    id: string;
    type: string;
    title: string;
    content: string;
    confidence_score: number | null;
    supporting_count: number;
    citations: {
      excerpt: string | null;
      post?: { permalink: string } | null;
      comment?: { permalink: string } | null;
    }[];
  }): ExportInsight {
    return {
      id: insight.id,
      type: insight.type,
      title: insight.title,
      content: insight.content,
      confidence_score: insight.confidence_score,
      supporting_count: insight.supporting_count,
      citations: this.mapCitations(insight.citations),
    };
  }

  async buildReport(
    userId: string,
    researchProjectId: string,
  ): Promise<ExportReport> {
    const project = await this.prisma.researchProject.findFirst({
      where: { id: researchProjectId, user_uuid: userId },
      include: { source: true },
    });

    if (!project) throw new NotFoundException('Research project not found');

    const [topics, otherInsights] = await Promise.all([
      this.prisma.topic.findMany({
        where: { research_project_uuid: researchProjectId },
        include: {
          knowledge_insights: {
            include: { citations: { include: { post: true, comment: true } } },
          },
        },
        orderBy: { created_at: 'asc' },
      }),
      this.prisma.knowledgeInsight.findMany({
        where: { research_project_uuid: researchProjectId, topic_uuid: null },
        include: { citations: { include: { post: true, comment: true } } },
        orderBy: { supporting_count: 'desc' },
      }),
    ]);

    const mappedTopics: ExportTopic[] = topics.map((topic) => ({
      id: topic.id,
      name: topic.name,
      summary: topic.summary,
      insights: topic.knowledge_insights.map((insight) =>
        this.mapInsight(insight),
      ),
    }));

    return {
      project: {
        id: project.id,
        name: project.name,
        status: project.status,
        posts_analyzed: project.posts_analyzed,
        comments_analyzed: project.comments_analyzed,
        created_at: project.created_at,
        source: project.source,
      },
      topics: mappedTopics,
      other_insights: otherInsights.map((insight) => this.mapInsight(insight)),
    };
  }

  async toJson(
    userId: string,
    researchProjectId: string,
  ): Promise<ExportReport> {
    return this.buildReport(userId, researchProjectId);
  }

  async toMarkdown(userId: string, researchProjectId: string): Promise<string> {
    const report = await this.buildReport(userId, researchProjectId);

    const lines: string[] = [];

    lines.push(`# ${report.project.name}`);
    lines.push('');
    lines.push(
      `**Status:** ${report.project.status} · **Posts analyzed:** ${report.project.posts_analyzed} · **Comments analyzed:** ${report.project.comments_analyzed} · **Created:** ${report.project.created_at.toISOString()}`,
    );
    lines.push('');

    const renderInsight = (insight: ExportInsight) => {
      lines.push(`### ${insight.title}`);
      lines.push('');
      lines.push(insight.content);
      lines.push('');
      if (insight.confidence_score !== null) {
        lines.push(
          `**Confidence:** ${Math.round(insight.confidence_score * 100)}%`,
        );
        lines.push('');
      }
      lines.push(`**Supported by ${insight.supporting_count} discussions**`);
      lines.push('');
      if (insight.citations.length) {
        lines.push('**Sources:**');
        for (const citation of insight.citations) {
          if (citation.reddit_url) {
            lines.push(`- ${citation.reddit_url}`);
          }
        }
        lines.push('');
      }
    };

    for (const topic of report.topics) {
      lines.push(`## ${topic.name}`);
      lines.push('');
      if (topic.summary) {
        lines.push(topic.summary);
        lines.push('');
      }
      for (const insight of topic.insights) {
        renderInsight(insight);
      }
    }

    if (report.other_insights.length) {
      lines.push('## Other Insights');
      lines.push('');
      for (const insight of report.other_insights) {
        renderInsight(insight);
      }
    }

    return lines.join('\n');
  }
}
