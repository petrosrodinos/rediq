import { ApiProperty } from '@nestjs/swagger';
import { SentimentLabel } from 'generated/prisma';

export class KnowledgeInsight {
  @ApiProperty()
  id: string;

  @ApiProperty()
  research_project_uuid: string;

  @ApiProperty({ required: false, nullable: true })
  analysis_job_uuid?: string | null;

  @ApiProperty({ required: false, nullable: true })
  topic_uuid?: string | null;

  @ApiProperty()
  type: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ required: false, nullable: true })
  confidence_score?: number | null;

  @ApiProperty()
  supporting_count: number;

  @ApiProperty({ required: false, nullable: true, enum: SentimentLabel })
  sentiment?: SentimentLabel | null;

  @ApiProperty({ required: false, nullable: true })
  sentiment_score?: number | null;

  @ApiProperty({ required: false, nullable: true })
  metadata?: Record<string, any> | null;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
