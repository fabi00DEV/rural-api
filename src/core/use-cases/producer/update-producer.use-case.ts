import { Inject, Injectable } from '@nestjs/common';
import { Producer } from '@/core/domain/entities/producer.entity';
import { IProducerRepository } from '@/core/domain/repositories/producer.repository.interface';
import { DocumentValidator } from '@/shared/validators/document.validator';
import { BusinessError, NotFoundError } from '@/shared/errors/custom.erros';

export interface UpdateProducerInput {
  id: string;
  name?: string;
  document?: string;
}

@Injectable()
export class UpdateProducerUseCase {
  constructor(
    @Inject('IProducerRepository')
    private readonly producerRepository: IProducerRepository,
    private readonly documentValidator: DocumentValidator,
  ) {}

  async execute(input: UpdateProducerInput): Promise<Producer> {
    const producer = await this.producerRepository.findById(input.id);
    if (!producer) {
      throw new NotFoundError('Produtor não encontrado');
    }

    if (input.document) {
      if (!this.documentValidator.isValid(input.document)) {
        throw new BusinessError('Documento inválido');
      }

      const existingProducer = await this.producerRepository.findByDocument(
        input.document,
      );
      if (existingProducer && existingProducer.id !== input.id) {
        throw new BusinessError('Já existe um produtor com este documento');
      }
    }

    const updatedProducer = new Producer(
      producer.id,
      input.name || producer.name,
      input.document || producer.document,
      producer.farms,
      producer.createdAt,
      new Date(),
    );

    updatedProducer.validate();

    return this.producerRepository.update(input.id, updatedProducer);
  }
}
