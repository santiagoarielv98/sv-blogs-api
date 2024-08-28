import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesModule } from './articles/articles.module';
import { DATABASE_CONFIG } from './config/constants';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './config/database.config';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { ReactionsModule } from './reactions/reactions.module';
import { TagsModule } from './tags/tags.module';
import { ArticleTagsModule } from './article-tags/article-tags.module';
import { CommentReactionsModule } from './comment-reactions/comment-reactions.module';
import { SeedsModule } from './seeds/seeds.module';

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
    ArticleTagsModule,
    CommentReactionsModule,
    SeedsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
