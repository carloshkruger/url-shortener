import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../../shared/prisma.service';
import { UsersController } from './users.controller';
import { HashService } from '../../shared/hash.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, HashService],
  exports: [UsersService],
})
export class UsersModule {}
