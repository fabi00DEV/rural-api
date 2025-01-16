import { Inject, Injectable } from '@nestjs/common';
import { Farm } from '@/core/domain/entities/farm.entity';
import { IFarmRepository } from '@/core/domain/repositories/farm.repository.interface';
import { NotFoundError } from '@/shared/errors/custom.erros';

export interface UpdateFarmInput {
  id: string;
  name?: string;
  city?: string;
  state?: string;
  totalArea?: number;
  agriculturalArea?: number;
  vegetationArea?: number;
}

@Injectable()
export class UpdateFarmUseCase {
  constructor(
    @Inject('IFarmRepository')
    private readonly farmRepository: IFarmRepository,
  ) {}

  async execute(input: UpdateFarmInput): Promise<Farm> {
    const farm = await this.farmRepository.findById(input.id);
    if (!farm) {
      throw new NotFoundError('Fazenda não encontrada');
    }

    const updatedFarm = new Farm(
      farm.id,
      input.name || farm.name,
      input.city || farm.city,
      input.state || farm.state,
      input.totalArea || farm.totalArea,
      input.agriculturalArea || farm.agriculturalArea,
      input.vegetationArea || farm.vegetationArea,
      farm.producerId,
      farm.crops,
      farm.createdAt,
      new Date(),
    );

    updatedFarm.validate();

    return this.farmRepository.update(input.id, updatedFarm);
  }
}
