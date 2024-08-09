import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Article } from './entities/article.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Article, User])],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
