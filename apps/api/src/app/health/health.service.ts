import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@opshub/api/prisma';
import { HealthStatus } from './health-status.dto';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(private readonly prisma: PrismaService) {}

  async check(): Promise<HealthStatus> {
    const databaseUp = await this.checkDatabase();

    return {
      status: databaseUp ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      database: databaseUp ? 'up' : 'down',
    };
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.logger.error('Database health check failed', error);
      return false;
    }
  }
}
