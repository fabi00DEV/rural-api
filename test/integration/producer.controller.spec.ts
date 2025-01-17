import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('ProducerController (Integration)', () => {
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
  });

  describe('POST /producers', () => {
    it('should create a producer', async () => {
      const response = await request(app.getHttpServer())
        .post('/producers')
        .send({
          name: 'John Doe',
          document: '529.982.247-25',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('John Doe');
      expect(response.body.document).toBe('529.982.247-25');
    });

    it('should fail with invalid document', async () => {
      await request(app.getHttpServer())
        .post('/producers')
        .send({
          name: 'John Doe',
          document: '111.111.111-11',
        })
        .expect(400);
    });

    it('should fail with duplicate document', async () => {
      // Cria o primeiro produtor
      await request(app.getHttpServer())
        .post('/producers')
        .send({
          name: 'John Doe',
          document: '529.982.247-25',
        })
        .expect(201);

      // Tenta criar outro com mesmo documento
      await request(app.getHttpServer())
        .post('/producers')
        .send({
          name: 'Jane Doe',
          document: '529.982.247-25',
        })
        .expect(400);
    });
  });

  describe('GET /producers/:id', () => {
    it('should get a producer by id', async () => {
      // Cria um produtor primeiro
      const createResponse = await request(app.getHttpServer())
        .post('/producers')
        .send({
          name: 'John Doe',
          document: '529.982.247-25',
        });

      const response = await request(app.getHttpServer())
        .get(`/producers/${createResponse.body.id}`)
        .expect(200);

      expect(response.body.id).toBe(createResponse.body.id);
      expect(response.body.name).toBe('John Doe');
    });

    it('should return 404 for non-existing producer', async () => {
      await request(app.getHttpServer())
        .get('/producers/non-existing-id')
        .expect(404);
    });
  });
});
