import { Injectable } from '@nestjs/common';
import * as Exceptions from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { validateOrReject } from 'class-validator';
import { ArticleStatus } from 'src/config/constants';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { DraftArticleDto } from './dto/draft-article.dto';
import { PublishArticleDto } from './dto/publish-article.dto';
import { Article } from './entities/article.entity';
import { SlugService } from './slug.service';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    private slugService: SlugService,
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
      await validateOrReject(this.toPublishArticleDto(article), {
        skipMissingProperties: true,
      });
    } catch (errors) {
      throw new Exceptions.BadRequestException(errors);
    }

    article.slug = await this.slugService.generateUniqueSlug(article.title);
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

    newArticle.slug = await this.slugService.generateUniqueSlug(
      newArticle.title,
    );

    return this.articleRepository.save(newArticle);
  }

  public toPublishArticleDto(article: Article): PublishArticleDto {
    const publishArticleDto = new PublishArticleDto();
    publishArticleDto.title = article.title;
    publishArticleDto.content = article.content;
    return publishArticleDto;
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
  update(id: string, draftArticleDto: DraftArticleDto, user: User) {
    throw new Error('Method not implemented.');
  }
}
