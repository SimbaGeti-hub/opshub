import { ApiProperty } from '@nestjs/swagger';

export class CurrentUserResponse {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ enum: ['ADMIN', 'MANAGER', 'EMPLOYEE'] })
  role!: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
}
