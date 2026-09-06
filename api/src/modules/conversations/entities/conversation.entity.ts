import { ApiProperty } from '@nestjs/swagger';
import { ConversationMode } from 'generated/prisma';

export class Conversation {
  @ApiProperty()
  id: string;

  @ApiProperty()
  research_project_uuid: string;

  @ApiProperty()
  user_uuid: string;

  @ApiProperty({ required: false, nullable: true })
  title: string | null;

  @ApiProperty({ enum: ConversationMode })
  mode: ConversationMode;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
