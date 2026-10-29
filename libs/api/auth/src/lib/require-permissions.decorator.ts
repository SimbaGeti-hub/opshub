import { SetMetadata } from '@nestjs/common';
import type { Permission } from '@opshub/shared/models';

export const REQUIRED_PERMISSIONS_KEY = 'requiredPermissions';

/** Requires the signed in user to hold every listed permission. */
export const RequirePermissions = (...permissions: Permission[]) =>
  SetMetadata(REQUIRED_PERMISSIONS_KEY, permissions);
