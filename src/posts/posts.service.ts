import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import slugify from 'slugify';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private usersService: UsersService,
  ) {}

  findOneBySlug(slug: string) {
    return this.postsRepository.findOne({ where: { slug } });
  }
  async create(createPostDto: CreatePostDto, user: string) {
    const userEntity = await this.usersService.findOneByUsername(user);

    if (!userEntity) {
      throw new Error('User not found');
    }

    const post = this.postsRepository.create(createPostDto);

    post.slug = slugify(post.title, { lower: true, replacement: '-' });
    post.user = userEntity;

    return this.postsRepository.save(post);
  }

  findAll() {
    return this.postsRepository.find();
  }
}
