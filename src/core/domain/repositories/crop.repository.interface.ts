import { Crop } from '../entities/crop.entity';
import { IBaseRepository } from './base.repository.interface';

export interface ICropRepository extends IBaseRepository<Crop> {
  findByFarmId(farmId: string): Promise<Crop[]>;
  findByHarvest(harvest: string): Promise<Crop[]>;
  findByFarmAndHarvest(farmId: string, harvest: string): Promise<Crop[]>;
  getCropDistribution(): Promise<
    Array<{
      cropName: string;
      count: number;
      farmCount: number;
      harvestCount: number;
    }>
  >;
  //   getHarvestDistribution(): Promise<
  //     Array<{
  //       harvest: string;
  //       cropCount: number;
  //       uniqueCrops: number;
  //     }>
  //   >;
}
