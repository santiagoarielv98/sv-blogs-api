import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesModule } from './articles/articles.module';
import { AuthModule } from './auth/auth.module';
import { CommentReactionsModule } from './comment-reactions/comment-reactions.module';
import { CommentsModule } from './comments/comments.module';
import { DATABASE_CONFIG } from './config/constants';
import databaseConfig from './config/database.config';
import { ReactionsModule } from './reactions/reactions.module';
import { SeedsModule } from './seeds/seeds.module';
import { TagsModule } from './tags/tags.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService) => configService.get(DATABASE_CONFIG),
      inject: [ConfigService],
    }),
    ArticlesModule,
    UsersModule,
    AuthModule,
    CommentsModule,
    ReactionsModule,
    TagsModule,
    CommentReactionsModule,
    SeedsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
