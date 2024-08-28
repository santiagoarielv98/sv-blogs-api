import { Article } from 'src/articles/entities/article.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Follower } from './follower.entity';
import { ArticleLike } from 'src/articles/entities/article-likes.entity';
import { ArticleComment } from 'src/comments/entities/article-comments.entity';

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

  // RELATIONSHIPS

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];

  @OneToMany(() => Follower, (follower) => follower.follower)
  followers: Follower[];

  @OneToMany(() => Follower, (follower) => follower.following)
  following: Follower[];

  @OneToMany(() => ArticleLike, (like) => like.user)
  likes: ArticleLike[];

  @OneToMany(() => ArticleComment, (comment) => comment.user)
  comments: ArticleComment[];
}
