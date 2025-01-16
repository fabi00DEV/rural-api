import { Injectable, Inject } from '@nestjs/common';
import { IDashboardRepository } from '@/core/domain/repositories/dashboard.repository.interface';

@Injectable()
export class GetDashboardMetricsUseCase {
  constructor(
    @Inject('IDashboardRepository')
    private readonly dashboardRepository: IDashboardRepository,
  ) {}

  async execute() {
    const [
      overview,
      stateDistribution,
      landUseDistribution,
      cropDistribution,
      harvestDistribution,
    ] = await Promise.all([
      this.dashboardRepository.getOverview(),
      this.dashboardRepository.getStateDistribution(),
      this.dashboardRepository.getLandUseDistribution(),
      this.dashboardRepository.getCropDistribution(),
      this.dashboardRepository.getHarvestDistribution(),
    ]);

    // Calcula percentuais
    const landUseTotal =
      landUseDistribution.agriculturalArea + landUseDistribution.vegetationArea;
    const landUsePercentages = {
      ...landUseDistribution,
      agriculturalPercentage: landUseTotal
        ? (landUseDistribution.agriculturalArea / landUseTotal) * 100
        : 0,
      vegetationPercentage: landUseTotal
        ? (landUseDistribution.vegetationArea / landUseTotal) * 100
        : 0,
    };

    return {
      overview,
      stateDistribution,
      landUseDistribution: landUsePercentages,
      cropDistribution,
      harvestDistribution,
    };
  }
}
