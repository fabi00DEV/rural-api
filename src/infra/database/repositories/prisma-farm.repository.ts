import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IFarmRepository } from '@/core/domain/repositories/farm.repository.interface';
import { Farm } from '@/core/domain/entities/farm.entity';
import { AppLoggerService } from '@/shared/logger/logger.service';

@Injectable()
export class PrismaFarmRepository implements IFarmRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: AppLoggerService,
  ) {}

  async create(farm: Farm): Promise<Farm> {
    try {
      this.logger.log('Criando nova fazenda', 'PrismaFarmRepository');

      const created = await this.prisma.farm.create({
        data: {
          name: farm.name,
          city: farm.city,
          state: farm.state,
          totalArea: farm.totalArea,
          agriculturalArea: farm.agriculturalArea,
          vegetationArea: farm.vegetationArea,
          producerId: farm.producerId,
        },
        include: {
          crops: true,
        },
      });

      this.logger.log(
        `Fazenda criada com sucesso. ID: ${created.id}`,
        'PrismaFarmRepository',
      );

      return this.mapToDomain(created);
    } catch (error) {
      this.logger.error(
        'Erro ao criar fazenda',
        error.stack,
        'PrismaFarmRepository',
      );
      throw error;
    }
  }

  async findById(id: string): Promise<Farm | null> {
    try {
      this.logger.log(`Buscando fazenda por ID: ${id}`, 'PrismaFarmRepository');

      const farm = await this.prisma.farm.findUnique({
        where: { id },
        include: {
          crops: true,
        },
      });

      if (!farm) {
        this.logger.warn(
          `Fazenda não encontrada. ID: ${id}`,
          'PrismaFarmRepository',
        );
        return null;
      }

      return this.mapToDomain(farm);
    } catch (error) {
      this.logger.error(
        `Erro ao buscar fazenda. ID: ${id}`,
        error.stack,
        'PrismaFarmRepository',
      );
      throw error;
    }
  }

  async update(id: string, farm: Farm): Promise<Farm> {
    try {
      this.logger.log(`Atualizando fazenda. ID: ${id}`, 'PrismaFarmRepository');

      const updated = await this.prisma.farm.update({
        where: { id },
        data: {
          name: farm.name,
          city: farm.city,
          state: farm.state,
          totalArea: farm.totalArea,
          agriculturalArea: farm.agriculturalArea,
          vegetationArea: farm.vegetationArea,
          producerId: farm.producerId,
        },
        include: {
          crops: true,
        },
      });

      this.logger.log(
        `Fazenda atualizada com sucesso. ID: ${id}`,
        'PrismaFarmRepository',
      );

      return this.mapToDomain(updated);
    } catch (error) {
      this.logger.error(
        `Erro ao atualizar fazenda. ID: ${id}`,
        error.stack,
        'PrismaFarmRepository',
      );
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      this.logger.log(`Deletando fazenda. ID: ${id}`, 'PrismaFarmRepository');

      await this.prisma.farm.delete({
        where: { id },
      });

      this.logger.log(
        `Fazenda deletada com sucesso. ID: ${id}`,
        'PrismaFarmRepository',
      );
    } catch (error) {
      this.logger.error(
        `Erro ao deletar fazenda. ID: ${id}`,
        error.stack,
        'PrismaFarmRepository',
      );
      throw error;
    }
  }

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{ farms: Farm[]; total: number }> {
    try {
      this.logger.log(
        `Buscando todas as fazendas. Página: ${page}, Limite: ${limit}`,
        'PrismaFarmRepository',
      );

      const skip = (page - 1) * limit;

      const [farms, total] = await Promise.all([
        this.prisma.farm.findMany({
          skip,
          take: limit,
          include: {
            crops: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.farm.count(),
      ]);

      return {
        farms: farms.map((farm) => this.mapToDomain(farm)),
        total,
      };
    } catch (error) {
      this.logger.error(
        'Erro ao buscar todas as fazendas',
        error.stack,
        'PrismaFarmRepository',
      );
      throw error;
    }
  }

  async findByProducerId(producerId: string): Promise<Farm[]> {
    try {
      this.logger.log(
        `Buscando fazendas por produtor. ID: ${producerId}`,
        'PrismaFarmRepository',
      );

      const farms = await this.prisma.farm.findMany({
        where: { producerId },
        include: {
          crops: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return farms.map((farm) => this.mapToDomain(farm));
    } catch (error) {
      this.logger.error(
        `Erro ao buscar fazendas do produtor. ID: ${producerId}`,
        error.stack,
        'PrismaFarmRepository',
      );
      throw error;
    }
  }

  async getStateDistribution(): Promise<
    Array<{ state: string; count: number }>
  > {
    try {
      this.logger.log(
        'Buscando distribuição de fazendas por estado',
        'PrismaFarmRepository',
      );

      const distribution = await this.prisma.farm.groupBy({
        by: ['state'],
        _count: {
          id: true,
        },
      });

      return distribution.map((item) => ({
        state: item.state,
        count: item._count.id,
      }));
    } catch (error) {
      this.logger.error(
        'Erro ao buscar distribuição por estado',
        error.stack,
        'PrismaFarmRepository',
      );
      throw error;
    }
  }

  async getLandUseDistribution(): Promise<{
    agriculturalArea: number;
    vegetationArea: number;
  }> {
    try {
      this.logger.log(
        'Buscando distribuição de uso do solo',
        'PrismaFarmRepository',
      );

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
    } catch (error) {
      this.logger.error(
        'Erro ao buscar distribuição de uso do solo',
        error.stack,
        'PrismaFarmRepository',
      );
      throw error;
    }
  }

  private mapToDomain(prismeFarm: any): Farm {
    return new Farm(
      prismeFarm.id,
      prismeFarm.name,
      prismeFarm.city,
      prismeFarm.state,
      prismeFarm.totalArea,
      prismeFarm.agriculturalArea,
      prismeFarm.vegetationArea,
      prismeFarm.producerId,
      prismeFarm.crops,
      prismeFarm.createdAt,
      prismeFarm.updatedAt,
    );
  }
}
