import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Article } from 'src/articles/entities/article.entity';
import { User } from 'src/users/entities/user.entity';
import { Like } from '../../likes/entities/like.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @ManyToOne(() => Article, (article) => article.comments)
  article: Article;

  @ManyToOne(() => Comment, (comment) => comment.replies)
  parent: Comment;

  @OneToMany(() => Comment, (comment) => comment.parent)
  replies: Comment[];

  @OneToMany(() => Like, (like) => like.comment)
  likes: Like[];

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
