// test/unit/validators/document.validator.spec.ts

import { DocumentValidator } from '@/shared/validators/document.validator';

describe('DocumentValidator', () => {
  let validator: DocumentValidator;

  beforeEach(() => {
    validator = new DocumentValidator();
  });

  describe('CPF Validation', () => {
    it('should validate correct CPF', () => {
      expect(validator.isValid('529.982.247-25')).toBe(true);
      expect(validator.isValid('52998224725')).toBe(true);
    });

    it('should invalidate incorrect CPF', () => {
      expect(validator.isValid('111.111.111-11')).toBe(false);
      expect(validator.isValid('123.456.789-10')).toBe(false);
    });

    it('should validate CPF with special characters', () => {
      expect(validator.isValid('529.982.247-25')).toBe(true);
      expect(validator.isValid('529-982-247.25')).toBe(true);
    });

    it('should invalidate CPF with wrong length', () => {
      expect(validator.isValid('123.456.789')).toBe(false);
      expect(validator.isValid('123.456.789-100')).toBe(false);
    });
  });

  describe('CNPJ Validation', () => {
    it('should validate correct CNPJ', () => {
      expect(validator.isValid('11.222.333/0001-81')).toBe(true);
      expect(validator.isValid('11222333000181')).toBe(true);
    });

    it('should invalidate incorrect CNPJ', () => {
      expect(validator.isValid('11.111.111/1111-11')).toBe(false);
      expect(validator.isValid('11.222.333/0001-00')).toBe(false);
    });

    it('should validate CNPJ with special characters', () => {
      expect(validator.isValid('11.222.333/0001-81')).toBe(true);
      expect(validator.isValid('11-222-333/0001.81')).toBe(true);
    });

    it('should invalidate CNPJ with wrong length', () => {
      expect(validator.isValid('11.222.333/0001')).toBe(false);
      expect(validator.isValid('11.222.333/0001-811')).toBe(false);
    });
  });

  describe('Format Method', () => {
    it('should format CPF correctly', () => {
      expect(validator.format('52998224725')).toBe('529.982.247-25');
    });

    it('should format CNPJ correctly', () => {
      expect(validator.format('11222333000181')).toBe('11.222.333/0001-81');
    });

    it('should handle already formatted documents', () => {
      expect(validator.format('529.982.247-25')).toBe('529.982.247-25');
      expect(validator.format('11.222.333/0001-81')).toBe('11.222.333/0001-81');
    });
  });

  describe('Clean Method', () => {
    it('should remove all special characters from CPF', () => {
      expect(validator.clean('529.982.247-25')).toBe('52998224725');
    });

    it('should remove all special characters from CNPJ', () => {
      expect(validator.clean('11.222.333/0001-81')).toBe('11222333000181');
    });

    it('should handle already clean documents', () => {
      expect(validator.clean('52998224725')).toBe('52998224725');
      expect(validator.clean('11222333000181')).toBe('11222333000181');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty or null input', () => {
      expect(validator.isValid('')).toBe(false);
      expect(validator.isValid(null)).toBe(false);
      expect(validator.isValid(undefined)).toBe(false);
    });

    it('should handle invalid input types', () => {
      expect(validator.isValid(123 as any)).toBe(false);
      expect(validator.isValid({} as any)).toBe(false);
      expect(validator.isValid([] as any)).toBe(false);
    });

    it('should handle documents with only zeros', () => {
      expect(validator.isValid('00000000000')).toBe(false);
      expect(validator.isValid('00000000000000')).toBe(false);
    });

    it('should handle documents with repeated digits', () => {
      expect(validator.isValid('11111111111')).toBe(false);
      expect(validator.isValid('22222222222222')).toBe(false);
    });
  });
});
