import { ArticleTag } from 'src/article-tags/entities/article-tag.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Reaction } from 'src/reactions/entities/reaction.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  content: string;

  @Column({ nullable: true })
  summary: string;

  @Column({ default: false })
  published: boolean;

  @Column({ nullable: true })
  published_at: Date;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ unique: true, nullable: true })
  slug: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relaciones

  @ManyToOne(() => User, (user) => user.articles, { nullable: false })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.article)
  comments: Comment[];

  @OneToMany(() => Reaction, (reaction) => reaction.article)
  reactions: Reaction[];

  @OneToMany(() => ArticleTag, (article_tag) => article_tag.article)
  tags: ArticleTag[];
}
