import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateSavedInsightCollectionDto {
  @ApiProperty({ description: 'The new name for the collection' })
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  name: string;
}
