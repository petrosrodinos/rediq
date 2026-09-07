import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSavedInsightDto {
  @ApiProperty({
    required: false,
    nullable: true,
    description: 'Move this saved insight into a collection, or null to clear it',
  })
  @IsOptional()
  @IsString()
  collection_uuid?: string | null;
}
