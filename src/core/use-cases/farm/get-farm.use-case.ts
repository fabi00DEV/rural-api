import { Inject, Injectable } from '@nestjs/common';
import { Farm } from '@/core/domain/entities/farm.entity';
import { IFarmRepository } from '@/core/domain/repositories/farm.repository.interface';
import { NotFoundError } from '@/shared/errors/custom.erros';

@Injectable()
export class GetFarmUseCase {
  constructor(
    @Inject('IFarmRepository')
    private readonly farmRepository: IFarmRepository,
  ) {}

  async execute(id: string): Promise<Farm> {
    const farm = await this.farmRepository.findById(id);
    if (!farm) {
      throw new NotFoundError('Fazenda não encontrada');
    }
    return farm;
  }
}
