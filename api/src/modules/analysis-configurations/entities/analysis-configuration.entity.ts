import { ApiProperty } from '@nestjs/swagger';
import { PostSortOrder, ProcessingMode, TopTimeRange } from 'generated/prisma';

export class AnalysisConfiguration {
  @ApiProperty()
  id: string;

  @ApiProperty()
  research_project_uuid: string;

  @ApiProperty({ enum: ProcessingMode })
  processing_mode: ProcessingMode;

  @ApiProperty({ enum: PostSortOrder })
  sort_order: PostSortOrder;

  @ApiProperty({ enum: TopTimeRange, required: false, nullable: true })
  top_time_range: TopTimeRange | null;

  @ApiProperty({ required: false, nullable: true })
  max_posts: number | null;

  @ApiProperty({ required: false, nullable: true })
  max_comments_per_post: number | null;

  @ApiProperty({ required: false, nullable: true })
  max_comments: number | null;

  @ApiProperty({ required: false, nullable: true })
  max_comment_depth: number | null;

  @ApiProperty({ required: false, nullable: true })
  min_post_score: number | null;

  @ApiProperty({ required: false, nullable: true })
  min_comment_score: number | null;

  @ApiProperty()
  include_replies: boolean;

  @ApiProperty()
  include_nsfw: boolean;

  @ApiProperty()
  include_controversial: boolean;

  @ApiProperty()
  analyze_deleted_when_unavailable: boolean;

  @ApiProperty()
  prioritize_engagement: boolean;

  @ApiProperty()
  prioritize_recent: boolean;

  @ApiProperty()
  prioritize_popular: boolean;

  @ApiProperty()
  prioritize_top_comments: boolean;

  @ApiProperty()
  analyze_entire_discussion: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
