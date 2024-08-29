import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { Article } from './entities/article.entity';
import { SlugService } from './slug.service';
import { Reaction } from 'src/reactions/entities/reaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Reaction]), UsersModule],
  controllers: [ArticlesController],
  providers: [ArticlesService, SlugService],
})
export class ArticlesModule {}
