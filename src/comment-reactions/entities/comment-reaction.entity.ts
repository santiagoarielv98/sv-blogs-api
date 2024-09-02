import { Comment } from 'src/comments/entities/comment.entity';
import { User } from 'src/users/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['comment', 'user'])
export class CommentReaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created_at: Date;

  // Relaciones

  @ManyToOne(() => Comment, (comment) => comment.reactions)
  comment: Comment;

  @ManyToOne(() => User, (user) => user.comment_reactions)
  user: User;
}
