import 'jest';

beforeAll(async () => {
  // Setup global para testes unitários
});

afterAll(async () => {
  // Cleanup após testes
});

global.console = {
  ...console,
  // log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// test/jest-setup-e2e.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

beforeEach(async () => {
  // Limpa o banco de dados antes de cada teste
  await prisma.crop.deleteMany();
  await prisma.farm.deleteMany();
  await prisma.producer.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
