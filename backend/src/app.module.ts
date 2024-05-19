import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthenticationMiddleware } from './middlewares/authentication.middleware';
import { LinksModule } from './modules/links/links.module';
import { PrismaService } from './shared/prisma.service';

@Module({
  imports: [LinksModule, UsersModule, AuthModule],
  providers: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('*');
  }
}
