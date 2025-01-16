import { Inject, Injectable } from '@nestjs/common';
import { Crop } from '@/core/domain/entities/crop.entity';
import { ICropRepository } from '@/core/domain/repositories/crop.repository.interface';
import { IFarmRepository } from '@/core/domain/repositories/farm.repository.interface';
import { NotFoundError, BusinessError } from '@/shared/errors/custom.erros';

export interface CreateCropInput {
  name: string;
  harvest: string;
  farmId: string;
}

@Injectable()
export class CreateCropUseCase {
  constructor(
    @Inject('ICropRepository')
    private readonly cropRepository: ICropRepository,
    @Inject('IFarmRepository')
    private readonly farmRepository: IFarmRepository,
  ) {}

  async execute(input: CreateCropInput): Promise<Crop> {
    const farm = await this.farmRepository.findById(input.farmId);
    if (!farm) {
      throw new NotFoundError('Fazenda não encontrada');
    }

    const existingCrops = await this.cropRepository.findByFarmAndHarvest(
      input.farmId,
      input.harvest,
    );

    if (existingCrops.some((crop) => crop.name === input.name)) {
      throw new BusinessError(
        `Já existe uma cultura ${input.name} registrada para a safra ${input.harvest}`,
      );
    }

    const crop = new Crop(
      null,
      input.name,
      input.harvest,
      input.farmId,
      new Date(),
      new Date(),
    );

    crop.validate();

    return this.cropRepository.create(crop);
  }
}
