import { ApiProperty } from '@nestjs/swagger';
import { TopTimeRange } from 'generated/prisma';

export class SavedSearch {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user_uuid: string;

  @ApiProperty({ required: false, nullable: true })
  research_project_uuid: string | null;

  @ApiProperty({ required: false, nullable: true })
  name: string | null;

  @ApiProperty()
  query: string;

  @ApiProperty({ required: false, nullable: true })
  min_score: number | null;

  @ApiProperty({ required: false, nullable: true, enum: TopTimeRange })
  time_range: TopTimeRange | null;

  @ApiProperty()
  created_at: Date;
}
