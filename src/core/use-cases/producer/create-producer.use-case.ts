import { Inject, Injectable } from '@nestjs/common';
import { Producer } from '@/core/domain/entities/producer.entity';
import { IProducerRepository } from '@/core/domain/repositories/producer.repository.interface';
import { DocumentValidator } from '@/shared/validators/document.validator';
import { BusinessError } from '@/shared/errors/custom.erros';

export interface CreateProducerInput {
  name: string;
  document: string;
}

@Injectable()
export class CreateProducerUseCase {
  constructor(
    @Inject('IProducerRepository')
    private readonly producerRepository: IProducerRepository,
    private readonly documentValidator: DocumentValidator,
  ) {}

  async execute(input: CreateProducerInput): Promise<Producer> {
    if (!this.documentValidator.isValid(input.document)) {
      throw new BusinessError('Documento inválido');
    }

    const existingProducer = await this.producerRepository.findByDocument(
      input.document,
    );
    if (existingProducer) {
      throw new BusinessError('Já existe um produtor com este documento');
    }

    const producer = new Producer(
      null,
      input.name,
      input.document,
      [],
      new Date(),
      new Date(),
    );

    producer.validate();

    return this.producerRepository.create(producer);
  }
}
