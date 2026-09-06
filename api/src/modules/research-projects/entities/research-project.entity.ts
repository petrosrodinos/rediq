import { ApiProperty } from '@nestjs/swagger';
import { AnalysisStatus } from 'generated/prisma';

export class ResearchProject {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user_uuid: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: AnalysisStatus })
  status: AnalysisStatus;

  @ApiProperty()
  posts_analyzed: number;

  @ApiProperty()
  comments_analyzed: number;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
