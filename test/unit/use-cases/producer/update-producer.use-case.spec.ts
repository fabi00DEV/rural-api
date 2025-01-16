import { Test, TestingModule } from '@nestjs/testing';
import { UpdateProducerUseCase } from '@/core/use-cases/producer/update-producer.use-case';
import { IProducerRepository } from '@/core/domain/repositories/producer.repository.interface';
import { DocumentValidator } from '@/shared/validators/document.validator';
import { BusinessError, NotFoundError } from '@/shared/errors/custom.erros';
import { Producer } from '@/core/domain/entities/producer.entity';

describe('UpdateProducerUseCase', () => {
  let useCase: UpdateProducerUseCase;
  let producerRepository: IProducerRepository;
  let documentValidator: DocumentValidator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateProducerUseCase,
        {
          provide: 'IProducerRepository',
          useValue: {
            findById: jest.fn(),
            findByDocument: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: DocumentValidator,
          useValue: {
            isValid: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<UpdateProducerUseCase>(UpdateProducerUseCase);
    producerRepository = module.get<IProducerRepository>('IProducerRepository');
    documentValidator = module.get<DocumentValidator>(DocumentValidator);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should update a producer successfully', async () => {
      // Arrange
      const existingProducer = new Producer(
        'existing_id',
        'Old Name',
        '123.456.789-00',
        [],
        new Date(),
        new Date(),
      );

      const input = {
        id: 'existing_id',
        name: 'New Name',
      };

      const expectedProducer = new Producer(
        existingProducer.id,
        input.name,
        existingProducer.document,
        existingProducer.farms,
        existingProducer.createdAt,
        new Date(),
      );

      jest
        .spyOn(producerRepository, 'findById')
        .mockResolvedValue(existingProducer);
      jest
        .spyOn(producerRepository, 'update')
        .mockResolvedValue(expectedProducer);

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result).toEqual(expectedProducer);
      expect(producerRepository.findById).toHaveBeenCalledWith(input.id);
      expect(producerRepository.update).toHaveBeenCalled();
    });

    it('should throw NotFoundError if producer does not exist', async () => {
      // Arrange
      const input = {
        id: 'non_existing_id',
        name: 'New Name',
      };

      jest.spyOn(producerRepository, 'findById').mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(NotFoundError);
      expect(producerRepository.findById).toHaveBeenCalledWith(input.id);
      expect(producerRepository.update).not.toHaveBeenCalled();
    });

    it('should throw BusinessError when updating document to one that already exists', async () => {
      // Arrange
      const existingProducer = new Producer(
        'existing_id',
        'Old Name',
        '123.456.789-00',
        [],
        new Date(),
        new Date(),
      );

      const anotherProducer = new Producer(
        'another_id',
        'Another Name',
        '987.654.321-00',
        [],
        new Date(),
        new Date(),
      );

      const input = {
        id: 'existing_id',
        document: '987.654.321-00',
      };

      jest.spyOn(documentValidator, 'isValid').mockReturnValue(true);
      jest
        .spyOn(producerRepository, 'findById')
        .mockResolvedValue(existingProducer);
      jest
        .spyOn(producerRepository, 'findByDocument')
        .mockResolvedValue(anotherProducer);

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(BusinessError);
      expect(documentValidator.isValid).toHaveBeenCalledWith(input.document);
      expect(producerRepository.findById).toHaveBeenCalledWith(input.id);
      expect(producerRepository.findByDocument).toHaveBeenCalledWith(
        input.document,
      );
      expect(producerRepository.update).not.toHaveBeenCalled();
    });

    it('should update document when valid and not in use', async () => {
      // Arrange
      const existingProducer = new Producer(
        'existing_id',
        'Old Name',
        '123.456.789-00',
        [],
        new Date(),
        new Date(),
      );

      const input = {
        id: 'existing_id',
        document: '987.654.321-00',
      };

      const expectedProducer = new Producer(
        existingProducer.id,
        existingProducer.name,
        input.document,
        existingProducer.farms,
        existingProducer.createdAt,
        new Date(),
      );

      jest.spyOn(documentValidator, 'isValid').mockReturnValue(true);
      jest
        .spyOn(producerRepository, 'findById')
        .mockResolvedValue(existingProducer);
      jest.spyOn(producerRepository, 'findByDocument').mockResolvedValue(null);
      jest
        .spyOn(producerRepository, 'update')
        .mockResolvedValue(expectedProducer);

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result).toEqual(expectedProducer);
      expect(documentValidator.isValid).toHaveBeenCalledWith(input.document);
      expect(producerRepository.findById).toHaveBeenCalledWith(input.id);
      expect(producerRepository.findByDocument).toHaveBeenCalledWith(
        input.document,
      );
      expect(producerRepository.update).toHaveBeenCalled();
    });
  });
});
