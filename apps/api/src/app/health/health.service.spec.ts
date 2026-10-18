import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@opshub/api/prisma';
import { HealthService } from './health.service';

describe('HealthService', () => {
  let service: HealthService;
  let prisma: { $queryRaw: jest.Mock };

  beforeEach(async () => {
    prisma = { $queryRaw: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get(HealthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should report ok status when the database query succeeds', async () => {
    prisma.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

    const result = await service.check();

    expect(result.status).toBe('ok');
    expect(result.database).toBe('up');
    expect(new Date(result.timestamp).toString()).not.toBe('Invalid Date');
  });

  it('should report error status when the database query fails', async () => {
    prisma.$queryRaw.mockRejectedValue(new Error('connection refused'));

    const result = await service.check();

    expect(result.status).toBe('error');
    expect(result.database).toBe('down');
  });
});
