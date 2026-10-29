import { ApiProperty } from '@nestjs/swagger';
import type { Role } from '@opshub/shared/models';

export class UserSummary {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ enum: ['ADMIN', 'MANAGER', 'EMPLOYEE'] })
  role!: Role;

  @ApiProperty({ enum: ['ACTIVE', 'INACTIVE'] })
  status!: 'ACTIVE' | 'INACTIVE';

  @ApiProperty({ type: String, nullable: true })
  department!: string | null;

  @ApiProperty({ type: String, nullable: true })
  lastActiveAt!: string | null;
}
