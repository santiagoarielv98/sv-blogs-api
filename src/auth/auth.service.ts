import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: CreateUserDto) {
    const newUser = await this.usersService.create(signUpDto);
    const payload = { sub: newUser.id, username: newUser.username };
    return {
      token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
      }),
      email: newUser.email,
    };
  }

  async validateUser(username: string, pass: string): Promise<any> {
    let user: User;
    if (username.includes('@')) {
      user = await this.usersService.findOneByEmail(username);
    } else {
      user = await this.usersService.findOneByUsername(username);
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    if (user && isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = { sub: user.id, username: user.username };
    return {
      token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
      }),
      email: user.email,
    };
  }
}
