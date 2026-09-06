import { ApiProperty } from '@nestjs/swagger';

export class Topic {
  @ApiProperty()
  id: string;

  @ApiProperty()
  research_project_uuid: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false, nullable: true })
  summary?: string | null;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
