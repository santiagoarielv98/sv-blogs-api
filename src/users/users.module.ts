import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Follower } from './entities/follower.entity';
import { FollowersService } from 'src/followers/followers.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Follower])],
  controllers: [UsersController],
  providers: [UsersService, FollowersService],
  exports: [UsersService],
})
export class UsersModule {}
