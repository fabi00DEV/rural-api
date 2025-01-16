import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProducerModule } from './modules/producer.module';
import { FarmModule } from './modules/farm.module';
import { CropModule } from './modules/crop.module';
import { DashboardModule } from './modules/dashboard.module';
import { PrismaModule } from './infra/database/prisma/prisma.module';
import { LoggerModule } from './shared/logger/logger.module';
import { ValidatorsModule } from './shared/validators/validators.module';
import { HealthModule } from './modules/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
    ValidatorsModule,
    PrismaModule,
    ProducerModule,
    FarmModule,
    CropModule,
    DashboardModule,
    HealthModule,
  ],
})
export class AppModule {}
