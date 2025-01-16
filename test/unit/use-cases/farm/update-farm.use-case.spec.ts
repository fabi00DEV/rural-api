import { Test, TestingModule } from '@nestjs/testing';
import { UpdateFarmUseCase } from '@/core/use-cases/farm/update-farm.use-case';
import { IFarmRepository } from '@/core/domain/repositories/farm.repository.interface';
import { BusinessError, NotFoundError } from '@/shared/errors/custom.erros';
import { Farm } from '@/core/domain/entities/farm.entity';

describe('UpdateFarmUseCase', () => {
  let useCase: UpdateFarmUseCase;
  let farmRepository: IFarmRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateFarmUseCase,
        {
          provide: 'IFarmRepository',
          useValue: {
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<UpdateFarmUseCase>(UpdateFarmUseCase);
    farmRepository = module.get<IFarmRepository>('IFarmRepository');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should update a farm successfully', async () => {
      // Arrange
      const existingFarm = new Farm(
        'farm-id',
        'Old Farm Name',
        'Old City',
        'ST',
        1000,
        700,
        300,
        'producer-id',
        [],
        new Date(),
        new Date(),
      );

      const input = {
        id: 'farm-id',
        name: 'New Farm Name',
        city: 'New City',
      };

      const expectedFarm = new Farm(
        existingFarm.id,
        input.name,
        input.city,
        existingFarm.state,
        existingFarm.totalArea,
        existingFarm.agriculturalArea,
        existingFarm.vegetationArea,
        existingFarm.producerId,
        existingFarm.crops,
        existingFarm.createdAt,
        new Date(),
      );

      jest.spyOn(farmRepository, 'findById').mockResolvedValue(existingFarm);
      jest.spyOn(farmRepository, 'update').mockResolvedValue(expectedFarm);

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result).toEqual(expectedFarm);
      expect(farmRepository.findById).toHaveBeenCalledWith(input.id);
      expect(farmRepository.update).toHaveBeenCalled();
    });

    it('should throw NotFoundError if farm does not exist', async () => {
      // Arrange
      const input = {
        id: 'non-existing-id',
        name: 'New Farm Name',
      };

      jest.spyOn(farmRepository, 'findById').mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(NotFoundError);
      expect(farmRepository.findById).toHaveBeenCalledWith(input.id);
      expect(farmRepository.update).not.toHaveBeenCalled();
    });

    it('should throw BusinessError when updating areas that exceed total area', async () => {
      // Arrange
      const existingFarm = new Farm(
        'farm-id',
        'Old Farm Name',
        'Old City',
        'ST',
        1000,
        700,
        300,
        'producer-id',
        [],
        new Date(),
        new Date(),
      );

      const input = {
        id: 'farm-id',
        agriculturalArea: 800,
        vegetationArea: 300, // Total = 1100 > totalArea
      };

      jest.spyOn(farmRepository, 'findById').mockResolvedValue(existingFarm);

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(BusinessError);
      expect(farmRepository.findById).toHaveBeenCalledWith(input.id);
      expect(farmRepository.update).not.toHaveBeenCalled();
    });

    it('should maintain unchanged values when updating partially', async () => {
      // Arrange
      const existingFarm = new Farm(
        'farm-id',
        'Old Farm Name',
        'Old City',
        'ST',
        1000,
        700,
        300,
        'producer-id',
        [],
        new Date(),
        new Date(),
      );

      const input = {
        id: 'farm-id',
        name: 'New Farm Name',
      };

      const expectedFarm = new Farm(
        existingFarm.id,
        input.name,
        existingFarm.city,
        existingFarm.state,
        existingFarm.totalArea,
        existingFarm.agriculturalArea,
        existingFarm.vegetationArea,
        existingFarm.producerId,
        existingFarm.crops,
        existingFarm.createdAt,
        new Date(),
      );

      jest.spyOn(farmRepository, 'findById').mockResolvedValue(existingFarm);
      jest.spyOn(farmRepository, 'update').mockResolvedValue(expectedFarm);

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result).toEqual(expectedFarm);
      expect(result.city).toBe(existingFarm.city);
      expect(result.state).toBe(existingFarm.state);
      expect(farmRepository.update).toHaveBeenCalled();
    });
  });
});
