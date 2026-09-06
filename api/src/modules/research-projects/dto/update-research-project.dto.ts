import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdateResearchProjectDto {
  @ApiProperty({ description: 'New display name for the research project' })
  @IsString()
  @MinLength(1)
  name: string;
}
