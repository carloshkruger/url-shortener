import { PrismaService } from '../../shared/prisma.service';
import { Module } from '@nestjs/common';
import { LinksController } from './links.controller';
import { LinksService } from './links.service';
import { CacheService } from '../../shared/cache.service';

@Module({
  imports: [],
  controllers: [LinksController],
  providers: [LinksService, PrismaService, CacheService],
})
export class LinksModule {}
