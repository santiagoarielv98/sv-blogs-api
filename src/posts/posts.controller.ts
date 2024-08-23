import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { Public } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/users/decorators/user.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto, @User() user: any) {
    return this.postsService.create(createPostDto, user);
  }

  @Get()
  @Public()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':slug')
  @Public()
  findOneBySlug(@Param('slug') slug: string) {
    return this.postsService.findOneBySlug(slug);
  }
}
