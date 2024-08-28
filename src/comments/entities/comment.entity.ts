import { Article } from 'src/articles/entities/article.entity';
import { CommentReaction } from 'src/comment-reactions/entities/comment-reaction.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => Article, (article) => article.comments)
  article: Article;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @Column()
  content: string;

  @ManyToOne(() => Comment, (comment) => comment.replies)
  parent_comment: Comment;

  @OneToMany(() => Comment, (comment) => comment.parent_comment)
  replies: Comment[];

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => CommentReaction, (reaction) => reaction.comment)
  reactions: CommentReaction[];
}
