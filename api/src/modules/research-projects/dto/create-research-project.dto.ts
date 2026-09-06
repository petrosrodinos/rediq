import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateAnalysisConfigurationDto } from '@/modules/analysis-configurations/dto/create-analysis-configuration.dto';

export class CreateResearchProjectDto {
  @ApiProperty({
    description: 'Display name for the research project',
    example: 'Startup Research',
  })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({
    description: 'A subreddit URL or a specific Reddit post URL',
    example: 'https://www.reddit.com/r/startups/',
  })
  @IsUrl()
  url: string;

  @ApiProperty({ required: false, type: CreateAnalysisConfigurationDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAnalysisConfigurationDto)
  configuration?: CreateAnalysisConfigurationDto;
}
