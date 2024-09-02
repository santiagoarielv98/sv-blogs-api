import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Article } from 'src/articles/entities/article.entity';
import { CommentReaction } from 'src/comment-reactions/entities/comment-reaction.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Follower } from 'src/followers/entities/follower.entity';
import { Reaction } from 'src/reactions/entities/reaction.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { User } from 'src/users/entities/user.entity';
import { SeedsService } from './seeds.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
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
