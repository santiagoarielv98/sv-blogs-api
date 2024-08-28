import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follower } from './entities/follower.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Follower)
    private followersRepository: Repository<Follower>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const isUserExist = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (isUserExist) {
      throw new BadRequestException('Email already exists');
    }
    const isUsernameExist = await this.usersRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (isUsernameExist) {
      throw new BadRequestException('Username already exists');
    }

    const newUser = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(newUser);
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: string) {
    // buscar y contar los seguidores
    return this.usersRepository
      .createQueryBuilder('user')
      .loadRelationCountAndMap('user.followers', 'user.followers')
      .loadRelationCountAndMap('user.following', 'user.following')
      .where('user.id = :id', { id })
      .getOne();
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }

  async follow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const follower = await this.usersRepository.findOne({
      where: { id: followerId },
    });
    const following = await this.usersRepository.findOne({
      where: { id: followingId },
    });

    if (!follower || !following) {
      throw new NotFoundException('User not found');
    }

    const isFollowing = await this.followersRepository.findOne({
      where: {
        follower: {
          id: followerId,
        },
        following: {
          id: followingId,
        },
      },
    });

    if (isFollowing) {
      throw new BadRequestException('You are already following this user');
    }

    const newFollower = this.followersRepository.create({
      follower,
      following,
    });

    return this.followersRepository.save(newFollower);
  }

  async unfollow(followerId: string, followingId: string) {
    const follower = await this.followersRepository.findOne({
      where: {
        follower: {
          id: followerId,
        },
        following: {
          id: followingId,
        },
      },
    });

    if (!follower) {
      throw new BadRequestException('You are not following this user');
    }

    return this.followersRepository.remove(follower);
  }

  findOneByUsername(username: string) {
    return this.usersRepository.findOne({ where: { username } });
  }

  async removeByEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return this.usersRepository.remove(user);
  }
}
