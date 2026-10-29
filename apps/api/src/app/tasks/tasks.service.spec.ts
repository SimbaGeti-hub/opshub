import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import type { AuthenticatedUser } from '@opshub/api/auth';
import type { CreateTaskDto } from './dto/create-task.dto';
import type { ListTasksQuery } from './dto/list-tasks-query.dto';
import { TasksService } from './tasks.service';

const person = (
  role: AuthenticatedUser['role'],
  id: string,
): AuthenticatedUser => ({
  id,
  keycloakId: `kc-${id}`,
  email: `${id}@opshub.local`,
  name: id,
  role,
});

const admin = person('ADMIN', 'admin1');
const manager = person('MANAGER', 'mgr1');
const employee = person('EMPLOYEE', 'emp1');

const query = (overrides: Partial<ListTasksQuery> = {}): ListTasksQuery =>
  ({
    page: 1,
    pageSize: 20,
    sortBy: 'createdAt',
    sortDir: 'desc',
    ...overrides,
  }) as ListTasksQuery;

const row = (overrides: Record<string, unknown> = {}) => ({
  id: 't1',
  title: 'Task',
  description: null,
  status: 'TODO',
  priority: 'MEDIUM',
  dueDate: null,
  createdAt: new Date('2026-10-01T08:00:00.000Z'),
  updatedAt: new Date('2026-10-02T08:00:00.000Z'),
  assignee: { id: 'emp1', name: 'Ellis' },
  createdBy: { id: 'mgr1', name: 'Morgan' },
  department: null,
  ...overrides,
});

