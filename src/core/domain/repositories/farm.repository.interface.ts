import { Farm } from '../entities/farm.entity';

export interface IFarmRepository {
  create(farm: Farm): Promise<Farm>;
  findById(id: string): Promise<Farm | null>;
  update(id: string, farm: Farm): Promise<Farm>;
  delete(id: string): Promise<void>;
  findByProducerId(id: string): Promise<Farm[] | null>;
}
