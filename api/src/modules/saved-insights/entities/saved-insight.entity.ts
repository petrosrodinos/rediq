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

  @ApiProperty()
  created_at: Date;
}
