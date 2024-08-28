import { Article } from 'src/articles/entities/article.entity';
import { CommentReaction } from 'src/comment-reactions/entities/comment-reaction.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Follower } from 'src/followers/entities/follower.entity';
import { Reaction } from 'src/reactions/entities/reaction.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true, length: 1000 })
  bio: string;

  @Column({ nullable: true })
  profile_picture: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relaciones

  @OneToMany(() => Follower, (follower) => follower.follower)
  followers: Follower[];

  @OneToMany(() => Follower, (follower) => follower.following)
  following: Follower[];

  @OneToMany(() => Article, (article) => article.user)
  articles: Article[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Reaction, (reaction) => reaction.user)
  reactions: Reaction[];

  @OneToMany(() => CommentReaction, (comment_reaction) => comment_reaction.user)
  comment_reactions: CommentReaction[];
}
