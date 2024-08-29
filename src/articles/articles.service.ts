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
import { Reaction } from 'src/reactions/entities/reaction.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Reaction)
    private reactionRepository: Repository<Reaction>,
    private slugService: SlugService,
  ) {}

  // obtener todos los articulos
  async findAll() {
    const articles = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .loadRelationCountAndMap('article.totalReactions', 'article.reactions')
      .select([
        'article.id',
        'article.title',
        'article.content',
        'article.summary',
        'article.slug',
        'article.thumbnail',
        'author.id',
        'author.username',
        'author.profile_picture',
      ])
      .getMany();

    const articleIds = articles.map((article) => article.id);

    const topReactions = await this.reactionRepository
      .createQueryBuilder('reaction')
      .where('reaction.articleId IN (:...articleIds)', { articleIds })
      .select([
        'reaction.articleId',
        'reaction.type',
        'COUNT(reaction.id) as count',
      ])
      .groupBy('reaction.articleId, reaction.type')
      .orderBy('count', 'DESC')
      .addOrderBy('reaction.type')
      .getRawMany();

    const reactionMap = new Map<string, any[]>();

    topReactions.forEach((reaction) => {
      if (!reactionMap.has(reaction.articleId)) {
        reactionMap.set(reaction.articleId, []);
      }

      const reactions = reactionMap.get(reaction.articleId);
      if (reactions.length < 3) {
        reactions.push(reaction);
      }
    });

    articles.forEach((article) => {
      article.reactions = reactionMap.get(article.id) || [];
    });

    return articles;

    return articles;
  }

  // obtener articulo por slug
  async findOneBySlug(slug: string) {
    return this.articleRepository
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
      ])
      .getOne();
  }

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
