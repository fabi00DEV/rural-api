import { Farm } from '@/core/domain/entities/farm.entity';
import { IFarmRepository } from '@/core/domain/repositories/farm.repository.interface';
import { IProducerRepository } from '@/core/domain/repositories/producer.repository.interface';
import { CreateFarmDto } from '@/infra/http/dtos/farm/create-farm.dto';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class CreateFarmUseCase {
  constructor(
    @Inject('IFarmRepository')
    private readonly farmRepository: IFarmRepository,
    @Inject('IProducerRepository')
    private readonly producerRepository: IProducerRepository,
  ) {}

  async execute(input: CreateFarmDto): Promise<Farm> {
    const producer = await this.producerRepository.findById(input.producerId);
    if (!producer) {
      throw new NotFoundException('Produtor não encontrado');
    }

    const farm = new Farm(
      null,
      input.name,
      input.city,
      input.state,
      input.totalArea,
      input.agriculturalArea,
      input.vegetationArea,
      input.producerId,
      [],
      new Date(),
      new Date(),
    );

    farm.validate();

    return this.farmRepository.create(farm);
  }
}
