import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { FileService } from './file/file.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ArticlesModule } from './articles/articles.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UsersModule, DbModule, AuthModule, ArticlesModule, CommentsModule, LikesModule, TagsModule],
  controllers: [AppController],
  providers: [AppService, FileService],
})
export class AppModule {}
