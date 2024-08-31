import { Injectable } from '@nestjs/common';
import * as Exceptions from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleStatus } from 'src/config/constants';
import { Repository } from 'typeorm';
import { DraftArticleDto } from './dto/draft-article.dto';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
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
}
