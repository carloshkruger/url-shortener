import './mock-nanoid';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../src/shared/prisma.service';
import { HashService } from '../src/shared/hash.service';
import { randomUUID } from 'node:crypto';
import { execMigrations } from './database.utils';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let prismaService: PrismaService;
  let hashService: HashService;

  beforeAll(async () => {
    await execMigrations();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jwtService = app.get(JwtService);
    prismaService = app.get(PrismaService);
    hashService = app.get(HashService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /users', () => {
    it('should create an user', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'user name',
          email: 'email@email.com',
          password: '123456',
        })
        .expect(201)
        .then((result) => {
          expect(result.body).toMatchObject({
            id: expect.any(String),
          });
          expect(result.body).not.toHaveProperty('password');
        });

      const user = await prismaService.user.findFirst({
        where: {
          email: 'email@email.com',
        },
      });

      expect(user).toBeTruthy();
    });
  });

  describe('GET /users/links', () => {
    it('should return the user links', async () => {
      const user = await prismaService.user.create({
        data: {
          id: randomUUID(),
          email: 'johndoe@email.com',
          name: 'John Doe',
          password: await hashService.hash('123'),
        },
      });
      await prismaService.link.create({
        data: {
          id: randomUUID(),
          longUrl: 'https://google.com',
          shortUrl: 'abcdefg',
          userId: user.id,
        },
      });
      const authToken = await jwtService.signAsync({ sub: user.id });

      await request(app.getHttpServer())
        .get('/users/links')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .then((result) => {
          expect(result.body).toHaveLength(1);
        });
    });

    it('should return an error if not authenticated', async () => {
      await request(app.getHttpServer()).get('/users/links').expect(401);
    });
  });
});
