import { Inject, Injectable } from '@nestjs/common';
import { ICropRepository } from '@/core/domain/repositories/crop.repository.interface';
import { NotFoundError } from '@/shared/errors/custom.erros';

@Injectable()
export class DeleteCropUseCase {
  constructor(
    @Inject('ICropRepository')
    private readonly cropRepository: ICropRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const crop = await this.cropRepository.findById(id);
    if (!crop) {
      throw new NotFoundError('Cultura não encontrada');
    }

    await this.cropRepository.delete(id);
  }
}
