import './mock-nanoid';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/shared/prisma.service';
import { randomUUID } from 'node:crypto';
import { HashService } from '../src/shared/hash.service';
import { JwtService } from '@nestjs/jwt';
import { execMigrations } from './database.utils';

const userId = randomUUID();
const userEmail = 'johndoe@email.com';
const userPlainPassword = '123456';

describe('LinksController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    await execMigrations();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jwtService = app.get(JwtService);
    prismaService = app.get(PrismaService);

    const hashService = app.get(HashService);
    await prismaService.user.create({
      data: {
        id: userId,
        email: userEmail,
        name: 'John Doe',
        password: await hashService.hash(userPlainPassword),
      },
    });
  });

  beforeEach(async () => {
    await prismaService.link.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /links/shorten', () => {
    it('should shorten an link with signed in user', async () => {
      const authToken = await jwtService.signAsync({ sub: userId });

      await request(app.getHttpServer())
        .post('/links/shorten')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          url: 'https://google.com',
        })
        .expect(201)
        .then((result) => {
          expect(result.body).toMatchObject({
            id: expect.any(String),
            longUrl: 'https://google.com',
            shortUrl: expect.any(String),
            userId: userId,
          });
        });

      const link = await prismaService.link.findFirst({
        where: {
          longUrl: 'https://google.com',
        },
      });
      expect(link).toBeTruthy();
    });
  });

  describe('DELETE /links/:linkId', () => {
    it('should delete a link', async () => {
      const authToken = await jwtService.signAsync({ sub: userId });

      const link = await prismaService.link.create({
        data: {
          id: randomUUID(),
          longUrl: 'https://google.com',
          shortUrl: 'abcdefg',
          userId,
        },
      });

      await request(app.getHttpServer())
        .del(`/links/${link.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send()
        .expect(204);

      const linkAfterDelete = await prismaService.link.findFirst({
        where: {
          longUrl: 'https://google.com',
        },
      });
      expect(linkAfterDelete).toBeFalsy();
    });
  });

  describe('GET /links/original/:url', () => {
    it('should return the original url', async () => {
      const link = await prismaService.link.create({
        data: {
          id: randomUUID(),
          longUrl: 'https://google.com',
          shortUrl: 'abcdefg',
          userId: null,
        },
      });

      await request(app.getHttpServer())
        .get(`/links/original/${link.shortUrl}`)
        .expect(200)
        .then((result) => {
          expect(result.body.url).toBe('https://google.com');
        });
    });
  });
});
