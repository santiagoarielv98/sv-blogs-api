import { Comment } from 'src/comments/entities/comment.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CommentReaction {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => Comment, (comment) => comment.reactions)
  comment: Comment;

  @ManyToOne(() => User, (user) => user.comment_reactions)
  user: User;

  @Column({
    type: 'enum',
    enum: ['like', 'dislike', 'love', 'funny', 'angry'],
  })
  type: 'like' | 'dislike' | 'love' | 'funny' | 'angry';

  @CreateDateColumn()
  created_at: Date;
}
