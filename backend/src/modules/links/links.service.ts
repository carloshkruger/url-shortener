import { randomUUID } from 'node:crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { Link as PrismaLink } from '@prisma/client';
import { PrismaService } from '../../shared/prisma.service';
import { isValidUrl } from '../../utils/url.utils';
import { CreateShortLink } from './dto/create-short-link.dto';
import { daysToSeconds } from '../../utils/time.utils';
import { CacheService } from '../../shared/cache.service';

const SHORT_URL_LENGTH = 7;
const LINK_CACHE_KEY_PREFIX = 'links-';
const LINK_CACHE_TTL_IN_SECONDS = daysToSeconds(7);

export type Link = PrismaLink;

@Injectable()
export class LinksService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  async createShortLink(
    { url }: CreateShortLink,
    userId: string,
  ): Promise<Link> {
    if (!isValidUrl(url)) {
      url = `http://${url}`;
    }

    const link = await this.prisma.link.findFirst({
      where: {
        userId,
        longUrl: url,
      },
    });

    if (link) {
      return link;
    }

    const shortUrl = nanoid(SHORT_URL_LENGTH);

    const response = await this.prisma.link.create({
      data: {
        id: randomUUID(),
        longUrl: url,
        shortUrl,
        userId,
      },
    });

    return response;
  }

  async deleteLink(linkId: string, userId: string): Promise<void> {
    const link = await this.prisma.link.findFirst({
      where: {
        id: linkId,
        userId,
      },
    });

    if (!link) {
      throw new NotFoundException('Link not found.');
    }

    await this.prisma.link.delete({
      where: {
        id: link.id,
      },
    });

    const cacheKey = this.getLinkCacheKey(link.shortUrl);
    await this.cache.del(cacheKey);
  }

  async getLongUrl(shortUrl: string): Promise<string> {
    const cacheKey = this.getLinkCacheKey(shortUrl);

    const dataFromCache = await this.cache.get(cacheKey);

    if (dataFromCache) {
      return dataFromCache;
    }

    const link = await this.prisma.link.findFirst({
      where: {
        shortUrl,
      },
    });

    if (!link) {
      throw new NotFoundException('Link not found.');
    }

    const response = link.longUrl;

    await this.cache.set(cacheKey, response, LINK_CACHE_TTL_IN_SECONDS);

    return response;
  }

  private getLinkCacheKey(shortUrl: string): string {
    return `${LINK_CACHE_KEY_PREFIX}${shortUrl}`;
  }
}
