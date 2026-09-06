import { ApiProperty } from '@nestjs/swagger';

export class Post {
  @ApiProperty()
  id: string;

  @ApiProperty()
  research_project_uuid: string;

  @ApiProperty()
  platform: string;

  @ApiProperty()
  external_id: string;

  @ApiProperty()
  community: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false, nullable: true })
  author?: string | null;

  @ApiProperty({ required: false, nullable: true })
  body?: string | null;

  @ApiProperty()
  url: string;

  @ApiProperty()
  permalink: string;

  @ApiProperty()
  score: number;

  @ApiProperty({ required: false, nullable: true })
  upvote_ratio?: number | null;

  @ApiProperty()
  num_comments: number;

  @ApiProperty({ required: false, nullable: true })
  flair?: string | null;

  @ApiProperty()
  is_nsfw: boolean;

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
