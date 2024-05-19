import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreateShortLink {
  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({ description: 'Long URL', example: 'https://google.com' })
  url: string;
}
