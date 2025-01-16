import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IDashboardRepository } from '@/core/domain/repositories/dashboard.repository.interface';

@Injectable()
export class PrismaDashboardRepository implements IDashboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview() {
    const [producersCount, farmsData, cropsCount] = await Promise.all([
      this.prisma.producer.count(),
      this.prisma.farm.aggregate({
        _count: { id: true },
        _sum: { totalArea: true },
      }),
      this.prisma.crop.count(),
    ]);

    return {
      totalProducers: producersCount,
      totalFarms: farmsData._count.id,
      totalArea: farmsData._sum.totalArea || 0,
      totalCrops: cropsCount,
    };
  }

  async getStateDistribution() {
    const distribution = await this.prisma.farm.groupBy({
      by: ['state'],
      _count: {
        id: true,
        producerId: true,
      },
      _sum: {
        totalArea: true,
      },
    });

    return distribution.map((item) => ({
      state: item.state,
      farmCount: item._count.id,
      totalArea: item._sum.totalArea || 0,
      producerCount: item._count.producerId,
    }));
  }

  async getLandUseDistribution() {
    const result = await this.prisma.farm.aggregate({
      _sum: {
        agriculturalArea: true,
        vegetationArea: true,
      },
    });

    return {
      agriculturalArea: result._sum.agriculturalArea || 0,
      vegetationArea: result._sum.vegetationArea || 0,
    };
  }

  async getCropDistribution() {
    const crops = await this.prisma.crop.groupBy({
      by: ['name'],
      _count: { _all: true },
    });

    return crops.map((crop) => ({
      cropName: crop.name,
      count: crop._count._all,
    }));
  }

  async getHarvestDistribution() {
    const harvests = await this.prisma.crop.groupBy({
      by: ['harvest'],
      _count: {
        _all: true,
        farmId: true,
      },
    });

    return harvests.map((harvest) => ({
      harvest: harvest.harvest,
      cropCount: harvest._count._all,
      farmCount: harvest._count.farmId,
    }));
  }
}
