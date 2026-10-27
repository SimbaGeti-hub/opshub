import { Injectable } from '@nestjs/common';
import { PrismaService } from '@opshub/api/prisma';
import type { UserSummary } from './user-summary.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<UserSummary[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { email: 'asc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        lastActiveAt: true,
        department: { select: { name: true } },
      },
    });

    return users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      department: user.department?.name ?? null,
      lastActiveAt: user.lastActiveAt?.toISOString() ?? null,
    }));
  }
}
