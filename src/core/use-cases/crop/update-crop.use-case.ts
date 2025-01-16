import { Inject, Injectable } from '@nestjs/common';
import { Crop } from '@/core/domain/entities/crop.entity';
import { ICropRepository } from '@/core/domain/repositories/crop.repository.interface';
import { NotFoundError, BusinessError } from '@/shared/errors/custom.erros';

export interface UpdateCropInput {
  id: string;
  name?: string;
  harvest?: string;
}

@Injectable()
export class UpdateCropUseCase {
  constructor(
    @Inject('ICropRepository')
    private readonly cropRepository: ICropRepository,
  ) {}

  async execute(input: UpdateCropInput): Promise<Crop> {
    const crop = await this.cropRepository.findById(input.id);
    if (!crop) {
      throw new NotFoundError('Cultura não encontrada');
    }

    if (input.harvest) {
      const existingCrops = await this.cropRepository.findByFarmAndHarvest(
        crop.farmId,
        input.harvest,
      );

      if (
        existingCrops.some(
          (c) => c.name === (input.name || crop.name) && c.id !== crop.id,
        )
      ) {
        throw new BusinessError(
          `Já existe uma cultura ${input.name || crop.name} registrada para a safra ${input.harvest}`,
        );
      }
    }

    const updatedCrop = new Crop(
      crop.id,
      input.name || crop.name,
      input.harvest || crop.harvest,
      crop.farmId,
      crop.createdAt,
      new Date(),
    );

    updatedCrop.validate();

    return this.cropRepository.update(input.id, updatedCrop);
  }
}
