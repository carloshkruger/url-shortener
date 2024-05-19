import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { User as PrismaUser } from '@prisma/client';
import { CreateUser } from './dto/create-user.dto';
import { PrismaService } from '../../shared/prisma.service';
import { randomUUID } from 'node:crypto';
import { HashService } from '../../shared/hash.service';
import { Link } from '../links/links.service';

export type User = PrismaUser;

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private hashService: HashService,
  ) {}

  async create(data: CreateUser): Promise<Omit<User, 'password'>> {
    const userByEmail = await this.prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (userByEmail) {
      throw new UnprocessableEntityException('E-mail already in use.');
    }

    const password = await this.hashService.hash(data.password);

    const response = await this.prisma.user.create({
      data: {
        id: randomUUID(),
        name: data.name,
        email: data.email,
        password,
      },
    });

    delete response.password;

    return response;
  }

  async getUserLinks(userId: string): Promise<Link[]> {
    return this.prisma.link.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
