import { ApiProperty } from '@nestjs/swagger';

export class KnowledgeChunk {
  @ApiProperty()
  id: string;

  @ApiProperty()
  research_project_uuid: string;

  @ApiProperty()
  analysis_job_uuid: string;

  @ApiProperty({ required: false, nullable: true })
  post_uuid?: string | null;

  @ApiProperty({ required: false, nullable: true })
  comment_uuid?: string | null;

  @ApiProperty()
  content: string;

  @ApiProperty({ required: false, nullable: true })
  token_count?: number | null;

  @ApiProperty()
  chunk_index: number;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
