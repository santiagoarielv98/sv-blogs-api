import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reaction } from 'src/reactions/entities/reaction.entity';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { Article } from './entities/article.entity';
import { SlugService } from './slug.service';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Reaction])],
  controllers: [ArticlesController],
  providers: [ArticlesService, SlugService],
})
export class ArticlesModule {}
