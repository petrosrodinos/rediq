import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateSavedInsightDto {
  @ApiProperty({ description: 'The research project the insight belongs to' })
  @IsString()
  @MinLength(1)
  research_project_uuid: string;

  @ApiProperty({ description: 'The knowledge insight to save' })
  @IsString()
  @MinLength(1)
  knowledge_insight_uuid: string;

  @ApiProperty({
    required: false,
    nullable: true,
    description: 'A collection to file this saved insight under',
  })
  @IsOptional()
  @IsString()
  collection_uuid?: string | null;
}
