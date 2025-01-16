import { Injectable } from '@nestjs/common';

@Injectable()
export class DocumentValidator {
  public isValid(document: string): boolean {
    if (!document) return false;

    const cleanDocument = String(document).replace(/[^\d]+/g, '');

    if (cleanDocument.length === 11) {
      return this.validateCPF(cleanDocument);
    } else if (cleanDocument.length === 14) {
      return this.validateCNPJ(cleanDocument);
    }

    return false;
  }

  public format(document: string): string {
    const cleanDocument = document.replace(/[^\d]+/g, '');

    if (cleanDocument.length === 11) {
      return cleanDocument.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        '$1.$2.$3-$4',
      );
    } else if (cleanDocument.length === 14) {
      return cleanDocument.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        '$1.$2.$3/$4-$5',
      );
    }

    return document;
  }

  public clean(document: string): string {
    return document.replace(/[^\d]+/g, '');
  }

  private validateCPF(cpf: string): boolean {
    if (cpf.length !== 11) return false;

    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;

    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return false;

    return true;
  }

  private validateCNPJ(cnpj: string): boolean {
    // Verifica se tem 14 dígitos
    if (cnpj.length !== 14) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{13}$/.test(cnpj)) return false;

    // Validação do primeiro dígito verificador
    let size = 12;
    let numbers = cnpj.substring(0, size);
    const digits = cnpj.substring(size);
    let sum = 0;
    let pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return false;

    // Validação do segundo dígito verificador
    size = 13;
    numbers = cnpj.substring(0, size);
    sum = 0;
    pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) return false;

    return true;
  }

  public isCPF(document: string): boolean {
    const cleanDocument = this.clean(document);
    return cleanDocument.length === 11 && this.validateCPF(cleanDocument);
  }

  public isCNPJ(document: string): boolean {
    const cleanDocument = this.clean(document);
    return cleanDocument.length === 14 && this.validateCNPJ(cleanDocument);
  }
}
