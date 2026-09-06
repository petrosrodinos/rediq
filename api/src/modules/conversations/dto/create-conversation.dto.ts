import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ConversationMode } from 'generated/prisma';

export class CreateConversationDto {
  @ApiProperty({
    required: false,
    description: 'Conversation title',
    example: 'Startup pricing research',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @ApiProperty({
    required: false,
    enum: ConversationMode,
    default: ConversationMode.GROUNDED,
    description:
      'GROUNDED restricts answers to the analyzed Reddit dataset; EXTERNAL_ALLOWED lets the assistant also use general knowledge',
  })
  @IsOptional()
  @IsEnum(ConversationMode)
  mode?: ConversationMode;
}
