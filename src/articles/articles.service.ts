import { Injectable } from '@nestjs/common';
import * as Exceptions from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleStatus } from 'src/config/constants';
import { Repository } from 'typeorm';
import { DraftArticleDto } from './dto/draft-article.dto';
import { Article } from './entities/article.entity';
import { ReactionsService } from 'src/reactions/reactions.service';
import { Reaction } from 'src/reactions/entities/reaction.entity';
import { Comment } from 'src/comments/entities/comment.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    private reactionService: ReactionsService,
  ) {}

  async getPostsWithTopReactions() {
    const articles = await this.articleRepository
      .createQueryBuilder('article')
      .where('article.status = :status', { status: ArticleStatus.PUBLISHED })
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.tags', 'tags')
      .addSelect(
        (qb) =>
          qb
            .select('COUNT(comment.id)', 'totalComments')
            .from(Comment, 'comment')
            .where('comment.articleId = article.id'),
        'article_totalComments',
      )
      .leftJoinAndSelect(
        (qb) =>
          qb
            .select('reaction.articleId', 'articleId')
            .addSelect('reaction.type', 'type')
            .addSelect('COUNT(reaction.id)', 'count')
            .from(Reaction, 'reaction')
            .groupBy('reaction.articleId, reaction.type')
            .orderBy('reaction.articleId, COUNT(reaction.id)', 'DESC'),
        'reactions',
        '"reactions"."articleId" = "article"."id"',
      )
      .getRawMany();

    const groupedArticles = articles.reduce((acc, article) => {
      if (!acc[article.article_id]) {
        acc[article.article_id] = {
          id: article.article_id,
          title: article.article_title,
          summary: article.article_summary,
          slug: article.article_slug,
          thumbnail: article.article_thumbnail,
          totalComments: article.article_totalComments,
          author: {
            id: article.author_id,
            username: article.author_username,
            profile_picture: article.author_profile_picture,
          },
          reactions: {},
          tags: {},
        };
      }

      acc[article.article_id].reactions[article.type] = article.count;

      acc[article.article_id].tags[article.tags_id] = article.tags_name;

      return acc;
    }, {});

    const articlesArray: any[] = Object.values(groupedArticles);

    articlesArray.forEach((article) => {
      const reactions = Object.entries(article.reactions).map(
        ([type, count]) => ({
          type,
          count,
        }),
      );
      article.reactions = reactions;

      const tags = Object.entries(article.tags).map(([id, name]) => ({
        id,
        name,
      }));
      article.tags = tags;
    });

    return articlesArray;
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
