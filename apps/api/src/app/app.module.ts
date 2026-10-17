import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController, HealthService } from './health';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
  ],
  controllers: [HealthController],
  providers: [HealthService],
})
export class AppModule {}
