import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { Article } from '../articles/entities/article.entity';
import { Like } from '../likes/entities/like.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Tag } from '../tags/entities/tag.entity';

import * as USERS from 'src/mocks/USERS_MOCK_DATA.json';
import * as ARTICLES from 'src/mocks/ARTICLES_MOCK_DATA.json';
import * as COMMENTS from 'src/mocks/COMMENTS_MOCK_DATA.json';

@Injectable()
export class SeedsService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  async createUsers() {
    return await this.usersRepository.save(USERS);
  }

  async createArticles({ users }: { users: User[] }) {
    const articles = ARTICLES.map((article) => ({
      ...article,
      user: users[Math.floor(Math.random() * users.length)],
    }));
    return await this.articlesRepository.save(articles);
  }

  async followUsers({ users }: { users: User[] }) {
    const user = users[0];
    user.following = users.slice(1);
    return await this.usersRepository.save(user);
  }

  async createComments({
    users,
    articles,
  }: {
    users: User[];
    articles: Article[];
  }) {
    const comments = articles.map((article) => ({
      article,
      user: users[Math.floor(Math.random() * users.length)],
      content: COMMENTS[Math.floor(Math.random() * COMMENTS.length)].content,
    }));
    return await this.commentsRepository.save(comments);
  }

  async createLikes({
    users,
    articles,
    comments,
  }: {
    users: User[];
    articles: Article[];
    comments: Comment[];
  }) {
    const likes = [
      ...articles.map((article) => ({
        article,
        user: users[Math.floor(Math.random() * users.length)],
      })),
      ...comments.map((comment) => ({
        comment,
        user: users[Math.floor(Math.random() * users.length)],
      })),
    ];
    return await this.likesRepository.save(likes);
  }
}
