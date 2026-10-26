import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import type {
  AuthenticatedRequest,
  AuthenticatedUser,
} from './authenticated-user';
import { JwtAuthGuard } from './jwt-auth.guard';

jest.mock('jose', () => ({
  createRemoteJWKSet: jest.fn(),
  jwtVerify: jest.fn(),
}));

// @nestjs/config ships ESM only, which Jest cannot parse; the guard never uses it directly.
jest.mock('@nestjs/config', () => ({ ConfigService: class ConfigService {} }));

describe('JwtAuthGuard', () => {
  const user: AuthenticatedUser = {
    id: 'user-1',
    keycloakId: 'kc-1',
    email: 'admin@opshub.local',
    name: 'Avery Admin',
    role: 'ADMIN',
  };

  let reflector: { getAllAndOverride: jest.Mock };
  let verifier: { verify: jest.Mock };
  let provisioning: { provision: jest.Mock };
  let guard: JwtAuthGuard;

  const contextFor = (request: AuthenticatedRequest) =>
    ({
      getHandler: () => undefined,
      getClass: () => undefined,
      switchToHttp: () => ({ getRequest: () => request }),
    }) as unknown as ExecutionContext;

  beforeEach(() => {
    reflector = { getAllAndOverride: jest.fn().mockReturnValue(false) };
    verifier = { verify: jest.fn().mockResolvedValue({ sub: 'kc-1' }) };
    provisioning = { provision: jest.fn().mockResolvedValue(user) };
    guard = new JwtAuthGuard(
      reflector as never,
      verifier as never,
      provisioning as never,
    );
  });

  it('lets public routes through without checking a token', async () => {
    reflector.getAllAndOverride.mockReturnValue(true);

    await expect(guard.canActivate(contextFor({ headers: {} }))).resolves.toBe(
      true,
    );
    expect(verifier.verify).not.toHaveBeenCalled();
  });

  it('rejects requests without a bearer token', async () => {
    await expect(
      guard.canActivate(contextFor({ headers: {} })),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('rejects other authorization schemes', async () => {
    const request = { headers: { authorization: 'Basic abc123' } };

    await expect(guard.canActivate(contextFor(request))).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('attaches the provisioned user for a valid token', async () => {
    const request: AuthenticatedRequest = {
      headers: { authorization: 'Bearer good-token' },
    };

    await expect(guard.canActivate(contextFor(request))).resolves.toBe(true);
    expect(verifier.verify).toHaveBeenCalledWith('good-token');
    expect(request.user).toEqual(user);
  });
});
