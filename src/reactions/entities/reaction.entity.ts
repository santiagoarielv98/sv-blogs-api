import { Article } from 'src/articles/entities/article.entity';
import { ReactionType } from 'src/config/constants';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['article', 'user'])
export class Reaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ReactionType,
  })
  type: ReactionType;

  @CreateDateColumn()
  created_at: Date;

  // Relaciones

  @ManyToOne(() => Article, (article) => article.reactions, { nullable: false })
  article: Article;

  @ManyToOne(() => User, (user) => user.reactions, { nullable: false })
  user: User;

  isReacted: boolean;
  articleId: string;
  count: number;
}
