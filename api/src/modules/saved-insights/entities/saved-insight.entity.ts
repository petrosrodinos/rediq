import { ApiProperty } from '@nestjs/swagger';

export class SavedInsight {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user_uuid: string;

  @ApiProperty()
  research_project_uuid: string;

  @ApiProperty()
  knowledge_insight_uuid: string;

  @ApiProperty({ required: false, nullable: true })
  collection_uuid: string | null;

  @ApiProperty()
  created_at: Date;
}
