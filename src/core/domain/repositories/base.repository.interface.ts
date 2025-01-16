export interface IBaseRepository<T> {
  create(entity: T): Promise<T>;
  findById(id: string): Promise<T | null>;
  update(id: string, entity: T): Promise<T>;
  delete(id: string): Promise<void>;
  //   findAll(
  //     page?: number,
  //     limit?: number,
  //   ): Promise<{ items: T[]; total: number }>;
}
