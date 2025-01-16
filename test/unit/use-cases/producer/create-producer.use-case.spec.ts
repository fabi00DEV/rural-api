import { Test, TestingModule } from '@nestjs/testing';
import { CreateProducerUseCase } from '@/core/use-cases/producer/create-producer.use-case';
import { IProducerRepository } from '@/core/domain/repositories/producer.repository.interface';
import { DocumentValidator } from '@/shared/validators/document.validator';
import { BusinessError } from '@/shared/errors/custom.erros';
import { Producer } from '@/core/domain/entities/producer.entity';

describe('CreateProducerUseCase', () => {
  let useCase: CreateProducerUseCase;
  let producerRepository: IProducerRepository;
  let documentValidator: DocumentValidator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProducerUseCase,
        {
          provide: 'IProducerRepository',
          useValue: {
            create: jest.fn(),
            findByDocument: jest.fn(),
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

    useCase = module.get<CreateProducerUseCase>(CreateProducerUseCase);
    producerRepository = module.get<IProducerRepository>('IProducerRepository');
    documentValidator = module.get<DocumentValidator>(DocumentValidator);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a producer successfully', async () => {
      // Arrange
      const input = {
        name: 'John Doe',
        document: '123.456.789-00',
      };

      const expectedProducer = new Producer(
        'any_id',
        input.name,
        input.document,
        [],
        new Date(),
        new Date(),
      );

      jest.spyOn(documentValidator, 'isValid').mockReturnValue(true);
      jest.spyOn(producerRepository, 'findByDocument').mockResolvedValue(null);
      jest
        .spyOn(producerRepository, 'create')
        .mockResolvedValue(expectedProducer);

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result).toEqual(expectedProducer);
      expect(documentValidator.isValid).toHaveBeenCalledWith(input.document);
      expect(producerRepository.findByDocument).toHaveBeenCalledWith(
        input.document,
      );
      expect(producerRepository.create).toHaveBeenCalled();
    });

    it('should throw BusinessError if document is invalid', async () => {
      // Arrange
      const input = {
        name: 'John Doe',
        document: 'invalid_document',
      };

      jest.spyOn(documentValidator, 'isValid').mockReturnValue(false);

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(BusinessError);
      expect(documentValidator.isValid).toHaveBeenCalledWith(input.document);
      expect(producerRepository.findByDocument).not.toHaveBeenCalled();
      expect(producerRepository.create).not.toHaveBeenCalled();
    });

    it('should throw BusinessError if document already exists', async () => {
      // Arrange
      const input = {
        name: 'John Doe',
        document: '123.456.789-00',
      };

      const existingProducer = new Producer(
        'existing_id',
        'Existing Producer',
        input.document,
        [],
        new Date(),
        new Date(),
      );

      jest.spyOn(documentValidator, 'isValid').mockReturnValue(true);
      jest
        .spyOn(producerRepository, 'findByDocument')
        .mockResolvedValue(existingProducer);

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(BusinessError);
      expect(documentValidator.isValid).toHaveBeenCalledWith(input.document);
      expect(producerRepository.findByDocument).toHaveBeenCalledWith(
        input.document,
      );
      expect(producerRepository.create).not.toHaveBeenCalled();
    });

    it('should throw BusinessError if name is empty', async () => {
      // Arrange
      const input = {
        name: '',
        document: '123.456.789-00',
      };

      jest.spyOn(documentValidator, 'isValid').mockReturnValue(true);

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(BusinessError);
    });
  });
});
