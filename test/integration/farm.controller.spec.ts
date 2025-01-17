import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('FarmController (Integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let producerId: string;

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

    // Cria um produtor para os testes
    const producer = await prisma.producer.create({
      data: {
        name: 'John Doe',
        document: '529.982.247-25',
      },
    });
    producerId = producer.id;
  });

  describe('POST /farms', () => {
    it('should create a farm', async () => {
      const response = await request(app.getHttpServer())
        .post('/farms')
        .send({
          name: 'Beautiful Farm',
          city: 'Farm City',
          state: 'FS',
          totalArea: 1000,
          agriculturalArea: 800,
          vegetationArea: 200,
          producerId: producerId,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Beautiful Farm');
      expect(response.body.totalArea).toBe(1000);
    });

    it('should fail if areas exceed total area', async () => {
      await request(app.getHttpServer())
        .post('/farms')
        .send({
          name: 'Invalid Farm',
          city: 'Farm City',
          state: 'FS',
          totalArea: 1000,
          agriculturalArea: 800,
          vegetationArea: 300, // 800 + 300 > 1000
          producerId: producerId,
        })
        .expect(400);
    });

    it('should fail if producer does not exist', async () => {
      await request(app.getHttpServer())
        .post('/farms')
        .send({
          name: 'Orphan Farm',
          city: 'Farm City',
          state: 'FS',
          totalArea: 1000,
          agriculturalArea: 800,
          vegetationArea: 200,
          producerId: 'non-existing-id',
        })
        .expect(404);
    });
  });

  describe('GET /farms/:id', () => {
    it('should get a farm with its crops', async () => {
      // Cria uma fazenda com cultura
      const farm = await prisma.farm.create({
        data: {
          name: 'Test Farm',
          city: 'Test City',
          state: 'TS',
          totalArea: 1000,
          agriculturalArea: 800,
          vegetationArea: 200,
          producerId,
          crops: {
            create: {
              name: 'Corn',
              harvest: '2023/2024',
            },
          },
        },
        include: {
          crops: true,
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/farms/${farm.id}`)
        .expect(200);

      expect(response.body.id).toBe(farm.id);
      expect(response.body.crops).toHaveLength(1);
      expect(response.body.crops[0].name).toBe('Corn');
    });
  });
});
