import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IProducerRepository } from '@/core/domain/repositories/producer.repository.interface';
import { Producer } from '@/core/domain/entities/producer.entity';
import { AppLoggerService } from '@/shared/logger/logger.service';
import { Farm } from '@/core/domain/entities/farm.entity';

@Injectable()
export class PrismaProducerRepository implements IProducerRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: AppLoggerService,
  ) {}

  async create(producer: Producer): Promise<Producer> {
    this.logger.log('Criando novo produtor', 'PrismaProducerRepository');

    const created = await this.prisma.producer.create({
      data: {
        name: producer.name,
        document: producer.document,
      },
      include: {
        farms: {
          include: {
            crops: true,
          },
        },
      },
    });

    return this.mapToDomain(created);
  }

  async findById(id: string): Promise<Producer | null> {

    const producer = await this.prisma.producer.findUnique({
      where: { id },
      include: {
        farms: {
          include: {
            crops: true,
          },
        },
      },
    });

    if (!producer) return null;
    return this.mapToDomain(producer);
  }

  async findByDocument(document: string): Promise<Producer | null> {
    const producer = await this.prisma.producer.findUnique({
      where: { document },
      include: {
        farms: {
          include: {
            crops: true,
          },
        },
      },
    });

    if (!producer) return null;
    return this.mapToDomain(producer);
  }

  async update(id: string, producer: Producer): Promise<Producer> {
    const updated = await this.prisma.producer.update({
      where: { id },
      data: {
        name: producer.name,
        document: producer.document,
      },
      include: {
        farms: {
          include: {
            crops: true,
          },
        },
      },
    });

    return this.mapToDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.producer.delete({
      where: { id },
    });
  }

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{ items: Producer[]; total: number }> {
    const skip = (page - 1) * limit;

    const [producers, total] = await Promise.all([
      this.prisma.producer.findMany({
        skip,
        take: limit,
        include: {
          farms: {
            include: {
              crops: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.producer.count(),
    ]);

    return {
      items: producers.map(this.mapToDomain),
      total,
    };
  }

  private mapToDomain(prismaProducer: any): Producer {
    return new Producer(
      prismaProducer.id,
      prismaProducer.name,
      prismaProducer.document,
      prismaProducer.farms.map(this.mapFarmToDomain),
      prismaProducer.createdAt,
      prismaProducer.updatedAt,
      prismaProducer.deletedAt,
    );
  }

  private mapFarmToDomain(prismaFarm: any): Farm {
    return new Farm(
      prismaFarm.id,
      prismaFarm.name,
      prismaFarm.city,
      prismaFarm.state,
      prismaFarm.totalArea,
      prismaFarm.agriculturalArea,
      prismaFarm.vegetationArea,
      prismaFarm.producerId,
      prismaFarm.crops,
      prismaFarm.createdAt,
      prismaFarm.updatedAt,
      prismaFarm.deletedAt,
    );
  }
}
