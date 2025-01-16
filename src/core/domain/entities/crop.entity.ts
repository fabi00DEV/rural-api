import { BusinessError } from '@/shared/errors/custom.erros';

export class Crop {
  constructor(
    public readonly id: string | null,
    public name: string,
    public harvest: string,
    public farmId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt?: Date,
  ) {}

  validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new BusinessError('Nome da cultura é obrigatório');
    }

    if (!this.harvest || this.harvest.trim().length === 0) {
      throw new BusinessError('Safra é obrigatória');
    }

    // Valida o formato da safra (ex: "2023/2024" ou "2023")
    const harvestRegex = /^(20\d{2})(\/20\d{2})?$/;
    if (!harvestRegex.test(this.harvest)) {
      throw new BusinessError(
        'Formato de safra inválido. Use "AAAA" ou "AAAA/AAAA"',
      );
    }
  }

  updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new BusinessError('Nome da cultura é obrigatório');
    }
    this.name = newName;
  }

  updateHarvest(newHarvest: string): void {
    if (!newHarvest || newHarvest.trim().length === 0) {
      throw new BusinessError('Safra é obrigatória');
    }

    const harvestRegex = /^(20\d{2})(\/20\d{2})?$/;
    if (!harvestRegex.test(newHarvest)) {
      throw new BusinessError(
        'Formato de safra inválido. Use "AAAA" ou "AAAA/AAAA"',
      );
    }

    this.harvest = newHarvest;
  }
}
