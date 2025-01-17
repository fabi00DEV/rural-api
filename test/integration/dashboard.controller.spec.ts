import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('DashboardController (Integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);

    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Limpa o banco antes de cada teste
    await prisma.crop.deleteMany();
    await prisma.farm.deleteMany();
    await prisma.producer.deleteMany();

    // Cria dados de teste
    await prisma.producer.create({
      data: {
        name: 'John Doe',
        document: '529.982.247-25',
        farms: {
          create: {
            name: 'Test Farm',
            city: 'Test City',
            state: 'TS',
            totalArea: 1000,
            agriculturalArea: 800,
            vegetationArea: 200,
            crops: {
              create: [
                { name: 'Corn', harvest: '2023/2024' },
                { name: 'Soy', harvest: '2023/2024' },
              ],
            },
          },
        },
      },
    });
  });

  describe('GET /dashboard', () => {
    it('should return correct metrics', async () => {
      const response = await request(app.getHttpServer())
        .get('/dashboard')
        .expect(200);

      expect(response.body.overview.totalProducers).toBe(1);
      expect(response.body.overview.totalFarms).toBe(1);
      expect(response.body.overview.totalArea).toBe(1000);
      expect(response.body.overview.totalCrops).toBe(2);

      expect(response.body.stateDistribution).toHaveLength(1);
      expect(response.body.stateDistribution[0].state).toBe('TS');

      expect(response.body.landUseDistribution.agriculturalArea).toBe(800);
      expect(response.body.landUseDistribution.vegetationArea).toBe(200);

      expect(response.body.cropDistribution).toHaveLength(2);
    });

    it('should return empty metrics when no data exists', async () => {
      await prisma.crop.deleteMany();
      await prisma.farm.deleteMany();
      await prisma.producer.deleteMany();

      const response = await request(app.getHttpServer())
        .get('/dashboard')
        .expect(200);

      expect(response.body.overview.totalProducers).toBe(0);
      expect(response.body.overview.totalFarms).toBe(0);
      expect(response.body.overview.totalCrops).toBe(0);
      expect(response.body.stateDistribution).toHaveLength(0);
      expect(response.body.cropDistribution).toHaveLength(0);
    });
  });
});
