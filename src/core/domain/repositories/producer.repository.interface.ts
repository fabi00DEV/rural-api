import { Producer } from '../entities/producer.entity';
import { IBaseRepository } from './base.repository.interface';

export interface IProducerRepository extends IBaseRepository<Producer> {
  findByDocument(document: string): Promise<Producer | null>;
  //   findAllWithFarms(
  //     page?: number,
  //     limit?: number,
  //   ): Promise<{ items: Producer[]; total: number }>;
  //   findByFarmId(farmId: string): Promise<Producer | null>;
  //   getProducerStatistics(): Promise<{
  //     totalProducers: number;
  //     totalFarms: number;
  //     averageFarmsPerProducer: number;
  //   }>;
}
