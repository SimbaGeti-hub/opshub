import { UsersService } from './users.service';

describe('UsersService', () => {
  it('maps database rows to summaries', async () => {
    const prisma = {
      user: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: '1',
            email: 'admin@opshub.local',
            name: 'Avery Admin',
            role: 'ADMIN',
            status: 'ACTIVE',
            lastActiveAt: new Date('2026-10-26T09:11:35.466Z'),
            department: { name: 'Engineering' },
          },
          {
            id: '2',
            email: 'new@opshub.local',
            name: 'New Person',
            role: 'EMPLOYEE',
            status: 'ACTIVE',
            lastActiveAt: null,
            department: null,
          },
        ]),
      },
    };
    const service = new UsersService(prisma as never);

    await expect(service.list()).resolves.toEqual([
      {
        id: '1',
        email: 'admin@opshub.local',
        name: 'Avery Admin',
        role: 'ADMIN',
        status: 'ACTIVE',
        department: 'Engineering',
        lastActiveAt: '2026-10-26T09:11:35.466Z',
      },
      {
        id: '2',
        email: 'new@opshub.local',
        name: 'New Person',
        role: 'EMPLOYEE',
        status: 'ACTIVE',
        department: null,
        lastActiveAt: null,
      },
    ]);
  });
});
