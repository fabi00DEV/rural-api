import { Module } from '@nestjs/common';
import { CropController } from '@/infra/http/controllers/crop.controller';
import { PrismaCropRepository } from '@/infra/database/repositories/prisma-crop.repository';
import { CreateCropUseCase } from '@/core/use-cases/crop/create-crop.use-case';
import { UpdateCropUseCase } from '@/core/use-cases/crop/update-crop.use-case';
import { DeleteCropUseCase } from '@/core/use-cases/crop/delete-crop.use-case';
import { FarmModule } from './farm.module';
import { PrismaModule } from '@/infra/database/prisma/prisma.module';
import { PrismaFarmRepository } from '@/infra/database/repositories/prisma-farm.repository';

@Module({
  imports: [
    PrismaModule,
    FarmModule, // Necessário para validações de fazenda
  ],
  controllers: [CropController],
  providers: [
    {
      provide: 'ICropRepository',
      useClass: PrismaCropRepository,
    },
    {
      provide: 'IFarmRepository',
      useClass: PrismaFarmRepository,
    },
    CreateCropUseCase,
    UpdateCropUseCase,
    DeleteCropUseCase,
  ],
  exports: ['ICropRepository', 'IFarmRepository'],
})
export class CropModule {}
