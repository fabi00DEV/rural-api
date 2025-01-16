import { Producer } from '../entities/producer.entity';
import { Farm } from '../entities/farm.entity';
import { Crop } from '../entities/crop.entity';

export interface SearchCriteria {
  term?: string;
  state?: string;
  city?: string;
  harvest?: string;
  crop?: string;
  minArea?: number;
  maxArea?: number;
  page?: number;
  limit?: number;
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ISearchRepository {
  searchProducers(criteria: SearchCriteria): Promise<SearchResult<Producer>>;
  searchFarms(criteria: SearchCriteria): Promise<SearchResult<Farm>>;
  searchCrops(criteria: SearchCriteria): Promise<SearchResult<Crop>>;
}
