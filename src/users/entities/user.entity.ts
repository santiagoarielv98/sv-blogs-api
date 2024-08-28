import { Follower } from 'src/followers/entities/follower.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @OneToMany(() => Follower, (follower) => follower.follower)
  followers: Follower[];

  @OneToMany(() => Follower, (follower) => follower.following)
  following: Follower[];
}
