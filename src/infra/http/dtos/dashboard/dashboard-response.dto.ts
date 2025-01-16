import { ApiProperty } from '@nestjs/swagger';

class OverviewDto {
  @ApiProperty()
  totalProducers: number;

  @ApiProperty()
  totalFarms: number;

  @ApiProperty()
  totalArea: number;

  @ApiProperty()
  totalCrops: number;
}

class StateDistributionDto {
  @ApiProperty()
  state: string;

  @ApiProperty()
  farmCount: number;

  @ApiProperty()
  totalArea: number;

  @ApiProperty()
  producerCount: number;
}

class LandUseDistributionDto {
  @ApiProperty()
  agriculturalArea: number;

  @ApiProperty()
  vegetationArea: number;

  @ApiProperty()
  agriculturalPercentage: number;

  @ApiProperty()
  vegetationPercentage: number;
}

class CropDistributionDto {
  @ApiProperty()
  cropName: string;

  @ApiProperty()
  count: number;
}

class HarvestDistributionDto {
  @ApiProperty()
  harvest: string;

  @ApiProperty()
  cropCount: number;

  @ApiProperty()
  farmCount: number;
}

export class DashboardResponseDto {
  @ApiProperty({ type: OverviewDto })
  overview: OverviewDto;

  @ApiProperty({ type: [StateDistributionDto] })
  stateDistribution: StateDistributionDto[];

  @ApiProperty({ type: LandUseDistributionDto })
  landUseDistribution: LandUseDistributionDto;

  @ApiProperty({ type: [CropDistributionDto] })
  cropDistribution: CropDistributionDto[];

  @ApiProperty({ type: [HarvestDistributionDto] })
  harvestDistribution: HarvestDistributionDto[];
}
