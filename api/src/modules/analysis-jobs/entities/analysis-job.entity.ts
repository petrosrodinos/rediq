import { ApiProperty } from '@nestjs/swagger';
import { AnalysisStatus } from 'generated/prisma';

export class AnalysisJob {
  @ApiProperty()
  id: string;

  @ApiProperty()
  research_project_uuid: string;

  @ApiProperty()
  analysis_configuration_uuid: string;

  @ApiProperty({ enum: AnalysisStatus })
  status: AnalysisStatus;

  @ApiProperty({ required: false, nullable: true })
  current_step: string | null;

  @ApiProperty()
  posts_processed: number;

  @ApiProperty()
  posts_total: number;

  @ApiProperty()
  comments_processed: number;

  @ApiProperty()
  comments_total: number;

  @ApiProperty({ required: false, nullable: true })
  error_message: string | null;

  @ApiProperty({ required: false, nullable: true })
  started_at: Date | null;

  @ApiProperty({ required: false, nullable: true })
  completed_at: Date | null;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
