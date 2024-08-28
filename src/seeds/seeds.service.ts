import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ArticleTag } from 'src/article-tags/entities/article-tag.entity';
import { Article } from 'src/articles/entities/article.entity';
import { CommentReaction } from 'src/comment-reactions/entities/comment-reaction.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Follower } from 'src/followers/entities/follower.entity';
import { Reaction } from 'src/reactions/entities/reaction.entity';
import { User } from 'src/users/entities/user.entity';
import * as USER_MOCK_DATA from './mocks/USER_MOCK_DATA.json';
import * as TAG_MOCK_DATA from './mocks/TAG_MOCK_DATA.json';
import * as ARTICLE_MOCK_DATA from './mocks/ARTICLE_MOCK_DATA.json';
import * as COMMENT_MOCK_DATA from './mocks/COMMENT_MOCK_DATA.json';
import * as REPLIES_MOCK_DATA from './mocks/REPLIES_MOCK_DATA.json';
import { Tag } from 'src/tags/entities/tag.entity';
import { ArticleStatus, CommentReactionType } from 'src/config/constants';

@Injectable()
export class SeedsService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(ArticleTag)
    private articleTagRepository: Repository<ArticleTag>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(CommentReaction)
    private commentReactionRepository: Repository<CommentReaction>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Follower)
    private followerRepository: Repository<Follower>,
    @InjectRepository(Reaction)
    private reactionRepository: Repository<Reaction>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  onApplicationBootstrap() {
    this.seeds();
  }

  async seeds() {
    if ((await this.userRepository.count()) > 0) return;
    // clear all data
    await this.commentReactionRepository.delete({});
    await this.commentRepository.delete({});
    await this.articleTagRepository.delete({});
    await this.articleRepository.delete({});
    await this.followerRepository.delete({});
    await this.reactionRepository.delete({});
    await this.userRepository.delete({});
    await this.tagRepository.delete({});
    console.log('Deleted all data');

    const users = await this.userRepository.save(USER_MOCK_DATA);

    const tags = await this.tagRepository.save(
      TAG_MOCK_DATA.map((tag) => ({ name: tag })),
    );
    console.log('Created tags');

    const articles = await this.articleRepository.save(
      ARTICLE_MOCK_DATA.map((article) => ({
        ...article,
        published: true,
        author: users[Math.floor(Math.random() * users.length)],
      })),
    );
    console.log('Created articles');

    const _articleTags = await this.articleTagRepository.save(
      articles.map((article) => ({
        article,
        status: ArticleStatus.PUBLISHED,
        tag: tags[Math.floor(Math.random() * tags.length)],
      })),
    );
    console.log('Created article tags');

    const _followers = await this.followerRepository.save(
      users.map((user) => ({
        follower: users[Math.floor(Math.random() * users.length)],
        following: user,
      })),
    );
    console.log('Created followers');

    const comments = await this.commentRepository.save(
      COMMENT_MOCK_DATA.map((comment) => ({
        ...comment,
        user: users[Math.floor(Math.random() * users.length)],
        article: articles[Math.floor(Math.random() * articles.length)],
      })),
    );
    console.log('Created comments');

    const replies = await this.commentRepository.save(
      REPLIES_MOCK_DATA.map((reply) => {
        const parentComment =
          comments[Math.floor(Math.random() * comments.length)];
        return {
          ...reply,
          user: users[Math.floor(Math.random() * users.length)],
          article: parentComment.article,
          parent: parentComment,
        };
      }),
    );
    console.log('Created replies');

    const _commentReactions = await this.commentReactionRepository.save(
      comments.map((comment) => ({
        user: users[Math.floor(Math.random() * users.length)],
        comment,
        type: CommentReactionType.LIKE,
      })),
    );
    console.log('Created comment reactions');

    const _repliesReactions = await this.commentReactionRepository.save(
      replies.map((reply) => ({
        user: users[Math.floor(Math.random() * users.length)],
        comment: reply,
        type: CommentReactionType.LIKE,
      })),
    );
    console.log('Created replies reactions');

    const _reactions = await this.reactionRepository.save(
      articles.map((article) => ({
        user: users[Math.floor(Math.random() * users.length)],
        article,
        type: CommentReactionType.LIKE,
      })),
    );

    console.log('Created reactions');

    console.log('Seeds created');
  }
}
