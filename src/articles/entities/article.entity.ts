import { User } from 'src/users/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Like } from '../../likes/entities/like.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Tag } from 'src/tags/entities/tag.entity';

@Entity()
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  coverImageURL: string;

  @Column({ unique: true })
  slug: string;

  @Column({ default: false })
  isPublished: boolean;

  @Column({ nullable: true })
  publishedAt: Date;

  @ManyToOne(() => User, (user) => user.articles)
  user: User;

  @OneToMany(() => Comment, (comment) => comment.article)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.article)
  likes: Like[];

  //tags
  @ManyToMany(() => Tag, (tag) => tag.articles)
  @JoinTable()
  tags: Tag[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
