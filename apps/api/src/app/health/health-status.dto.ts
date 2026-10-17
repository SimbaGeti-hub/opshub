import { ApiProperty } from '@nestjs/swagger';

export class HealthStatus {
  @ApiProperty({ example: 'ok', enum: ['ok', 'error'] })
  status!: 'ok' | 'error';

  @ApiProperty({ example: '2026-10-17T15:25:23.000Z' })
  timestamp!: string;

  @ApiProperty({ example: 'up', enum: ['up', 'down'] })
  database!: 'up' | 'down';
}
