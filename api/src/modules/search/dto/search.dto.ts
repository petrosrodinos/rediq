import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

const SEMANTIC_RESULT_TYPES = [
  'post',
  'comment',
  'knowledge_chunk',
  'knowledge_insight',
] as const;

export class SearchDto {
  @ApiProperty({
    description: 'Natural language search query',
    example: 'people complaining about pricing',
  })
  @IsString()
  @MinLength(1)
  query: string;

  @ApiProperty({
    required: false,
    description: 'Maximum number of results',
    example: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;

  @ApiProperty({
    required: false,
    isArray: true,
    enum: SEMANTIC_RESULT_TYPES,
    description: 'Restrict results to these content types',
  })
  @IsOptional()
  @IsArray()
  @IsIn(SEMANTIC_RESULT_TYPES, { each: true })
  types?: ('post' | 'comment' | 'knowledge_chunk' | 'knowledge_insight')[];
}
