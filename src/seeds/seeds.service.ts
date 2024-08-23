import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class SeedsService implements OnModuleInit {
  constructor(private usersService: UsersService) {}
  async onModuleInit() {
    await this.usersService.create({
      password: '12345678',
      email: 'demo@sv-tech.dev',
      username: 'demo',
      avatarUrl: null,
      bio: null,
    });
    console.log('Seeds created');
  }
}
