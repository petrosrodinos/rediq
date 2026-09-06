import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateSavedInsightDto {
  @ApiProperty({ description: 'The research project the insight belongs to' })
  @IsString()
  @MinLength(1)
  research_project_uuid: string;

  @ApiProperty({ description: 'The knowledge insight to save' })
  @IsString()
  @MinLength(1)
  knowledge_insight_uuid: string;
}
