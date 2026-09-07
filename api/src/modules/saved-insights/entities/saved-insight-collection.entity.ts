import { ApiProperty } from '@nestjs/swagger';

export class SavedInsightCollection {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user_uuid: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false, description: 'Number of insights saved in this collection' })
  saved_insight_count?: number;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
