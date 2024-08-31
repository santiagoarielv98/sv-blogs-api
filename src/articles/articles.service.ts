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

  // obtener todos los articulos
  async findAll() {
    const articles = await this.articleRepository
      .createQueryBuilder('article')
      .where('article.status = :status', { status: ArticleStatus.PUBLISHED })
      .leftJoinAndSelect('article.author', 'author')
      .loadRelationCountAndMap('article.totalReactions', 'article.reactions')
      .select([
        'article.id',
        'article.title',
        'article.summary',
        'article.slug',
        'article.thumbnail',
        'author.id',
        'author.username',
        'author.profile_picture',
      ])
      .getMany();

    return articles;
  }

  // obtener articulo por slug
  async findOneBySlug(slug: string) {
    const article = await this.articleRepository
      .createQueryBuilder('article')
      .where('article.slug = :slug', { slug })
      .leftJoinAndSelect('article.author', 'author')
      .select([
        'article.id',
        'article.title',
        'article.content',
        'article.summary',
        'article.slug',
        'article.thumbnail',
        'author.id',
        'author.username',
        'author.email',
        'author.bio',
        'author.profile_picture',
      ])
      .getOne();

    if (!article) {
      throw new Exceptions.NotFoundException('Article not found');
    }

    return article;
  }

  // crear un articulo en borrador
  async draft(draftArticleDto: DraftArticleDto) {
    const newArticle = this.articleRepository.create(draftArticleDto);
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

  // TODO: implementar la actualización de un articulo
  async update(id: string, draftArticleDto: DraftArticleDto, user: User) {
    const article = await this.articleRepository.findOne({
      where: { author: user, id },
    });

    const updatedArticle = { ...article, ...draftArticleDto };

    if (!article) {
      throw new Exceptions.NotFoundException('Article not found');
    }

    if (article.status === ArticleStatus.PUBLISHED) {
      try {
        await validateOrReject(this.toPublishArticleDto(updatedArticle), {
          skipMissingProperties: true,
        });
      } catch (errors) {
        throw new Exceptions.BadRequestException(errors);
      }
      if (draftArticleDto.title && draftArticleDto.title !== article.title) {
        article.slug = await this.slugService.generateUniqueSlug(
          draftArticleDto.title,
        );
      }
    }
    article.title = updatedArticle.title;
    article.content = updatedArticle.content;

    return this.articleRepository.save(article);
  }

  public toPublishArticleDto(article: Article): PublishArticleDto {
    const publishArticleDto = new PublishArticleDto();
    publishArticleDto.title = article.title;
    publishArticleDto.content = article.content;
    return publishArticleDto;
  }
}
