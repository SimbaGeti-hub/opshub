import { Injectable, Logger } from '@nestjs/common';
import { HealthStatus } from './health-status.dto';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  async check(): Promise<HealthStatus> {
    const databaseUp = await this.checkDatabase();

    return {
      status: databaseUp ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      database: databaseUp ? 'up' : 'down',
    };
  }

  private async checkDatabase(): Promise<boolean> {
    // Prisma lands in Phase 5; this placeholder reports the database
    // as reachable so the endpoint has a stable shape until the real
    // connectivity check is wired in.
    try {
      return true;
    } catch (error) {
      this.logger.error('Database health check failed', error);
      return false;
    }
  }
}
