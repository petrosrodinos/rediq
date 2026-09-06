import { ApiProperty } from '@nestjs/swagger';
import { AuthRole } from 'generated/prisma';

export class User {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false, nullable: true })
  phone: string | null;

  @ApiProperty({ enum: AuthRole })
  role: AuthRole;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
