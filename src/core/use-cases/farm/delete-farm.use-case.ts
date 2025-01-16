import { Inject, Injectable } from '@nestjs/common';
import { IFarmRepository } from '@/core/domain/repositories/farm.repository.interface';
import { ICropRepository } from '@/core/domain/repositories/crop.repository.interface';
import { NotFoundError, BusinessError } from '@/shared/errors/custom.erros';

@Injectable()
export class DeleteFarmUseCase {
  constructor(
    @Inject('IFarmRepository')
    private readonly farmRepository: IFarmRepository,
    @Inject('ICropRepository')
    private readonly cropRepository: ICropRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const farm = await this.farmRepository.findById(id);
    if (!farm) {
      throw new NotFoundError('Fazenda não encontrada');
    }

    const crops = await this.cropRepository.findByFarmId(id);
    if (crops.length > 0) {
      throw new BusinessError(
        'Não é possível excluir uma fazenda que possui culturas cadastradas',
      );
    }

    await this.farmRepository.delete(id);
  }
}
