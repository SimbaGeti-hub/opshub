import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '@opshub/api/prisma';
import { HealthController, HealthService } from './health';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
  ],
  controllers: [HealthController],
  providers: [PrismaService, HealthService],
})
export class AppModule {}
