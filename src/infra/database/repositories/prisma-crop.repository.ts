import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ICropRepository } from '@/core/domain/repositories/crop.repository.interface';
import { Crop } from '@/core/domain/entities/crop.entity';
import { AppLoggerService } from '@/shared/logger/logger.service';

@Injectable()
export class PrismaCropRepository implements ICropRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: AppLoggerService,
  ) {}

  async create(crop: Crop): Promise<Crop> {
    this.logger.log('Criando nova cultura', 'PrismaCropRepository');

    const created = await this.prisma.crop.create({
      data: {
        name: crop.name,
        harvest: crop.harvest,
        farmId: crop.farmId,
      },
    });

    return this.mapToDomain(created);
  }

  async findById(id: string): Promise<Crop | null> {
    const crop = await this.prisma.crop.findUnique({
      where: { id },
    });

    if (!crop) return null;
    return this.mapToDomain(crop);
  }

  async update(id: string, crop: Crop): Promise<Crop> {
    const updated = await this.prisma.crop.update({
      where: { id },
      data: {
        name: crop.name,
        harvest: crop.harvest,
      },
    });

    return this.mapToDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.crop.delete({
      where: { id },
    });
  }

  async findByFarmId(farmId: string): Promise<Crop[]> {
    const crops = await this.prisma.crop.findMany({
      where: { farmId },
      orderBy: { createdAt: 'desc' },
    });

    return crops.map(this.mapToDomain);
  }

  async findByHarvest(harvest: string): Promise<Crop[]> {
    const crops = await this.prisma.crop.findMany({
      where: { harvest },
      orderBy: { createdAt: 'desc' },
    });

    return crops.map(this.mapToDomain);
  }

  async findByFarmAndHarvest(farmId: string, harvest: string): Promise<Crop[]> {
    const crops = await this.prisma.crop.findMany({
      where: {
        AND: [{ farmId }, { harvest }],
      },
      orderBy: { createdAt: 'desc' },
    });

    return crops.map(this.mapToDomain);
  }

  async getCropDistribution(): Promise<
    Array<{
      cropName: string;
      count: number;
      farmCount: number;
      harvestCount: number;
    }>
  > {
    const crops = await this.prisma.crop.groupBy({
      by: ['name'],
      _count: {
        _all: true,
        farmId: true,
        harvest: true,
      },
    });

    return crops.map((item) => ({
      cropName: item.name,
      count: item._count._all,
      farmCount: item._count.farmId,
      harvestCount: item._count.harvest,
    }));
  }

  private mapToDomain(prismaCrop: any): Crop {
    return new Crop(
      prismaCrop.id,
      prismaCrop.name,
      prismaCrop.harvest,
      prismaCrop.farmId,
      prismaCrop.createdAt,
      prismaCrop.updatedAt,
      prismaCrop.deletedAt,
    );
  }
}
