import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateAnalysisJobDto {
  @ApiProperty({
    description: 'The analysis configuration to run this job with',
  })
  @IsUUID()
  analysis_configuration_uuid: string;
}
