import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '@opshub/api/auth';
import { HealthService } from './health.service';
import { HealthStatus } from './health-status.dto';

@ApiTags('health')
@Public()
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Report API and database health' })
  @ApiResponse({ status: 200, type: HealthStatus })
  async check(): Promise<HealthStatus> {
    return this.healthService.check();
  }
}
