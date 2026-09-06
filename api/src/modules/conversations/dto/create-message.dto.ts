import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    description: 'The question or message to send to the AI research agent',
    example: 'What are the most common problems people have with this?',
  })
  @IsString()
  @MinLength(1)
  content: string;
}
