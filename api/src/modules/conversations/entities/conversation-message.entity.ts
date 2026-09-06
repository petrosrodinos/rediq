import { ApiProperty } from '@nestjs/swagger';
import { MessageRole } from 'generated/prisma';

export class ConversationMessage {
  @ApiProperty()
  id: string;

  @ApiProperty()
  conversation_uuid: string;

  @ApiProperty({ enum: MessageRole })
  role: MessageRole;

  @ApiProperty()
  content: string;

  @ApiProperty()
  created_at: Date;
}
