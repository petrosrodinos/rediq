import { ApiProperty } from '@nestjs/swagger';
import { BatchSubmissionStatus } from 'generated/prisma';

export class BatchSubmission {
  @ApiProperty()
  id: string;

  @ApiProperty()
  analysis_job_uuid: string;

  @ApiProperty()
  openai_batch_id: string;

  @ApiProperty({ enum: BatchSubmissionStatus })
  status: BatchSubmissionStatus;

  @ApiProperty({ required: false, nullable: true })
  request_file_id: string | null;

  @ApiProperty({ required: false, nullable: true })
  response_file_id: string | null;

  @ApiProperty({ required: false, nullable: true })
  error_file_id: string | null;

  @ApiProperty({ required: false, nullable: true })
  submitted_at: Date | null;

  @ApiProperty({ required: false, nullable: true })
  completed_at: Date | null;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
