import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';

describe('HealthService', () => {
  let service: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthService],
    }).compile();

    service = module.get(HealthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should report ok status with a timestamp and database state', async () => {
    const result = await service.check();

    expect(result.status).toBe('ok');
    expect(result.database).toBe('up');
    expect(new Date(result.timestamp).toString()).not.toBe('Invalid Date');
  });
});
