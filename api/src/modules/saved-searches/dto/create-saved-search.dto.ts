import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { TopTimeRange } from 'generated/prisma';

export class CreateSavedSearchDto {
  @ApiProperty({
    description: 'The search query text to remember',
  })
  @IsString()
  @MinLength(1)
  query: string;

  @ApiProperty({
    required: false,
    nullable: true,
    description:
      'The research project this search is scoped to. Omit or null to search across all projects.',
  })
  @IsOptional()
  @IsString()
  research_project_uuid?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  name?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  min_score?: number | null;

  @ApiProperty({ required: false, nullable: true, enum: TopTimeRange })
  @IsOptional()
  @IsEnum(TopTimeRange)
  time_range?: TopTimeRange | null;
}
