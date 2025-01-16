import { Crop } from './crop.entity';
import { BusinessError } from '@/shared/errors/custom.erros';

export class Farm {
  constructor(
    public readonly id: string | null,
    public name: string,
    public city: string,
    public state: string,
    public totalArea: number,
    public agriculturalArea: number,
    public vegetationArea: number,
    public producerId: string,
    public crops: Crop[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt?: Date,
  ) {}

  validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new BusinessError('Nome da fazenda é obrigatório');
    }

    if (!this.city || this.city.trim().length === 0) {
      throw new BusinessError('Cidade é obrigatória');
    }

    if (!this.state || this.state.trim().length === 0) {
      throw new BusinessError('Estado é obrigatório');
    }

    if (this.totalArea <= 0) {
      throw new BusinessError('Área total deve ser maior que zero');
    }

    if (this.agriculturalArea < 0) {
      throw new BusinessError('Área agrícola não pode ser negativa');
    }

    if (this.vegetationArea < 0) {
      throw new BusinessError('Área de vegetação não pode ser negativa');
    }

    if (this.agriculturalArea + this.vegetationArea > this.totalArea) {
      throw new BusinessError(
        'A soma das áreas não pode ultrapassar a área total da fazenda',
      );
    }
  }

  addCrop(crop: Crop): void {
    // Verifica se já existe uma cultura com o mesmo nome para a mesma safra
    const existingCrop = this.crops.find(
      (c) => c.name === crop.name && c.harvest === crop.harvest,
    );

    if (existingCrop) {
      throw new BusinessError(
        `Já existe a cultura ${crop.name} registrada para a safra ${crop.harvest}`,
      );
    }

    this.crops.push(crop);
  }

  removeCrop(cropId: string): void {
    const cropIndex = this.crops.findIndex((crop) => crop.id === cropId);
    if (cropIndex === -1) {
      throw new BusinessError('Cultura não encontrada');
    }
    this.crops.splice(cropIndex, 1);
  }

  updateAreas(agriculturalArea: number, vegetationArea: number): void {
    if (agriculturalArea + vegetationArea > this.totalArea) {
      throw new BusinessError(
        'A soma das áreas não pode ultrapassar a área total da fazenda',
      );
    }

    this.agriculturalArea = agriculturalArea;
    this.vegetationArea = vegetationArea;
  }

  getCropsByHarvest(harvest: string): Crop[] {
    return this.crops.filter((crop) => crop.harvest === harvest);
  }
}
