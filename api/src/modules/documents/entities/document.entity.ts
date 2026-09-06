import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from 'generated/prisma';

export class Document {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user_uuid: string;

  @ApiProperty()
  filename: string;

  @ApiProperty()
  mimetype: string;

  @ApiProperty()
  size: number;

  @ApiProperty()
  url: string;

  @ApiProperty()
  path: string;

  @ApiProperty({
    enum: [
      'LOGO',
      'BANNER',
      'IMAGE',
      'VIDEO',
      'AUDIO',
      'PDF',
      'DOCUMENT',
      'OTHER',
    ],
  })
  type: DocumentType;

  @ApiProperty()
  created_at: Date;
}
