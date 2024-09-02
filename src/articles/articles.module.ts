import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reaction } from 'src/reactions/entities/reaction.entity';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { Article } from './entities/article.entity';
import { SlugService } from './slug.service';
import { ReactionsService } from 'src/reactions/reactions.service';
import { CommentsService } from 'src/comments/comments.service';
import { Comment } from 'src/comments/entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Reaction, Comment])],
  controllers: [ArticlesController],
  providers: [ArticlesService, SlugService, ReactionsService, CommentsService],
})
export class ArticlesModule {}
