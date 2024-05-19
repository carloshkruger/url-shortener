import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LinksService, Link } from './links.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoggedUser } from '../../decorators/logged-user.decorator';
import { CreateShortLink } from './dto/create-short-link.dto';
import { AuthGuard } from '../../guards/auth.guard';

const linkExample: Link = {
  id: '19655853-f220-47f9-95b5-bd8047a1d213',
  longUrl: 'https://google.com',
  shortUrl: 'abcdefg',
  userId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

@ApiTags('Links')
@Controller()
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post('links/shorten')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Shorten an URL' })
  @ApiResponse({
    status: 200,
    description: 'Shorten URL info',
    schema: {
      example: linkExample,
    },
  })
  async createShortUrl(
    @Body() data: CreateShortLink,
    @LoggedUser('id') userId: string,
  ): Promise<Link> {
    const response = await this.linksService.createShortLink(data, userId);
    response.shortUrl = `${process.env.APP_URL}/${response.shortUrl}`;
    return response;
  }

  @Delete('links/:linkId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a link' })
  @ApiResponse({ status: 204, description: 'Link deleted' })
  @ApiResponse({ status: 404, description: 'Link not found' })
  deleteUrl(
    @Param('linkId') linkId: string,
    @LoggedUser('id') userId: string,
  ): Promise<void> {
    return this.linksService.deleteLink(linkId, userId);
  }

  @Get('links/original/:url')
  @ApiOperation({ summary: 'Return the original URL' })
  @ApiResponse({ status: 200, description: 'Return the original URL' })
  @ApiResponse({ status: 404, description: 'Link not found' })
  async getOriginalUrl(@Param('url') url: string) {
    const longUrl = await this.linksService.getLongUrl(url);

    return {
      url: longUrl,
    };
  }
}
