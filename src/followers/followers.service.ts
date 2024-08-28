import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follower } from 'src/users/entities/follower.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FollowersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Follower)
    private followersRepository: Repository<Follower>,
  ) {}

  async follow(followerId: string, followingId: string) {
    // verificar si el usuario no se está siguiendo a sí mismo
    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself');
    }
    // verificar que existan los usuarios
    const follower = await this.usersRepository.findOne({
      where: { id: followerId },
    });
    const following = await this.usersRepository.findOne({
      where: { id: followingId },
    });
    if (!follower || !following) {
      throw new NotFoundException('User not found');
    }
    // verificar si ya se está siguiendo
    const followExists = await this.followersRepository.findOne({
      where: {
        follower: {
          id: followerId,
        },
        following: {
          id: followingId,
        },
      },
    });
    if (followExists) {
      throw new ConflictException('You are already following this user');
    }
    // seguir al usuario
    const newFollow = this.followersRepository.create({
      follower,
      following,
    });
    return this.followersRepository.save(newFollow);
  }

  async unfollow(followerId: string, followingId: string) {
    // verificar si el usuario no se está dejando de seguir a sí mismo
    if (followerId === followingId) {
      throw new BadRequestException('You cannot unfollow yourself');
    }
    // verificar que existan los usuarios
    const follower = await this.usersRepository.findOne({
      where: { id: followerId },
    });
    const following = await this.usersRepository.findOne({
      where: { id: followingId },
    });
    if (!follower || !following) {
      throw new NotFoundException('User not found');
    }
    // verificar si se está siguiendo
    const followExists = await this.followersRepository.findOne({
      where: {
        follower: {
          id: followerId,
        },
        following: {
          id: followingId,
        },
      },
    });
    if (!followExists) {
      throw new ConflictException('You are not following this user');
    }
    // dejar de seguir al usuario
    return this.followersRepository.remove(followExists);
  }
}
