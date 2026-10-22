import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService, type Role } from '@opshub/api/prisma';
import type { AuthenticatedUser } from './authenticated-user';
import type { KeycloakClaims } from './token-verifier.service';

const ROLE_PRECEDENCE: readonly Role[] = ['ADMIN', 'MANAGER', 'EMPLOYEE'];
const ACTIVITY_WINDOW_MS = 5 * 60 * 1000;

export function resolveRole(realmRoles: readonly string[] = []): Role {
  return (
    ROLE_PRECEDENCE.find((role) => realmRoles.includes(role)) ?? 'EMPLOYEE'
  );
}

@Injectable()
export class UserProvisioningService {
  constructor(private readonly prisma: PrismaService) {}

  async provision(claims: KeycloakClaims): Promise<AuthenticatedUser> {
    const keycloakId = claims.sub;
    const email = claims.email;
    if (!keycloakId || !email) {
      throw new UnauthorizedException(
        'Token is missing required identity claims',
      );
    }

    const role = resolveRole(claims.realm_access?.roles);
    const name = claims.name ?? claims.preferred_username ?? email;
    const now = new Date();

    let user =
      (await this.prisma.user.findUnique({ where: { keycloakId } })) ??
      (await this.prisma.user.findUnique({ where: { email } }));

    if (!user) {
      user = await this.createUser(keycloakId, email, name, role, now);
    } else if (
      user.keycloakId !== keycloakId ||
      user.name !== name ||
      user.role !== role ||
      !user.lastActiveAt ||
      now.getTime() - user.lastActiveAt.getTime() > ACTIVITY_WINDOW_MS
    ) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { keycloakId, name, role, lastActiveAt: now },
      });
    }

    if (user.status === 'INACTIVE') {
      throw new ForbiddenException('This account has been deactivated');
    }

    return {
      id: user.id,
      keycloakId: user.keycloakId,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  private async createUser(
    keycloakId: string,
    email: string,
    name: string,
    role: Role,
    now: Date,
  ) {
    try {
      return await this.prisma.user.create({
        data: { keycloakId, email, name, role, lastActiveAt: now },
      });
    } catch (error) {
      if ((error as { code?: string }).code !== 'P2002') {
        throw error;
      }
      // Two first requests raced; load the record the other one created.
      return this.prisma.user.findUniqueOrThrow({ where: { keycloakId } });
    }
  }
}
