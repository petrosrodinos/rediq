import { ApiProperty } from '@nestjs/swagger';
import { JobEventLevel } from 'generated/prisma';

export class JobEvent {
  @ApiProperty()
  id: string;

  @ApiProperty()
  analysis_job_uuid: string;

  @ApiProperty()
  step: string;

  @ApiProperty()
  message: string;

  @ApiProperty({ enum: JobEventLevel })
  level: JobEventLevel;

  @ApiProperty({ required: false, nullable: true })
  metadata?: Record<string, any> | null;

  @ApiProperty()
  created_at: Date;
}
