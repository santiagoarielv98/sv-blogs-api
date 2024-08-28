import { Module } from '@nestjs/common';
import { ArticleTagsService } from './article-tags.service';
import { ArticleTagsController } from './article-tags.controller';

@Module({
  controllers: [ArticleTagsController],
  providers: [ArticleTagsService],
})
export class ArticleTagsModule {}
