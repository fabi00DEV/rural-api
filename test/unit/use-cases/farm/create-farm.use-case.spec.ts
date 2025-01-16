import { Test, TestingModule } from '@nestjs/testing';
import { CreateFarmUseCase } from '@/core/use-cases/farm/create-farm.use-case';
import { IFarmRepository } from '@/core/domain/repositories/farm.repository.interface';
import { IProducerRepository } from '@/core/domain/repositories/producer.repository.interface';
import { BusinessError } from '@/shared/errors/custom.erros';
import { Producer } from '@/core/domain/entities/producer.entity';
import { Farm } from '@/core/domain/entities/farm.entity';
import { NotFoundException } from '@nestjs/common';

describe('CreateFarmUseCase', () => {
  let useCase: CreateFarmUseCase;
  let farmRepository: IFarmRepository;
  let producerRepository: IProducerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateFarmUseCase,
        {
          provide: 'IFarmRepository',
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: 'IProducerRepository',
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateFarmUseCase>(CreateFarmUseCase);
    farmRepository = module.get<IFarmRepository>('IFarmRepository');
    producerRepository = module.get<IProducerRepository>('IProducerRepository');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a farm successfully', async () => {
      // Arrange
      const producer = new Producer(
        'producer-id',
        'John Doe',
        '123.456.789-00',
        [],
        new Date(),
        new Date(),
      );

      const input = {
        name: 'Farm Test',
        city: 'Test City',
        state: 'ST',
        totalArea: 1000,
        agriculturalArea: 700,
        vegetationArea: 300,
        producerId: producer.id,
      };

      const expectedFarm = new Farm(
        'farm-id',
        input.name,
        input.city,
        input.state,
        input.totalArea,
        input.agriculturalArea,
        input.vegetationArea,
        input.producerId,
        [],
        new Date(),
        new Date(),
      );

      jest.spyOn(producerRepository, 'findById').mockResolvedValue(producer);
      jest.spyOn(farmRepository, 'create').mockResolvedValue(expectedFarm);

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result).toEqual(expectedFarm);
      expect(producerRepository.findById).toHaveBeenCalledWith(
        input.producerId,
      );
      expect(farmRepository.create).toHaveBeenCalled();
    });

    it('should throw NotFoundError if producer does not exist', async () => {
      // Arrange
      const input = {
        name: 'Farm Test',
        city: 'Test City',
        state: 'ST',
        totalArea: 1000,
        agriculturalArea: 700,
        vegetationArea: 300,
        producerId: 'non-existing-id',
      };

      jest.spyOn(producerRepository, 'findById').mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(NotFoundException);
      expect(producerRepository.findById).toHaveBeenCalledWith(
        input.producerId,
      );
      expect(farmRepository.create).not.toHaveBeenCalled();
    });

    it('should throw BusinessError if areas exceed total area', async () => {
      // Arrange
      const producer = new Producer(
        'producer-id',
        'John Doe',
        '123.456.789-00',
        [],
        new Date(),
        new Date(),
      );

      const input = {
        name: 'Farm Test',
        city: 'Test City',
        state: 'ST',
        totalArea: 1000,
        agriculturalArea: 700,
        vegetationArea: 400, // Total = 1100 > totalArea
        producerId: producer.id,
      };

      jest.spyOn(producerRepository, 'findById').mockResolvedValue(producer);

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(BusinessError);
      expect(producerRepository.findById).toHaveBeenCalledWith(
        input.producerId,
      );
      expect(farmRepository.create).not.toHaveBeenCalled();
    });

    it('should throw BusinessError if areas are negative', async () => {
      // Arrange
      const producer = new Producer(
        'producer-id',
        'John Doe',
        '123.456.789-00',
        [],
        new Date(),
        new Date(),
      );

      const input = {
        name: 'Farm Test',
        city: 'Test City',
        state: 'ST',
        totalArea: 1000,
        agriculturalArea: -100,
        vegetationArea: 300,
        producerId: producer.id,
      };

      jest.spyOn(producerRepository, 'findById').mockResolvedValue(producer);

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(BusinessError);
    });
  });
});
