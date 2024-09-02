import { Comment } from 'src/comments/entities/comment.entity';
import { ArticleStatus } from 'src/config/constants';
import { Reaction } from 'src/reactions/entities/reaction.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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

  @Column({ type: 'enum', enum: ArticleStatus, default: ArticleStatus.DRAFT })
  status: ArticleStatus;

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
  author: User;

  @OneToMany(() => Comment, (comment) => comment.article)
  comments: Comment[];

  @OneToMany(() => Reaction, (reaction) => reaction.article)
  reactions: Reaction[];

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];
}
