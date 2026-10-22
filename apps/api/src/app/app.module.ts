import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@opshub/api/auth';
import { PrismaModule } from '@opshub/api/prisma';
import { HealthController, HealthService } from './health';
import { UsersController } from './users';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    PrismaModule,
    AuthModule,
  ],
  controllers: [HealthController, UsersController],
  providers: [HealthService],
})
export class AppModule {}
