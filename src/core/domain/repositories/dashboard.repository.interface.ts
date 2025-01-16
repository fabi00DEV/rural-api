export interface IDashboardRepository {
  getOverview(): Promise<{
    totalProducers: number;
    totalFarms: number;
    totalArea: number;
    totalCrops: number;
  }>;

  getStateDistribution(): Promise<
    Array<{
      state: string;
      farmCount: number;
      totalArea: number;
      producerCount: number;
    }>
  >;

  getLandUseDistribution(): Promise<{
    agriculturalArea: number;
    vegetationArea: number;
  }>;

  getCropDistribution(): Promise<
    Array<{
      cropName: string;
      count: number;
    }>
  >;

  getHarvestDistribution(): Promise<
    Array<{
      harvest: string;
      cropCount: number;
      farmCount: number;
    }>
  >;
}
