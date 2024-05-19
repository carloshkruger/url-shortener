import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUser } from './dto/create-user.dto';
import { User, UsersService } from './users.service';
import { LoggedUser } from '../../decorators/logged-user.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { Link } from '../links/links.service';

@ApiTags('Users')
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('users')
  @ApiOperation({ summary: 'Create an user' })
  @ApiResponse({ status: 200, description: 'Created user' })
  @ApiResponse({ status: 422, description: 'E-mail already in use' })
  createUser(@Body() data: CreateUser): Promise<Omit<User, 'password'>> {
    return this.usersService.create(data);
  }

  @Get('users/links')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all user links' })
  @ApiResponse({ status: 200, description: 'User links' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserLinks(@LoggedUser('id') userId: string): Promise<Link[]> {
    const links = await this.usersService.getUserLinks(userId);
    for (const link of links) {
      link.shortUrl = `${process.env.APP_URL}/${link.shortUrl}`;
    }
    return links;
  }
}
