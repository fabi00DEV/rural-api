import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from '@/shared/monitoring/health/health.controller';
import { PrismaModule } from '@/infra/database/prisma/prisma.module';
import { PrismaHealthIndicator } from '@/shared/monitoring/health/indicators/prisma.health';

@Module({
  imports: [TerminusModule, PrismaModule],
  controllers: [HealthController],
  providers: [PrismaHealthIndicator],
})
export class HealthModule {}
