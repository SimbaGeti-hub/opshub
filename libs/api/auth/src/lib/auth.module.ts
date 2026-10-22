import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { TokenVerifierService } from './token-verifier.service';
import { UserProvisioningService } from './user-provisioning.service';

@Module({
  providers: [
    TokenVerifierService,
    UserProvisioningService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
  exports: [TokenVerifierService, UserProvisioningService],
})
export class AuthModule {}
