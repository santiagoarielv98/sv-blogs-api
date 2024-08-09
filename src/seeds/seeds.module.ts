import { Module, OnModuleInit } from '@nestjs/common';
import { SeedsService } from './seeds.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Article } from 'src/articles/entities/article.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { Like } from 'src/likes/entities/like.entity';
import { Comment } from 'src/comments/entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Article, Tag, Like, Comment])],
  providers: [SeedsService],
})
export class SeedsModule implements OnModuleInit {
  constructor(private readonly seedsService: SeedsService) {}

  async onModuleInit() {
    if ((await this.seedsService.countUsers()) === 0) {
      const users = await this.seedsService.createUsers();
      console.log('Users created');
      const articles = await this.seedsService.createArticles({ users });
      console.log('Articles created');
      await this.seedsService.followUsers({ users });
      console.log('Users followed');
      const comments = await this.seedsService.createComments({
        users,
        articles,
      });
      console.log('Comments created');
      await this.seedsService.createLikes({ users, articles, comments });
      console.log('Likes created');

      const { article } = await this.seedsService.createUserAndArticle();
      console.log('User and Article created');
      console.log('Article ID:', article.id);

      console.log('Seeds created');
    }
  }
}