function setup() {
  const prisma = {
    task: {
      findMany: jest.fn().mockResolvedValue([]),
      count: jest.fn().mockResolvedValue(0),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    user: { findUnique: jest.fn() },
    department: { findUnique: jest.fn() },
    $transaction: jest.fn((operations: Promise<unknown>[]) =>
      Promise.all(operations),
    ),
  };
  return { prisma, service: new TasksService(prisma as never) };
}

describe('TasksService', () => {
  describe('list visibility', () => {
    it('limits employees to tasks assigned to them', async () => {
      const { prisma, service } = setup();

      await service.list(employee, query());

      expect(prisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { AND: [{ assigneeId: 'emp1' }, {}] },
        }),
      );
    });

    it('limits managers to their own, created and team tasks', async () => {
      const { prisma, service } = setup();

      await service.list(manager, query());

      expect(prisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            AND: [
              {
                OR: [
                  { assigneeId: 'mgr1' },
                  { createdById: 'mgr1' },
                  { assignee: { managerId: 'mgr1' } },
                ],
              },
              {},
            ],
          },
        }),
      );
    });

    it('does not restrict administrators', async () => {
      const { prisma, service } = setup();

      await service.list(admin, query());

      expect(prisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { AND: [{}, {}] } }),
      );
    });
  });

  describe('list filtering and paging', () => {
    it('applies filters, search and the page window', async () => {
      const { prisma, service } = setup();

      await service.list(
        admin,
        query({ status: 'BLOCKED', search: 'bug', page: 3, pageSize: 10 }),
      );

      expect(prisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            AND: [
              {},
              {
                status: 'BLOCKED',
                OR: [
                  { title: { contains: 'bug', mode: 'insensitive' } },
                  { description: { contains: 'bug', mode: 'insensitive' } },
                ],
              },
            ],
          },
          skip: 20,
          take: 10,
        }),
      );
    });

    it('reports totals and the number of pages', async () => {
      const { prisma, service } = setup();
      prisma.task.findMany.mockResolvedValue([row()]);
      prisma.task.count.mockResolvedValue(45);

      const result = await service.list(admin, query({ pageSize: 20 }));

      expect(result.meta).toEqual({
        page: 1,
        pageSize: 20,
        total: 45,
        totalPages: 3,
      });
      expect(result.data[0]).toMatchObject({
        id: 't1',
        createdAt: '2026-10-01T08:00:00.000Z',
        dueDate: null,
      });
    });
  });

  describe('single task access', () => {
    it('returns 404 when an employee asks for a task that is not theirs', async () => {
      const { prisma, service } = setup();
      prisma.task.findFirst.mockResolvedValue(null);

      await expect(service.get(employee, 't9')).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.task.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { AND: [{ id: 't9' }, { assigneeId: 'emp1' }] },
        }),
      );
    });

    it('never deletes a task the caller cannot see', async () => {
      const { prisma, service } = setup();
      prisma.task.findFirst.mockResolvedValue(null);

      await expect(service.remove(manager, 't9')).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.task.delete).not.toHaveBeenCalled();
    });

    it('changes the status of a visible task', async () => {
      const { prisma, service } = setup();
      prisma.task.findFirst.mockResolvedValue(row());
      prisma.task.update.mockResolvedValue(row({ status: 'COMPLETED' }));

      const result = await service.updateStatus(employee, 't1', 'COMPLETED');

      expect(prisma.task.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 't1' },
          data: { status: 'COMPLETED' },
        }),
      );
      expect(result.status).toBe('COMPLETED');
    });
  });

  describe('creating and assigning', () => {
    const dto = (overrides: Partial<CreateTaskDto> = {}): CreateTaskDto =>
      ({ title: 'Fix login', ...overrides }) as CreateTaskDto;

    it('lets a manager assign to a direct report', async () => {
      const { prisma, service } = setup();
      prisma.user.findUnique.mockResolvedValue({
        id: 'rep1',
        status: 'ACTIVE',
        managerId: 'mgr1',
        departmentId: 'dep1',
      });
      prisma.task.create.mockResolvedValue(row());

      await service.create(manager, dto({ assigneeId: 'rep1' }));

      expect(prisma.task.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: 'Fix login',
            priority: 'MEDIUM',
            createdById: 'mgr1',
            assigneeId: 'rep1',
            departmentId: 'dep1',
          }),
        }),
      );
    });

    it('stops a manager assigning to someone outside the team', async () => {
      const { prisma, service } = setup();
      prisma.user.findUnique.mockResolvedValue({
        id: 'stranger',
        status: 'ACTIVE',
        managerId: 'someone-else',
        departmentId: null,
      });

      await expect(
        service.create(manager, dto({ assigneeId: 'stranger' })),
      ).rejects.toThrow(ForbiddenException);
      expect(prisma.task.create).not.toHaveBeenCalled();
    });

    it('lets an administrator assign to anyone active', async () => {
      const { prisma, service } = setup();
      prisma.user.findUnique.mockResolvedValue({
        id: 'stranger',
        status: 'ACTIVE',
        managerId: 'someone-else',
        departmentId: null,
      });
      prisma.task.create.mockResolvedValue(row());

      await expect(
        service.create(admin, dto({ assigneeId: 'stranger' })),
      ).resolves.toBeDefined();
    });

    it('rejects an inactive or unknown assignee', async () => {
      const { prisma, service } = setup();
      prisma.user.findUnique.mockResolvedValue({
        id: 'gone',
        status: 'INACTIVE',
        managerId: null,
        departmentId: null,
      });

      await expect(
        service.create(admin, dto({ assigneeId: 'gone' })),
      ).rejects.toThrow(BadRequestException);
    });

    it('refuses assignment from a role without the assign permission', async () => {
      const { prisma, service } = setup();

      await expect(
        service.create(employee, dto({ assigneeId: 'emp1' })),
      ).rejects.toThrow(ForbiddenException);
      expect(prisma.user.findUnique).not.toHaveBeenCalled();
    });

    it('rejects an unknown department', async () => {
      const { prisma, service } = setup();
      prisma.department.findUnique.mockResolvedValue(null);

      await expect(
        service.create(admin, dto({ departmentId: 'nope' })),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
