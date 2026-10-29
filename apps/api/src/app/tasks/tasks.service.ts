import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { AuthenticatedUser } from '@opshub/api/auth';
import { Prisma, PrismaService } from '@opshub/api/prisma';
import {
  hasPermission,
  type Paginated,
  type TaskItem,
  type TaskStatus,
} from '@opshub/shared/models';
import type { CreateTaskDto } from './dto/create-task.dto';
import type { ListTasksQuery } from './dto/list-tasks-query.dto';
import type { UpdateTaskDto } from './dto/update-task.dto';
import { visibleTasksWhere } from './task-scope';

const TASK_INCLUDE = {
  assignee: { select: { id: true, name: true } },
  createdBy: { select: { id: true, name: true } },
  department: { select: { id: true, name: true } },
} satisfies Prisma.TaskInclude;

type TaskRow = Prisma.TaskGetPayload<{ include: typeof TASK_INCLUDE }>;

export function toTaskItem(row: TaskRow): TaskItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    dueDate: row.dueDate?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    assignee: row.assignee,
    createdBy: row.createdBy,
    department: row.department,
  };
}

function buildFilters(query: ListTasksQuery): Prisma.TaskWhereInput {
  const where: Prisma.TaskWhereInput = {};

  if (query.status) where.status = query.status;
  if (query.priority) where.priority = query.priority;
  if (query.assigneeId) where.assigneeId = query.assigneeId;
  if (query.departmentId) where.departmentId = query.departmentId;

  const search = query.search?.trim();
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  return where;
}

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async list(
    user: AuthenticatedUser,
    query: ListTasksQuery,
  ): Promise<Paginated<TaskItem>> {
    const where: Prisma.TaskWhereInput = {
      AND: [visibleTasksWhere(user), buildFilters(query)],
    };

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where,
        include: TASK_INCLUDE,
        // The id tie breaker keeps page boundaries stable between requests.
        orderBy: [
          {
            [query.sortBy]: query.sortDir,
          } as Prisma.TaskOrderByWithRelationInput,
          { id: 'asc' },
        ],
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      data: rows.map(toTaskItem),
      meta: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.pageSize)),
      },
    };
  }

  async get(user: AuthenticatedUser, id: string): Promise<TaskItem> {
    return toTaskItem(await this.findVisibleOrThrow(user, id));
  }

  async create(user: AuthenticatedUser, dto: CreateTaskDto): Promise<TaskItem> {
    const assignee = dto.assigneeId
      ? await this.resolveAssignee(user, dto.assigneeId)
      : null;
    if (dto.departmentId) {
      await this.assertDepartmentExists(dto.departmentId);
    }

    const row = await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description ?? null,
        priority: dto.priority ?? 'MEDIUM',
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        createdById: user.id,
        assigneeId: assignee?.id ?? null,
        departmentId: dto.departmentId ?? assignee?.departmentId ?? null,
      },
      include: TASK_INCLUDE,
    });

    return toTaskItem(row);
  }

  async update(
    user: AuthenticatedUser,
    id: string,
    dto: UpdateTaskDto,
  ): Promise<TaskItem> {
    await this.findVisibleOrThrow(user, id);

    const data: Prisma.TaskUncheckedUpdateInput = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.priority !== undefined) data.priority = dto.priority;
    if (dto.dueDate !== undefined) {
      data.dueDate = dto.dueDate === null ? null : new Date(dto.dueDate);
    }
    if (dto.assigneeId !== undefined) {
      data.assigneeId =
        dto.assigneeId === null
          ? null
          : (await this.resolveAssignee(user, dto.assigneeId)).id;
    }
    if (dto.departmentId !== undefined) {
      if (dto.departmentId !== null) {
        await this.assertDepartmentExists(dto.departmentId);
      }
      data.departmentId = dto.departmentId;
    }

    const row = await this.prisma.task.update({
      where: { id },
      data,
      include: TASK_INCLUDE,
    });
    return toTaskItem(row);
  }

  async updateStatus(
    user: AuthenticatedUser,
    id: string,
    status: TaskStatus,
  ): Promise<TaskItem> {
    await this.findVisibleOrThrow(user, id);

    const row = await this.prisma.task.update({
      where: { id },
      data: { status },
      include: TASK_INCLUDE,
    });
    return toTaskItem(row);
  }

  async remove(user: AuthenticatedUser, id: string): Promise<void> {
    await this.findVisibleOrThrow(user, id);
    await this.prisma.task.delete({ where: { id } });
  }

  private async findVisibleOrThrow(
    user: AuthenticatedUser,
    id: string,
  ): Promise<TaskRow> {
    const row = await this.prisma.task.findFirst({
      where: { AND: [{ id }, visibleTasksWhere(user)] },
      include: TASK_INCLUDE,
    });
    if (!row) {
      // A task the caller may not see looks the same as one that does not exist.
      throw new NotFoundException('Task not found');
    }
    return row;
  }

  private async resolveAssignee(user: AuthenticatedUser, assigneeId: string) {
    if (!hasPermission(user.role, 'tasks:assign')) {
      throw new ForbiddenException(
        'You do not have permission to assign tasks',
      );
    }

    const assignee = await this.prisma.user.findUnique({
      where: { id: assigneeId },
      select: { id: true, status: true, managerId: true, departmentId: true },
    });
    if (!assignee || assignee.status !== 'ACTIVE') {
      throw new BadRequestException('The selected assignee is not available');
    }

    const onTeam = assignee.id === user.id || assignee.managerId === user.id;
    if (user.role === 'MANAGER' && !onTeam) {
      throw new ForbiddenException(
        'You can only assign tasks to yourself or your team',
      );
    }

    return assignee;
  }

  private async assertDepartmentExists(departmentId: string): Promise<void> {
    const department = await this.prisma.department.findUnique({
      where: { id: departmentId },
      select: { id: true },
    });
    if (!department) {
      throw new BadRequestException('The selected department does not exist');
    }
  }
}
