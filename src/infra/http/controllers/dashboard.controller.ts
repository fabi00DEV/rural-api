import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetDashboardMetricsUseCase } from '@/core/use-cases/dashboard/get-dashboard-metrics.use-case';
import { DashboardResponseDto } from '../dtos/dashboard/dashboard-response.dto';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly getDashboardMetricsUseCase: GetDashboardMetricsUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obter métricas do dashboard' })
  @ApiResponse({
    status: 200,
    description: 'Métricas obtidas com sucesso',
    type: DashboardResponseDto,
  })
  async getDashboard() {
    return this.getDashboardMetricsUseCase.execute();
  }
}
