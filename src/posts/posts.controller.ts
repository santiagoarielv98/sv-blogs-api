import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AuthUser } from 'src/auth/auth.interface';
import { Public } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/users/decorators/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';

@Controller('api/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto, @User() user: AuthUser) {
    return this.postsService.create(createPostDto, user.userId);
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

  @Delete(':id')
  delete(@Param('id') id: string, @User() user: AuthUser) {
    return this.postsService.delete(id, user.userId);
  }
}
