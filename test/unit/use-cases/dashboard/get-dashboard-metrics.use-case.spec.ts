import { Test, TestingModule } from '@nestjs/testing';
import { GetDashboardMetricsUseCase } from '@/core/use-cases/dashboard/get-dashboard-metrics.use-case';
import { IDashboardRepository } from '@/core/domain/repositories/dashboard.repository.interface';

describe('GetDashboardMetricsUseCase', () => {
  let useCase: GetDashboardMetricsUseCase;
  let dashboardRepository: IDashboardRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetDashboardMetricsUseCase,
        {
          provide: 'IDashboardRepository',
          useValue: {
            getOverview: jest.fn(),
            getStateDistribution: jest.fn(),
            getLandUseDistribution: jest.fn(),
            getCropDistribution: jest.fn(),
            getHarvestDistribution: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetDashboardMetricsUseCase>(
      GetDashboardMetricsUseCase,
    );
    dashboardRepository = module.get<IDashboardRepository>(
      'IDashboardRepository',
    );
  });

  describe('execute', () => {
    it('should return complete dashboard metrics', async () => {
      // Arrange
      const mockOverview = {
        totalProducers: 10,
        totalFarms: 15,
        totalArea: 5000,
        totalCrops: 30,
      };

      const mockStateDistribution = [
        { state: 'SP', farmCount: 5, totalArea: 2000, producerCount: 3 },
        { state: 'MG', farmCount: 10, totalArea: 3000, producerCount: 7 },
      ];

      const mockLandUseDistribution = {
        agriculturalArea: 4000,
        vegetationArea: 1000,
      };

      const mockCropDistribution = [
        { cropName: 'Soja', count: 20 },
        { cropName: 'Milho', count: 10 },
      ];

      const mockHarvestDistribution = [
        { harvest: '2023/2024', cropCount: 15, farmCount: 10 },
        { harvest: '2024/2025', cropCount: 15, farmCount: 5 },
      ];

      jest
        .spyOn(dashboardRepository, 'getOverview')
        .mockResolvedValue(mockOverview);
      jest
        .spyOn(dashboardRepository, 'getStateDistribution')
        .mockResolvedValue(mockStateDistribution);
      jest
        .spyOn(dashboardRepository, 'getLandUseDistribution')
        .mockResolvedValue(mockLandUseDistribution);
      jest
        .spyOn(dashboardRepository, 'getCropDistribution')
        .mockResolvedValue(mockCropDistribution);
      jest
        .spyOn(dashboardRepository, 'getHarvestDistribution')
        .mockResolvedValue(mockHarvestDistribution);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toBeDefined();
      expect(result.overview).toEqual(mockOverview);
      expect(result.stateDistribution).toEqual(mockStateDistribution);
      expect(result.landUseDistribution).toEqual({
        ...mockLandUseDistribution,
        agriculturalPercentage: 80, // 4000/5000 * 100
        vegetationPercentage: 20, // 1000/5000 * 100
      });
      expect(result.cropDistribution).toEqual(mockCropDistribution);
      expect(result.harvestDistribution).toEqual(mockHarvestDistribution);
    });

    it('should handle empty data', async () => {
      // Arrange
      const mockEmptyOverview = {
        totalProducers: 0,
        totalFarms: 0,
        totalArea: 0,
        totalCrops: 0,
      };

      jest
        .spyOn(dashboardRepository, 'getOverview')
        .mockResolvedValue(mockEmptyOverview);
      jest
        .spyOn(dashboardRepository, 'getStateDistribution')
        .mockResolvedValue([]);
      jest
        .spyOn(dashboardRepository, 'getLandUseDistribution')
        .mockResolvedValue({
          agriculturalArea: 0,
          vegetationArea: 0,
        });
      jest
        .spyOn(dashboardRepository, 'getCropDistribution')
        .mockResolvedValue([]);
      jest
        .spyOn(dashboardRepository, 'getHarvestDistribution')
        .mockResolvedValue([]);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.overview.totalProducers).toBe(0);
      expect(result.stateDistribution).toEqual([]);
      expect(result.landUseDistribution).toEqual({
        agriculturalArea: 0,
        vegetationArea: 0,
        agriculturalPercentage: 0,
        vegetationPercentage: 0,
      });
      expect(result.cropDistribution).toEqual([]);
      expect(result.harvestDistribution).toEqual([]);
    });

    it('should handle repository errors gracefully', async () => {
      // Arrange
      jest
        .spyOn(dashboardRepository, 'getOverview')
        .mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(useCase.execute()).rejects.toThrow('Database error');
    });

    it('should calculate percentage distributions correctly', async () => {
      // Arrange
      const mockOverview = {
        totalProducers: 5,
        totalFarms: 10,
        totalArea: 1000,
        totalCrops: 15,
      };

      const mockLandUseDistribution = {
        agriculturalArea: 600,
        vegetationArea: 400,
      };

      jest
        .spyOn(dashboardRepository, 'getOverview')
        .mockResolvedValue(mockOverview);
      jest
        .spyOn(dashboardRepository, 'getLandUseDistribution')
        .mockResolvedValue(mockLandUseDistribution);
      jest
        .spyOn(dashboardRepository, 'getStateDistribution')
        .mockResolvedValue([]);
      jest
        .spyOn(dashboardRepository, 'getCropDistribution')
        .mockResolvedValue([]);
      jest
        .spyOn(dashboardRepository, 'getHarvestDistribution')
        .mockResolvedValue([]);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.landUseDistribution).toEqual({
        agriculturalArea: 600,
        vegetationArea: 400,
        agriculturalPercentage: 60,
        vegetationPercentage: 40,
      });
    });

    it('should make all repository calls even if some fail', async () => {
      // Arrange
      jest
        .spyOn(dashboardRepository, 'getOverview')
        .mockRejectedValue(new Error('Overview error'));
      const spyStateDistribution = jest.spyOn(
        dashboardRepository,
        'getStateDistribution',
      );
      const spyLandUseDistribution = jest.spyOn(
        dashboardRepository,
        'getLandUseDistribution',
      );
      const spyCropDistribution = jest.spyOn(
        dashboardRepository,
        'getCropDistribution',
      );
      const spyHarvestDistribution = jest.spyOn(
        dashboardRepository,
        'getHarvestDistribution',
      );

      // Act
      try {
        await useCase.execute();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // Expected to throw
      }

      // Assert
      expect(spyStateDistribution).toHaveBeenCalled();
      expect(spyLandUseDistribution).toHaveBeenCalled();
      expect(spyCropDistribution).toHaveBeenCalled();
      expect(spyHarvestDistribution).toHaveBeenCalled();
    });
  });
});
