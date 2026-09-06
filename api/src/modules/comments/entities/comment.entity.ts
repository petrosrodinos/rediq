import { ApiProperty } from '@nestjs/swagger';

export class Comment {
  @ApiProperty()
  id: string;

  @ApiProperty()
  research_project_uuid: string;

  @ApiProperty()
  post_uuid: string;

  @ApiProperty()
  external_id: string;

  @ApiProperty({ required: false, nullable: true })
  parent_external_id?: string | null;

  @ApiProperty({ required: false, nullable: true })
  parent_comment_uuid?: string | null;

  @ApiProperty({ required: false, nullable: true })
  author?: string | null;

  @ApiProperty({ required: false, nullable: true })
  body?: string | null;

  @ApiProperty()
  score: number;

  @ApiProperty()
  depth: number;

  @ApiProperty()
  permalink: string;

  @ApiProperty()
  is_deleted: boolean;

  @ApiProperty()
  is_removed: boolean;

  @ApiProperty()
  posted_at: Date;

  @ApiProperty()
  fetched_at: Date;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
