import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.usersRepository.save(
      this.usersRepository.create(createUserDto),
    );
  }

  findOneByUsername(username: string) {
    return this.usersRepository.findOne({
      where: { username },
      select: ['id', 'username', 'email', 'password'],
    });
  }

  findOneByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'username', 'email', 'password'],
    });
  }

  findOneById(id: string) {
    return this.usersRepository.findOne({
      where: { id },
      select: ['id', 'username', 'email', 'password'],
    });
  }
}
