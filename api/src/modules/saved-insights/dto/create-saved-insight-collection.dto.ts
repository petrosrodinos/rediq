import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateSavedInsightCollectionDto {
  @ApiProperty({ description: 'A name to group saved insights under, e.g. "Pricing"' })
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  name: string;
}
