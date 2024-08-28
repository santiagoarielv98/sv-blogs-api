import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleStatus } from 'src/config/constants';
import { Repository } from 'typeorm';
import { DraftArticleDto } from './dto/draft-article.dto';
import { Article } from './entities/article.entity';
import { User } from 'src/users/entities/user.entity';
import { PublishArticleDto } from './dto/publish-article.dto';
import * as Exceptions from '@nestjs/common/exceptions';
import { validateOrReject } from 'class-validator';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  // crear un articulo en borrador
  async draft(draftArticleDto: DraftArticleDto, user: User) {
    const newArticle = await this.createArticle(
      draftArticleDto,
      user,
      ArticleStatus.DRAFT,
    );

    return this.articleRepository.save(newArticle);
  }

  // publicar un articulo ya creado
  async publish(id: string, User: User) {
    const article = await this.articleRepository.findOne({
      where: { author: User, id },
    });

    if (!article) {
      throw new Exceptions.NotFoundException('Article not found');
    }

    if (article.status === ArticleStatus.PUBLISHED) {
      throw new Exceptions.ConflictException('Article already published');
    }

    try {
      await validateOrReject(article, { skipMissingProperties: true });
    } catch (errors) {
      throw new Exceptions.BadRequestException(errors);
    }

    article.status = ArticleStatus.PUBLISHED;
    return this.articleRepository.save(article);
  }

  // crear un articulo y publicarlo
  async createAndPublish(publishArticleDto: PublishArticleDto, user: User) {
    const newArticle = await this.createArticle(
      publishArticleDto,
      user,
      ArticleStatus.PUBLISHED,
    );

    return this.articleRepository.save(newArticle);
  }

  private async createArticle(
    dto: DraftArticleDto | PublishArticleDto,
    user: User,
    status: ArticleStatus,
  ) {
    const newArticle = this.articleRepository.create();
    newArticle.title = dto.title;
    newArticle.content = dto.content;
    newArticle.status = status;
    newArticle.author = user;

    return newArticle;
  }
}
