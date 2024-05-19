import './mock-nanoid';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/shared/prisma.service';
import { randomUUID } from 'node:crypto';
import { HashService } from '../src/shared/hash.service';
import { execMigrations } from './database.utils';

const userEmail = 'johndoe@email.com';
const userPlainPassword = '123456';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    await execMigrations();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const prisma = app.get(PrismaService);
    const hashService = app.get(HashService);
    await prisma.user.create({
      data: {
        id: randomUUID(),
        email: userEmail,
        name: 'John Doe',
        password: await hashService.hash(userPlainPassword),
      },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/login', () => {
    it('should sign in an user', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: userEmail,
          password: userPlainPassword,
        })
        .expect(200)
        .then((result) => {
          expect(result.body).toMatchObject({
            accessToken: expect.any(String),
          });
        });
    });

    it('should return an error if the user does not exists', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'email_that_does_not_exists@email.com',
          password: userPlainPassword,
        })
        .expect(401);
    });
  });
});
