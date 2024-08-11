import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
  ) {}

  create(createArticleDto: CreateArticleDto, userId: string) {
    const user = new User();
    user.id = userId;
    return this.articlesRepository.save({
      ...createArticleDto,
      user: user,
    });
  }

  findAll() {
    return this.articlesRepository.find();
  }

  findOne(id: string) {
    return (
      this.articlesRepository
        .createQueryBuilder('article')
        .where('article.id = :id', { id })
        .innerJoinAndSelect('article.comments', 'comment')
        .innerJoinAndSelect('comment.user', 'commentUser')
        .innerJoinAndSelect('article.user', 'articleUser')
        .leftJoinAndSelect('comment.parent', 'parentComment')
        // .leftJoinAndSelect('article.likes', 'like')
        .loadRelationCountAndMap('article.likesCount', 'article.likes')
        .select([
          'article',
          'articleUser.id',
          'articleUser.username',
          'articleUser.avatarUrl',
          'comment.id',
          'comment.content',
          'parentComment.id',
          'commentUser.id',
          'commentUser.username',
          'commentUser.avatarUrl',
        ])
        .getOne()
    );
  }

  update(id: string, updateArticleDto: UpdateArticleDto, userId: string) {
    return this.articlesRepository.update(
      {
        id,
        user: { id: userId },
      },
      updateArticleDto,
    );
  }

  remove(id: string, userId: string) {
    return this.articlesRepository.delete({ id, user: { id: userId } });
  }

  findAll2() {
    return this.articlesRepository.find({ relations: ['comments'] });
  }
}
