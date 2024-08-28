import { Article } from 'src/articles/entities/article.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Reaction {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => Article, (article) => article.reactions)
  article: Article;

  @ManyToOne(() => User, (user) => user.reactions)
  user: User;

  @Column({
    type: 'enum',
    enum: ['like', 'dislike', 'love', 'funny', 'angry'],
  })
  type: 'like' | 'dislike' | 'love' | 'funny' | 'angry';

  @CreateDateColumn()
  created_at: Date;
}
