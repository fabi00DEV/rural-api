import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { AppLoggerService } from '@/shared/logger/logger.service';

@Injectable()
export class PrismaHealthIndicator extends HealthIndicator {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: AppLoggerService,
  ) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      this.logger.log('Verificando a saúde do Prisma', 'PrismaHealthIndicator');

      // Executa uma query simples para verificar se o banco está respondendo
      await this.prisma.$queryRaw`SELECT 1`;

      // Verifica métricas adicionais do banco
      const metrics = await this.getDatabaseMetrics();

      return this.getStatus(key, true, { metrics });
    } catch (error) {
      this.logger.error(
        'Erro ao verificar a saúde do Prisma',
        error.stack,
        'PrismaHealthIndicator',
      );

      throw new HealthCheckError(
        'Prisma health check failed',
        this.getStatus(key, false, {
          message: error.message,
        }),
      );
    }
  }

  private async getDatabaseMetrics() {
    try {
      const [activeConnections, tablesMetrics, databaseSize] =
        await Promise.all([
          this.getActiveConnections(),
          this.getTablesMetrics(),
          this.getDatabaseSize(),
        ]);

      return {
        activeConnections,
        tablesMetrics,
        databaseSize,
      };
    } catch (error) {
      this.logger.error(String(error));
      this.logger.warn(
        'Não foi possível obter todas as métricas do banco',
        'PrismaHealthIndicator',
      );
      return {};
    }
  }

  private async getActiveConnections() {
    try {
      const result = await this.prisma.$queryRaw<{ count: number }[]>`
        SELECT count(*) 
        FROM pg_stat_activity 
        WHERE state = 'active'
      `;
      return result[0]?.count || 0;
    } catch {
      return null;
    }
  }

  private async getTablesMetrics() {
    try {
      const metrics = await this.prisma.$queryRaw<any[]>`
        SELECT 
          schemaname,
          relname as table_name,
          n_live_tup as row_count,
          pg_size_pretty(pg_total_relation_size(relid)) as total_size
        FROM pg_stat_user_tables
        JOIN pg_class ON relname = relname
        WHERE schemaname = 'public'
      `;

      return metrics.map((metric) => ({
        tableName: metric.table_name,
        rowCount: metric.row_count,
        totalSize: metric.total_size,
      }));
    } catch {
      return null;
    }
  }

  private async getDatabaseSize() {
    try {
      const result = await this.prisma.$queryRaw<any[]>`
        SELECT pg_size_pretty(pg_database_size(current_database())) as size
      `;
      return result[0]?.size || null;
    } catch {
      return null;
    }
  }
}
