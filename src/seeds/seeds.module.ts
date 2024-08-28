import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArticleTag } from 'src/article-tags/entities/article-tag.entity';
import { Article } from 'src/articles/entities/article.entity';
import { CommentReaction } from 'src/comment-reactions/entities/comment-reaction.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Follower } from 'src/followers/entities/follower.entity';
import { Reaction } from 'src/reactions/entities/reaction.entity';
import { User } from 'src/users/entities/user.entity';
import { SeedsService } from './seeds.service';
import { Tag } from 'src/tags/entities/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ArticleTag,
      Article,
      CommentReaction,
      Comment,
      Follower,
      Reaction,
      User,
      Tag,
    ]),
  ],
  providers: [SeedsService],
})
export class SeedsModule {}
