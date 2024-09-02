import { Injectable } from '@nestjs/common';
import * as Exceptions from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { ReactionsService } from 'src/reactions/reactions.service';
import { Repository } from 'typeorm';
import { DraftArticleDto } from './dto/draft-article.dto';
import { Article } from './entities/article.entity';
import { CommentsService } from 'src/comments/comments.service';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    private reactionService: ReactionsService,
    private commentService: CommentsService,
  ) {}

  async findAll() {
    const articles: any[] = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.tags', 'tags')
      .loadRelationCountAndMap('article.totalComments', 'article.comments')
      .getMany();

    const articlesIds = articles.map((article) => article.id);

    const reactions =
      await this.reactionService.getReactionsByArticlesIds(articlesIds);

    const groupedReactions = reactions.reduce((acc, reaction) => {
      if (!acc[reaction.articleId]) {
        acc[reaction.articleId] = {};
      }

      acc[reaction.articleId][reaction.type] = reaction.count;

      return acc;
    }, {});

    articles.forEach((article) => {
      const articleReactions = groupedReactions[article.id] || {};
      const reactions = Object.entries(articleReactions).map(
        ([type, count]) => ({
          type,
          count: parseInt(count as string),
        }),
      );
      article.reactions = reactions;

      const totalReactions = reactions.reduce(
        (acc, reaction) => acc + reaction.count,
        0,
      );

      article.totalReactions = totalReactions;
    });

    return articles;
  }

  // obtener articulo por slug
  async findOneBySlug(slug: string) {
    const article = await this.articleRepository
      .createQueryBuilder('article')
      .where('article.slug = :slug', { slug })
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.tags', 'tags')
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
        'tags.id',
        'tags.name',
      ])
      .getOne();

    if (!article) {
      throw new Exceptions.NotFoundException('Article not found');
    }

    const [comments, reactions] = await Promise.all([
      this.commentService.getCommentsByArticleId(article.id),
      this.reactionService.getReactionsByArticleId(article.id),
    ]);

    article.reactions = reactions.map((reaction) => ({
      type: reaction.type,
      count: parseInt(reaction.count),
    })) as any[];

    article.comments = comments;

    return article;
  }

  // crear un articulo en borrador
  async draft(draftArticleDto: DraftArticleDto) {
    const newArticle = this.articleRepository.create(draftArticleDto);
    return this.articleRepository.save(newArticle);
  }
}
