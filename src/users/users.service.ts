import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Follower } from './entities/follower.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Follower)
    private followersRepository: Repository<Follower>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // verificar si el email no está en uso
    const emailExists = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (emailExists) {
      throw new ConflictException('Email already in use');
    }

    // verificar si el nombre de usuario no está en uso
    const usernameExists = await this.usersRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (usernameExists) {
      throw new ConflictException('Username already in use');
    }

    // crear el usuario
    const newUser = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newUser);
  }

  findOne(id: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .loadRelationCountAndMap('user.followers', 'user.followers')
      .loadRelationCountAndMap('user.following', 'user.following')
      .where('user.id = :id', { id })
      .select([
        'user.id',
        'user.username',
        'user.email',
        'user.bio',
        'user.profile_picture',
        'user.followers',
        'user.following',
      ])
      .getOne();
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }

  findOneByUsername(username: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .loadRelationCountAndMap('user.followers', 'user.followers')
      .loadRelationCountAndMap('user.following', 'user.following')
      .where('user.username = :username', { username })
      .select([
        'user.id',
        'user.username',
        'user.email',
        'user.bio',
        'user.profile_picture',
        'user.followers',
        'user.following',
      ])
      .getOne();
  }
}
