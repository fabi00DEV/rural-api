import { Module } from '@nestjs/common';
import { DashboardController } from '@/infra/http/controllers/dashboard.controller';
import { PrismaDashboardRepository } from '@/infra/database/repositories/prisma-dashboard.repository';
import { GetDashboardMetricsUseCase } from '@/core/use-cases/dashboard/get-dashboard-metrics.use-case';
import { PrismaModule } from '@/infra/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DashboardController],
  providers: [
    {
      provide: 'IDashboardRepository',
      useClass: PrismaDashboardRepository,
    },
    GetDashboardMetricsUseCase,
  ],
})
export class DashboardModule {}
