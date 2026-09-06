import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { PostSortOrder, ProcessingMode, TopTimeRange } from 'generated/prisma';

export class CreateAnalysisConfigurationDto {
  @ApiProperty({
    required: false,
    enum: ProcessingMode,
    default: ProcessingMode.STANDARD,
  })
  @IsOptional()
  @IsEnum(ProcessingMode)
  processing_mode?: ProcessingMode;

  @ApiProperty({
    required: false,
    enum: PostSortOrder,
    default: PostSortOrder.HOT,
  })
  @IsOptional()
  @IsEnum(PostSortOrder)
  sort_order?: PostSortOrder;

  @ApiProperty({ required: false, enum: TopTimeRange })
  @IsOptional()
  @IsEnum(TopTimeRange)
  top_time_range?: TopTimeRange;

  @ApiProperty({
    required: false,
    description: 'Maximum number of posts to analyze',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  max_posts?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  max_comments_per_post?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  max_comments?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  max_comment_depth?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  min_post_score?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  min_comment_score?: number;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  include_replies?: boolean;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  include_nsfw?: boolean;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  include_controversial?: boolean;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  analyze_deleted_when_unavailable?: boolean;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  prioritize_engagement?: boolean;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  prioritize_recent?: boolean;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  prioritize_popular?: boolean;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  prioritize_top_comments?: boolean;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  analyze_entire_discussion?: boolean;
}
