import type { AuthenticatedUser } from '@opshub/api/auth';
import type { Prisma } from '@opshub/api/prisma';

/**
 * The rows of the tasks table the caller is allowed to see. Every query for
 * tasks must include this, whatever else it filters on.
 */
export function visibleTasksWhere(
  user: AuthenticatedUser,
): Prisma.TaskWhereInput {
  switch (user.role) {
    case 'ADMIN':
      return {};
    case 'MANAGER':
      return {
        OR: [
          { assigneeId: user.id },
          { createdById: user.id },
          { assignee: { managerId: user.id } },
        ],
      };
    default:
      return { assigneeId: user.id };
  }
}
