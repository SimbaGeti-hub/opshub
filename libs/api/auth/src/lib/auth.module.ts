import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PermissionsGuard } from './permissions.guard';
import { TokenVerifierService } from './token-verifier.service';
import { UserProvisioningService } from './user-provisioning.service';

@Module({
  providers: [
    TokenVerifierService,
    UserProvisioningService,
    // Global guards run in registration order: identify the caller first,
    // then check what that caller is allowed to do.
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
  exports: [TokenVerifierService, UserProvisioningService],
})
export class AuthModule {}
