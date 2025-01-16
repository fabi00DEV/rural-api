import { Module } from '@nestjs/common';
import { FarmController } from '@/infra/http/controllers/farm.controller';
import { PrismaFarmRepository } from '@/infra/database/repositories/prisma-farm.repository';
import { CreateFarmUseCase } from '@/core/use-cases/farm/create-farm.use-case';
import { UpdateFarmUseCase } from '@/core/use-cases/farm/update-farm.use-case';
import { DeleteFarmUseCase } from '@/core/use-cases/farm/delete-farm.use-case';
import { GetFarmUseCase } from '@/core/use-cases/farm/get-farm.use-case';
import { ProducerModule } from './producer.module';
import { PrismaModule } from '@/infra/database/prisma/prisma.module';
import { PrismaCropRepository } from '@/infra/database/repositories/prisma-crop.repository';

@Module({
  imports: [
    PrismaModule,
    ProducerModule, // Necessário para validações de produtor
  ],
  controllers: [FarmController],
  providers: [
    {
      provide: 'IFarmRepository',
      useClass: PrismaFarmRepository,
    },
    {
      provide: 'ICropRepository',
      useClass: PrismaCropRepository,
    },
    CreateFarmUseCase,
    UpdateFarmUseCase,
    DeleteFarmUseCase,
    GetFarmUseCase,
  ],
  exports: ['IFarmRepository', 'ICropRepository'],
})
export class FarmModule {}
