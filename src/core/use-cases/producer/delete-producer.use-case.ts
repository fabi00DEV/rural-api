import { Inject, Injectable } from '@nestjs/common';
import { IProducerRepository } from '@/core/domain/repositories/producer.repository.interface';
import { IFarmRepository } from '@/core/domain/repositories/farm.repository.interface';
import { NotFoundError, BusinessError } from '@/shared/errors/custom.erros';

@Injectable()
export class DeleteProducerUseCase {
  constructor(
    @Inject('IProducerRepository')
    private readonly producerRepository: IProducerRepository,
    @Inject('IFarmRepository')
    private readonly farmRepository: IFarmRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const producer = await this.producerRepository.findById(id);
    if (!producer) {
      throw new NotFoundError('Produtor não encontrado');
    }

    const farms = await this.farmRepository.findByProducerId(id);
    if (farms.length > 0) {
      throw new BusinessError(
        'Não é possível excluir um produtor que possui fazendas cadastradas',
      );
    }

    await this.producerRepository.delete(id);
  }
}
