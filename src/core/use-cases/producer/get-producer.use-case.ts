import { Inject, Injectable } from '@nestjs/common';
import { Producer } from '@/core/domain/entities/producer.entity';
import { IProducerRepository } from '@/core/domain/repositories/producer.repository.interface';
import { NotFoundError } from '@/shared/errors/custom.erros';

@Injectable()
export class GetProducerUseCase {
  constructor(
    @Inject('IProducerRepository')
    private readonly producerRepository: IProducerRepository,
  ) {}

  async execute(id: string): Promise<Producer> {
    const producer = await this.producerRepository.findById(id);
    if (!producer) {
      throw new NotFoundError('Produtor não encontrado');
    }
    return producer;
  }
}
