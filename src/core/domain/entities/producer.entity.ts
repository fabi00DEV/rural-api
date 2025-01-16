import { Farm } from './farm.entity';
import { BusinessError } from '@/shared/errors/custom.erros';

export class Producer {
  constructor(
    public readonly id: string | null,
    public name: string,
    public document: string,
    public farms: Farm[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt?: Date,
  ) {}

  validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new BusinessError('Nome do produtor é obrigatório');
    }

    if (!this.document || this.document.trim().length === 0) {
      throw new BusinessError('Documento é obrigatório');
    }

    // Valida o formato básico do documento (CPF/CNPJ)
    const cleanDocument = this.document.replace(/\D/g, '');
    if (cleanDocument.length !== 11 && cleanDocument.length !== 14) {
      throw new BusinessError(
        'Documento deve ser um CPF (11 dígitos) ou CNPJ (14 dígitos)',
      );
    }
  }

  addFarm(farm: Farm): void {
    this.farms.push(farm);
  }

  removeFarm(farmId: string): void {
    const farmIndex = this.farms.findIndex((farm) => farm.id === farmId);
    if (farmIndex === -1) {
      throw new BusinessError('Fazenda não encontrada');
    }
    this.farms.splice(farmIndex, 1);
  }

  updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new BusinessError('Nome do produtor é obrigatório');
    }
    this.name = newName;
  }
}
