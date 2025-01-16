import { Module } from '@nestjs/common';
import { ProducerController } from '@/infra/http/controllers/producer.controller';
import { PrismaProducerRepository } from '@/infra/database/repositories/prisma-producer.repository';
import { CreateProducerUseCase } from '@/core/use-cases/producer/create-producer.use-case';
import { UpdateProducerUseCase } from '@/core/use-cases/producer/update-producer.use-case';
import { DeleteProducerUseCase } from '@/core/use-cases/producer/delete-producer.use-case';
import { GetProducerUseCase } from '@/core/use-cases/producer/get-producer.use-case';
import { DocumentValidator } from '@/shared/validators/document.validator';
import { PrismaModule } from '@/infra/database/prisma/prisma.module';
import { PrismaFarmRepository } from '@/infra/database/repositories/prisma-farm.repository';

@Module({
  imports: [PrismaModule],
  controllers: [ProducerController],
  providers: [
    {
      provide: 'IProducerRepository',
      useClass: PrismaProducerRepository,
    },
    {
      provide: 'IFarmRepository',
      useClass: PrismaFarmRepository,
    },
    CreateProducerUseCase,
    UpdateProducerUseCase,
    DeleteProducerUseCase,
    GetProducerUseCase,
    DocumentValidator,
  ],
  exports: ['IProducerRepository', 'IFarmRepository'],
})
export class ProducerModule {}
