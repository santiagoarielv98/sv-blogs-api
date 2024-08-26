import type { OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class SeedsService implements OnModuleInit {
  constructor(
    private usersService: UsersService,
    private postsService: PostsService,
  ) {}
  async onModuleInit() {
    const user = await this.usersService.create({
      password: '12345678',
      email: 'demo@sv-tech.dev',
      username: 'demo',
      avatarUrl: null,
      bio: null,
    });

    const user2 = await this.usersService.create({
      password: '12345678',
      email: 'test@sv-tech.dev',
      username: 'test',
      avatarUrl: null,
      bio: null,
    });

    const _post = await this.postsService.create(
      {
        title: 'Demo Post',
        content: 'This is a demo post',
        published: true,
      },
      user.id,
    );

    const _postClone = await this.postsService.create(
      {
        title: 'Demo Post',
        content: 'This is a demo post clone',
        published: true,
      },
      user.id,
    );

    await this.postsService.create(
      {
        title: 'Test Post',
        content: 'This is a test post',
        published: true,
      },
      user2.id,
    );
  }
}
